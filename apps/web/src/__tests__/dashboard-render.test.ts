import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { dashboardFeedbackRatingLabels, dashboardFeedbackReasonLabels } from "../features/feedback/feedback-labels";
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
});
