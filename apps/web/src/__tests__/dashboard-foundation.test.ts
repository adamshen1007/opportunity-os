import { describe, expect, it } from "vitest";
import { safeDashboardErrorMessage } from "../components/states/state-copy";
import { dashboardNavItems, dashboardRoutes } from "../navigation";
import {
  dashboardEvidenceFixtures,
  dashboardFeedbackFixtures,
  dashboardOpportunityFixtures,
  dashboardRankingFixtures
} from "../testing";

describe("Dashboard MVP foundation", () => {
  it("defines stable navigation from the route map", () => {
    expect(dashboardRoutes.map((route) => route.href)).toEqual([
      "/",
      "/opportunities",
      "/opportunities/synthetic-opportunity-001",
      "/rankings",
      "/evidence"
    ]);
    expect(dashboardNavItems).toHaveLength(dashboardRoutes.length);
  });

  it("uses deterministic synthetic fixtures without secret-like values", () => {
    const serializedFixtures = JSON.stringify({
      evidence: dashboardEvidenceFixtures,
      feedback: dashboardFeedbackFixtures,
      opportunities: dashboardOpportunityFixtures,
      rankings: dashboardRankingFixtures
    });

    expect(serializedFixtures).toContain("synthetic-opportunity-001");
    expect(serializedFixtures).toContain("feedback-synthetic-001");
    expect(serializedFixtures).not.toMatch(/api[_-]?key|token|password|secret|credential|authorization/iu);
  });

  it("keeps error copy safe and actionable", () => {
    expect(safeDashboardErrorMessage).toContain("Retry");
    expect(safeDashboardErrorMessage).not.toMatch(/stack|cause|payload|token|secret|credential/iu);
  });
});
