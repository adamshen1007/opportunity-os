"use client";

import { useMemo, useState, type FormEvent } from "react";
import { createDashboardApiClient, createRedditScan, type DashboardApiScanMode, type DashboardApiScanResultDto } from "../../api";
import { ErrorState, LoadingState } from "../../components/states";
import { safeDashboardErrorMessage } from "../../components/states/state-copy";
import { Badge, Button, Input, Panel, Select } from "../../components/ui";
import { dashboardScanFixture } from "../../testing";

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
          <strong>r/{result.source.subreddit}</strong>
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
    </div>
  );
}

export function RedditScanWorkbench() {
  const [scanState, setScanState] = useState<ScanState>({
    status: "ready",
    result: dashboardScanFixture,
    message: "Use fixture mode for a local walkthrough, or live mode when credentials are configured."
  });
  const apiBaseUrl = useMemo(() => getDashboardApiBaseUrl(), []);
  const isRunning = scanState.status === "running";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const mode = (readText(formData.get("mode")) ?? "fixture") as DashboardApiScanMode;
    const request = {
      subreddit: readText(formData.get("subreddit")) ?? "opportunity",
      query: readText(formData.get("query")),
      limit: normalizeLimit(formData.get("limit")),
      mode
    };

    setScanState({
      status: "running",
      message: `Scanning r/${request.subreddit} through the MVP pipeline.`
    });

    const client = createDashboardApiClient({
      baseUrl: apiBaseUrl,
      correlationId: createCorrelationId(),
      fetch: window.fetch.bind(window)
    });

    try {
      const result = await createRedditScan(client, request);
      if (result.ok) {
        setScanState({
          status: "completed",
          result: result.data,
          message: "Scan completed. Review ranked opportunities, evidence, and provenance below."
        });
        return;
      }

      setScanState({
        status: "fallback",
        result: dashboardScanFixture,
        message: `${toSafeScanMessage(result.error.message)} Showing deterministic fixture results instead.`
      });
    } catch {
      setScanState({
        status: "fallback",
        result: dashboardScanFixture,
        message: "The API is not reachable from this browser session. Showing deterministic fixture results instead."
      });
    }
  }

  return (
    <Panel title="Run Reddit Scan">
      <div className="scan-workbench">
        <form className="scan-form" onSubmit={handleSubmit}>
          <Input label="Subreddit" name="subreddit" defaultValue="opportunity" placeholder="opportunity" disabled={isRunning} />
          <Input label="Query" name="query" defaultValue="manual review" placeholder="manual review" disabled={isRunning} />
          <Input label="Limit" name="limit" defaultValue="5" placeholder="5" disabled={isRunning} />
          <Select label="Mode" name="mode" options={scanModeOptions} defaultValue="fixture" disabled={isRunning} />
          <Button type="submit" disabled={isRunning}>
            {isRunning ? "Scanning" : "Run scan"}
          </Button>
        </form>

        <div className="scan-copy">
          <Badge tone={scanState.status === "completed" ? "success" : scanState.status === "fallback" ? "warning" : "neutral"}>
            {scanState.status}
          </Badge>
          <p>{scanState.message}</p>
          <p>API target: {apiBaseUrl}</p>
        </div>

        {isRunning ? <LoadingState title="Scan running" message="The pipeline is collecting, analyzing, and ranking safe output." /> : null}
        {scanState.status === "error" ? <ErrorState title="Scan unavailable" message={safeDashboardErrorMessage} /> : null}
        {scanState.result ? <ScanResultView result={scanState.result} /> : null}
      </div>
    </Panel>
  );
}
