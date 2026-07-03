import { describe, expect, it } from "vitest";
import {
  API_GET_OPPORTUNITY_ROUTE,
  API_GET_RANKING_ROUTE,
  API_HEALTH_ROUTE,
  API_LIST_OPPORTUNITIES_ROUTE,
  API_RANK_OPPORTUNITIES_ROUTE,
  createApiApplication,
  createApiOpenApiDocument,
  createSyntheticApiRequest,
  handleApiHealthRequest,
  handleGetOpportunityRequest,
  handleGetRankingRequest,
  handleListOpportunitiesRequest,
  handleRankOpportunitiesRequest,
  syntheticApiOpportunity,
  syntheticApiOpportunityPort,
  syntheticApiRanking,
  syntheticApiRankingPort
} from "../index.js";

describe("API integration contracts", () => {
  it("registers the public REST surface in a deterministic application contract", () => {
    const routes = [
      API_HEALTH_ROUTE,
      API_LIST_OPPORTUNITIES_ROUTE,
      API_GET_OPPORTUNITY_ROUTE,
      API_RANK_OPPORTUNITIES_ROUTE,
      API_GET_RANKING_ROUTE
    ];
    const app = createApiApplication({
      serviceName: "opportunity-api",
      version: "0.0.0",
      routes
    });
    const document = createApiOpenApiDocument({
      title: "Opportunity OS API",
      version: app.version,
      routes: app.router.routes
    });

    expect(app.router.duplicateRouteKeys).toEqual([]);
    expect(document.paths["/v1/health"]?.get?.operationId).toBe("getHealth");
    expect(document.paths["/v1/opportunities"]?.get?.operationId).toBe("listOpportunities");
    expect(document.paths["/v1/rankings"]?.post?.operationId).toBe("rankOpportunities");
  });

  it("serves health, opportunity, and ranking requests through explicit ports", async () => {
    const health = handleApiHealthRequest(createSyntheticApiRequest(), {
      serviceName: "opportunity-api",
      version: "0.0.0",
      clock: () => "2026-07-03T00:00:00.000Z"
    });
    const opportunities = await handleListOpportunitiesRequest(
      createSyntheticApiRequest({ query: { limit: "25", sourceType: "synthetic" } }),
      syntheticApiOpportunityPort
    );
    const opportunity = await handleGetOpportunityRequest(
      createSyntheticApiRequest({ params: { opportunityId: syntheticApiOpportunity.opportunityId } }),
      syntheticApiOpportunityPort
    );
    const ranking = await handleRankOpportunitiesRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/v1/rankings" },
        body: { opportunityIds: [syntheticApiOpportunity.opportunityId] }
      }),
      syntheticApiRankingPort
    );
    const rankingRead = await handleGetRankingRequest(
      createSyntheticApiRequest({ params: { rankingId: syntheticApiRanking.rankingId } }),
      syntheticApiRankingPort
    );

    expect(health.ok).toBe(true);
    expect(opportunities.ok).toBe(true);
    expect(opportunity.ok).toBe(true);
    expect(ranking.ok).toBe(true);
    expect(rankingRead.ok).toBe(true);
  });
});
