import { createElement } from "react";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { dashboardFeedbackRatingLabels, dashboardFeedbackReasonLabels } from "../features/feedback/feedback-labels";
import { mapScanResultToDashboardOpportunities } from "../features/scans/scan-opportunity-adapter";
import { renderDashboardElement } from "../testing/component-render";
import {
  dashboardBetaInviteWorkflowFixture,
  dashboardBetaSessionFixture,
  dashboardBugReportFixture,
  dashboardFeedbackFixtures,
  dashboardScanFixture,
  dashboardStackExchangeScanFixture,
  getDashboardScanFixture
} from "../testing";

describe("Dashboard component test infrastructure", () => {
  it("renders simple dashboard elements to inspectable static output", () => {
    const rendered = renderDashboardElement(
      createElement("section", { "aria-label": "Dashboard test section" }, [
        createElement("h2", { key: "heading" }, "Dashboard state"),
        createElement("p", { key: "copy" }, "Synthetic component output")
      ])
    );

    expect(rendered.markup).toContain("Dashboard test section");
    expect(rendered.text).toContain("Dashboard state");
    expect(rendered.text).toContain("Synthetic component output");
  });

  it("keeps deterministic feedback labels available for validation UI", () => {
    expect(dashboardFeedbackRatingLabels.usefulness).toBe("Usefulness");
    expect(dashboardFeedbackRatingLabels["evidence-quality"]).toBe("Evidence quality");
    expect(dashboardFeedbackRatingLabels["ranking-quality"]).toBe("Ranking quality");
    expect(dashboardFeedbackReasonLabels["weak-evidence"]).toBe("Weak evidence");
    expect(dashboardFeedbackReasonLabels["poor-ranking"]).toBe("Poor ranking");
    expect(dashboardFeedbackFixtures[0]?.ratings).toHaveLength(3);
  });

  it("keeps deterministic private beta workflow fixtures available", () => {
    expect(dashboardBetaSessionFixture.status).toBe("active");
    expect(dashboardBetaSessionFixture.onboardingSteps.map((step) => step.status)).toEqual([
      "complete",
      "current",
      "pending"
    ]);
    expect(dashboardBetaInviteWorkflowFixture.safeMessage).toContain("Invite accepted");
    expect(dashboardBugReportFixture.status).toBe("open");
    expect(dashboardBugReportFixture.title).toBe("Synthetic dashboard issue");
  });

  it("keeps deterministic scan fixtures available for dashboard fallback", () => {
    expect(dashboardScanFixture.mode).toBe("fixture");
    expect(dashboardScanFixture.safeMetadata.rawProviderPayloadStored).toBe(false);
    expect(dashboardScanFixture.stages.map((stage) => stage.name)).toEqual([
      "source",
      "raw-content",
      "normalization",
      "llm-analysis",
      "candidate-generation",
      "opportunity-generation",
      "ranking"
    ]);
    expect(dashboardScanFixture.opportunities[0]?.evidence[0]?.summary).toContain("manual review");
    expect(dashboardStackExchangeScanFixture.source.attribution).toBe("Stack Exchange");
    expect(dashboardStackExchangeScanFixture.source.provider).toBe("stack-exchange");
    expect(dashboardStackExchangeScanFixture.stages[0]?.safeMessage).toContain("Stack Exchange");
    expect(dashboardStackExchangeScanFixture.opportunities[0]?.evidence[0]).toMatchObject({
      sourceType: "stack-exchange",
      provenance: { sourcePlatform: "stack-exchange" }
    });
    expect(dashboardStackExchangeScanFixture.opportunities[0]?.provenance).not.toHaveProperty("redditPostId");
    expect(getDashboardScanFixture("reddit").source.attribution).toBe("Reddit");
    expect(getDashboardScanFixture("stack-exchange").source.attribution).toBe("Stack Exchange");
  });

  it("maps the active scan into the visible opportunity list", () => {
    const opportunities = mapScanResultToDashboardOpportunities(dashboardStackExchangeScanFixture);

    expect(opportunities).toHaveLength(dashboardStackExchangeScanFixture.opportunities.length);
    expect(opportunities[0]).toMatchObject({
      opportunityId: "stack-exchange-opportunity-1",
      detailHref: "#scan-opportunity-stack-exchange-opportunity-1",
      title: dashboardStackExchangeScanFixture.opportunities[0]?.title,
      provenance: { sourceName: "Stack Exchange fixture scan" }
    });
    expect(opportunities[0]?.explanation.summary).toBe(
      dashboardStackExchangeScanFixture.opportunities[0]?.rank.explanation
    );
    expect(opportunities[0]?.evidenceIds).toEqual(["stack-exchange-evidence-1"]);
  });

  it("renders clustered synthesis, citations, evidence stance, and traceability", () => {
    const source = readFileSync(path.resolve(import.meta.dirname, "../features/scans/reddit-scan-workbench.tsx"), "utf8");

    expect(source).toContain("Exploratory cluster");
    expect(source).toContain("View synthesized problem and citations");
    expect(source).toContain('label="Target user"');
    expect(source).toContain("citationIds.length");
    expect(source).toContain("evidence.stance");
    expect(source).toContain("Evidence cluster");
    expect(source).toContain("Cluster fingerprint");
  });

  it("clears deleted scans from recent history and the active dashboard state", () => {
    const workbench = readFileSync(path.resolve(import.meta.dirname, "../features/scans/reddit-scan-workbench.tsx"), "utf8");
    const activeScanContext = readFileSync(path.resolve(import.meta.dirname, "../features/scans/active-scan-context.tsx"), "utf8");

    expect(workbench).toContain("clearActiveScan(scan.scanId)");
    expect(workbench).toContain('setScanState({ status: "ready", message: "Scan deleted. Run a new scan to continue." })');
    expect(activeScanContext).toContain("window.localStorage.removeItem(LAST_SCAN_STORAGE_KEY)");
    expect(activeScanContext).toContain('setStatus("empty")');
  });
});
