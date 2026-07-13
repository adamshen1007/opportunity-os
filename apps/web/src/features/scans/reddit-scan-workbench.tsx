"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  createDashboardApiClient,
  createScan,
  listScans,
  type DashboardApiScanMode,
  type DashboardApiScanResultDto,
  type DashboardApiScanSource
} from "../../api";
import { ErrorState, LoadingState } from "../../components/states";
import { safeDashboardErrorMessage } from "../../components/states/state-copy";
import { Badge, Button, Input, Panel, Select } from "../../components/ui";
import { getDashboardScanFixture } from "../../testing";
import { useActiveScan } from "./active-scan-context";

type ScanStatus = "ready" | "running" | "completed" | "fallback" | "error";

interface ScanState {
  readonly status: ScanStatus;
  readonly result?: DashboardApiScanResultDto;
  readonly message?: string;
}

const scanModeOptions = [
  { label: "Fixture fallback", value: "fixture" },
  { label: "Live if configured", value: "live" }
] as const;

const sourceOptions = [
  { label: "Stack Exchange", value: "stack-exchange" },
  { label: "Reddit (approval required for live)", value: "reddit" }
] as const;

function getDashboardApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL ?? "http://127.0.0.1:4000";
}

function createCorrelationId(): string {
  return `dashboard-scan-${Date.now().toString(36)}`;
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function normalizeLimit(value: FormDataEntryValue | null): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 25) return 5;
  return parsed;
}

function readText(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function toSafeScanMessage(message: string | undefined): string {
  if (!message) return safeDashboardErrorMessage;
  if (/api[_-]?key|access[_-]?token|refresh[_-]?token|password|secret|credential|authorization|bearer|stack|raw payload/iu.test(message)) {
    return safeDashboardErrorMessage;
  }
  return message;
}

function ScanResultView({ result }: { readonly result: DashboardApiScanResultDto }) {
  return (
    <div className="scan-output" aria-label="Scan results">
      <div className="scan-status-grid">
        <div>
          <span>Scan</span>
          <strong>{result.scanId}</strong>
        </div>
        <div>
          <span>Source</span>
          <strong>{result.source.provider === "reddit" ? `r/${result.source.subreddit}` : result.source.site}</strong>
        </div>
        <div>
          <span>Items</span>
          <strong>{result.source.itemCount}</strong>
        </div>
        <div>
          <span>Mode</span>
          <strong>{result.mode === "live" ? "Live configured" : "Fixture fallback"}</strong>
        </div>
      </div>

      <p className="scan-attribution">
        Source attribution: {result.source.attribution}
        {result.source.quota?.remaining !== undefined ? ` · API quota remaining: ${result.source.quota.remaining}` : ""}
      </p>

      <div className="scan-status-grid" aria-label="Validation metrics">
        <div><span>Retrieved</span><strong>{result.validationMetrics.retrievedItems}</strong></div>
        <div><span>Opportunities</span><strong>{result.validationMetrics.generatedOpportunities}</strong></div>
        <div><span>Evidence coverage</span><strong>{formatPercent(result.validationMetrics.evidenceCoverage)}</strong></div>
        <div><span>Average confidence</span><strong>{formatPercent(result.validationMetrics.averageConfidence)}</strong></div>
      </div>

      <details className="scan-details">
        <summary>View pipeline details and generated results</summary>
        <ol className="scan-stage-list" aria-label="Scan stages">
          {result.stages.map((stage) => (
            <li key={stage.name}>
              <Badge tone={stage.status === "completed" ? "success" : "warning"}>{stage.status}</Badge>
              <div>
                <strong>{stage.name}</strong>
                <span>{stage.safeMessage}</span>
              </div>
            </li>
          ))}
        </ol>

        <div className="scan-results-grid">
        {result.opportunities.map((opportunity) => (
          <article className="scan-result-card" key={opportunity.opportunityId}>
            <div className="scan-result-heading">
              <Badge tone="success">{`Rank #${opportunity.rank.position}`}</Badge>
              <span>Score {opportunity.rank.score}</span>
            </div>
            <h4>{opportunity.title}</h4>
            <p>{opportunity.summary}</p>
            <div className="scan-result-metrics">
              <span>Confidence {formatPercent(opportunity.confidence)}</span>
              <span>{opportunity.rank.explanation}</span>
            </div>

            <div className="scan-evidence-list" aria-label={`${opportunity.title} evidence`}>
              {opportunity.evidence.map((evidence) => (
                <div className="scan-evidence-item" key={evidence.evidenceId}>
                  <strong>Evidence</strong>
                  <p>{evidence.summary}</p>
                  <span>Confidence {formatPercent(evidence.confidence)}</span>
                  {evidence.permalink ? (
                    <a href={evidence.permalink} rel="noreferrer" target="_blank">
                      Open source context
                    </a>
                  ) : null}
                </div>
              ))}
            </div>

            <dl className="scan-provenance-list">
              <div>
                <dt>Raw content</dt>
                <dd>{opportunity.provenance.rawContentId}</dd>
              </div>
              <div>
                <dt>Normalized content</dt>
                <dd>{opportunity.provenance.normalizedContentId}</dd>
              </div>
              <div>
                <dt>Analysis</dt>
                <dd>{opportunity.provenance.analysisRequestId}</dd>
              </div>
              <div>
                <dt>Ranking</dt>
                <dd>{opportunity.provenance.rankingRunId}</dd>
              </div>
            </dl>
          </article>
        ))}
        </div>
      </details>
    </div>
  );
}

export function RedditScanWorkbench() {
  const { scan: activeScan, setActiveScan } = useActiveScan();
  const [source, setSource] = useState<DashboardApiScanSource>("stack-exchange");
  const [scanState, setScanState] = useState<ScanState>({
    status: "ready",
    message: "Use fixture mode for a local walkthrough, or live mode when credentials are configured."
  });
  const [recentScans, setRecentScans] = useState<readonly DashboardApiScanResultDto[]>([]);
  const apiBaseUrl = useMemo(() => getDashboardApiBaseUrl(), []);
  const isRunning = scanState.status === "running";

  useEffect(() => {
    const client = createDashboardApiClient({
      baseUrl: apiBaseUrl,
      correlationId: createCorrelationId(),
      fetch: window.fetch.bind(window)
    });
    if (activeScan) {
      setScanState({
        status: "completed",
        result: activeScan,
        message: "Restored the last persisted scan. Review its evidence and feedback below."
      });
    }
    void listScans(client, 5).then((result) => {
      if (result.ok) setRecentScans(result.data.scans);
    }).catch(() => undefined);
  }, [activeScan, apiBaseUrl]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const mode = (readText(formData.get("mode")) ?? "fixture") as DashboardApiScanMode;
    const accessToken = readText(formData.get("accessToken"));
    const request = {
      source,
      subreddit: source === "reddit" ? readText(formData.get("subreddit")) ?? "opportunity" : undefined,
      site: source === "stack-exchange" ? readText(formData.get("site")) ?? "stackoverflow" : undefined,
      query: readText(formData.get("query")),
      tags: source === "stack-exchange" ? (readText(formData.get("tags"))?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? []) : [],
      limit: normalizeLimit(formData.get("limit")),
      mode
    };

    setScanState({
      status: "running",
      message: `Scanning ${source === "reddit" ? `r/${request.subreddit}` : request.site} through the MVP pipeline.`
    });

    const client = createDashboardApiClient({
      baseUrl: apiBaseUrl,
      correlationId: createCorrelationId(),
      fetch: window.fetch.bind(window),
      accessToken
    });

    try {
      const result = await createScan(client, request);
      if (result.ok) {
        setActiveScan(result.data);
        setRecentScans((current) => [result.data, ...current.filter((scan) => scan.scanId !== result.data.scanId)].slice(0, 5));
        setScanState({
          status: "completed",
          result: result.data,
          message: "Scan completed. Review ranked opportunities, evidence, and provenance below."
        });
        return;
      }

      setScanState({
        status: mode === "live" ? "error" : "fallback",
        ...(mode === "live" ? {} : { result: getDashboardScanFixture(source) }),
        message: mode === "live"
          ? `${toSafeScanMessage(result.error.message)} No demo results were substituted.`
          : `${toSafeScanMessage(result.error.message)} Showing deterministic fixture results instead.`
      });
    } catch {
      setScanState({
        status: mode === "live" ? "error" : "fallback",
        ...(mode === "live" ? {} : { result: getDashboardScanFixture(source) }),
        message: mode === "live"
          ? "The live API is not reachable. No demo results were substituted."
          : "The API is not reachable from this browser session. Showing deterministic fixture results instead."
      });
    }
  }

  return (
    <Panel title="Run a new scan" hint="Choose a source and describe the workflow problem you want Opportunity OS to investigate. Fixture mode is safe for demonstrations; live mode uses configured external services.">
      <div className="scan-workbench">
        <form className="scan-form" onSubmit={handleSubmit}>
          <Select
            label="Datasource"
            hint="Select where Opportunity OS should collect public evidence."
            name="source"
            options={sourceOptions}
            value={source}
            onChange={(event) => setSource(event.currentTarget.value as DashboardApiScanSource)}
            disabled={isRunning}
          />
          {source === "reddit" ? (
            <Input label="Subreddit" name="subreddit" defaultValue="opportunity" placeholder="opportunity" disabled={isRunning} />
          ) : (
            <Select
              label="Stack Exchange site"
              name="site"
              options={[
                { label: "Stack Overflow", value: "stackoverflow" },
                { label: "Software Engineering", value: "softwareengineering" },
                { label: "Project Management", value: "pm" },
                { label: "Workplace", value: "workplace" }
              ]}
              defaultValue="stackoverflow"
              disabled={isRunning}
            />
          )}
          <Input label="Query" name="query" defaultValue="manual review" placeholder="manual review" hint="Describe a recurring problem, job, or workflow rather than a product solution." disabled={isRunning} />
          {source === "stack-exchange" ? (
            <Input label="Tags (comma separated)" name="tags" placeholder="typescript, deployment" disabled={isRunning} />
          ) : null}
          <Input label="Limit" name="limit" defaultValue="5" placeholder="5" disabled={isRunning} />
          <Select label="Mode" name="mode" options={scanModeOptions} defaultValue="fixture" hint="Fixture mode uses deterministic sample data. Live mode calls configured providers." disabled={isRunning} />
          <Input
            label="Pilot access code (live mode only)"
            name="accessToken"
            type="password"
            autoComplete="off"
            placeholder="Enter your invite code"
            disabled={isRunning}
          />
          <Button type="submit" disabled={isRunning}>
            {isRunning ? "Scanning" : "Run scan"}
          </Button>
        </form>

        <div className="scan-copy" role="status">
          <Badge tone={scanState.status === "completed" ? "success" : scanState.status === "fallback" ? "warning" : "neutral"}>
            {scanState.status}
          </Badge>
          <p>{scanState.message}</p>
          <p>{source === "reddit" ? "Live Reddit scans remain gated until Reddit approves API access." : "Stack Exchange live scans use the official read-only API."}</p>
        </div>

        {isRunning ? <LoadingState title="Scan running" message="The pipeline is collecting, analyzing, and ranking safe output." /> : null}
        {scanState.status === "error" ? (
          <div className="scan-error-actions">
            <ErrorState title="Live scan unavailable" message={scanState.message ?? safeDashboardErrorMessage} />
            <Button onClick={() => setScanState({ status: "fallback", result: getDashboardScanFixture(source), message: "Showing explicit demo data. These are not live results." })}>Try demo data</Button>
          </div>
        ) : null}
        {scanState.result ? <ScanResultView result={scanState.result} /> : null}
        {recentScans.length > 0 ? (
          <section className="scan-history" aria-label="Recent scan history">
            <div>
              <h3>Recent scans</h3>
              <p>Reopen completed scans without rerunning external providers.</p>
            </div>
            <ul>
              {recentScans.map((scan) => (
                <li key={scan.scanId}>
                  <button type="button" onClick={() => {
                    setActiveScan(scan);
                    setScanState({ status: "completed", result: scan, message: "Restored a persisted scan from your recent history." });
                  }}>
                    <strong>{scan.source.attribution}</strong>
                    <span>{scan.opportunities.length} opportunities</span>
                    <span>{scan.mode}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </Panel>
  );
}

export const MultiSourceScanWorkbench = RedditScanWorkbench;
