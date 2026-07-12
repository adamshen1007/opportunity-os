import { describe, expect, it } from "vitest";
import { generatedApiRoutes } from "../api/generated/routes";
import { DASHBOARD_ROUTE_IDS, dashboardNavItems, dashboardRoutes } from "../navigation";

describe("Dashboard route stability", () => {
  it("keeps visible dashboard routes stable", () => {
    expect(DASHBOARD_ROUTE_IDS).toEqual({
      home: "home",
      opportunities: "opportunities",
      opportunityDetail: "opportunity-detail",
      rankings: "rankings",
      evidence: "evidence"
    });
    expect(dashboardRoutes.map((route) => route.href)).toEqual([
      "/",
      "/opportunities",
      "/opportunities/synthetic-opportunity-001",
      "/rankings",
      "/evidence"
    ]);
  });

  it("keeps navigation aligned with routed pages", () => {
    expect(dashboardNavItems.map((item) => item.href)).toEqual(dashboardRoutes.map((route) => route.href));
    expect(dashboardNavItems.map((item) => item.label)).toEqual([
      "Overview",
      "Opportunities",
      "Detail",
      "Rankings",
      "Evidence"
    ]);
  });

  it("keeps generated API route keys stable for the dashboard client", () => {
    expect(Object.keys(generatedApiRoutes).sort()).toEqual([
      "createFeedback",
      "createPrivateBetaBugReport",
      "createRedditScan",
      "createScan",
      "getFeedback",
      "getOpportunity",
      "getRanking",
      "listFeedback",
      "listOpportunities",
      "rankOpportunities"
    ]);
  });
});
