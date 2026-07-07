import { describe, expect, it } from "vitest";
import {
  API_CREATE_BUG_REPORT_ROUTE,
  API_CREATE_FEEDBACK_ROUTE,
  API_GET_OPPORTUNITY_ROUTE,
  API_GET_FEEDBACK_ROUTE,
  API_GET_RANKING_ROUTE,
  API_HEALTH_ROUTE,
  API_LIST_FEEDBACK_ROUTE,
  API_LIST_OPPORTUNITIES_ROUTE,
  API_RANK_OPPORTUNITIES_ROUTE,
  createSyntheticApiBugReportStore,
  createSyntheticApiFeedbackStore,
  createApiApplication,
  createApiOpenApiDocument,
  createSyntheticApiRequest,
  handleCreateBugReportRequest,
  handleCreateFeedbackRequest,
  handleApiHealthRequest,
  handleGetFeedbackRequest,
  handleGetOpportunityRequest,
  handleGetRankingRequest,
  handleListFeedbackRequest,
  handleListOpportunitiesRequest,
  handleRankOpportunitiesRequest,
  syntheticApiBugReportRequestBody,
  syntheticApiFeedback,
  syntheticApiFeedbackRequestBody,
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
      API_GET_RANKING_ROUTE,
      API_CREATE_FEEDBACK_ROUTE,
      API_LIST_FEEDBACK_ROUTE,
      API_GET_FEEDBACK_ROUTE,
      API_CREATE_BUG_REPORT_ROUTE
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
    expect(document.paths["/v1/feedback"]?.post?.operationId).toBe("createFeedback");
    expect(document.paths["/v1/feedback"]?.get?.operationId).toBe("listFeedback");
    expect(document.paths["/v1/feedback/bug-reports"]?.post?.operationId).toBe("createPrivateBetaBugReport");
  });

  it("serves health, opportunity, and ranking requests through explicit ports", async () => {
    const health = handleApiHealthRequest(createSyntheticApiRequest(), {
      serviceName: "opportunity-api",
      version: "0.0.0",
      environment: "production",
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
    expect(health.data.environment).toBe("production");
    expect(opportunities.ok).toBe(true);
    expect(opportunity.ok).toBe(true);
    expect(ranking.ok).toBe(true);
    expect(rankingRead.ok).toBe(true);
  });

  it("serves feedback requests through the in-memory validation store", async () => {
    const feedbackStore = createSyntheticApiFeedbackStore();
    const created = await handleCreateFeedbackRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/v1/feedback" },
        body: syntheticApiFeedbackRequestBody
      }),
      feedbackStore
    );
    const listed = await handleListFeedbackRequest(
      createSyntheticApiRequest({ query: { opportunityId: syntheticApiOpportunity.opportunityId } }),
      feedbackStore
    );
    const read = await handleGetFeedbackRequest(
      createSyntheticApiRequest({ params: { feedbackId: syntheticApiFeedback.feedbackId } }),
      feedbackStore
    );

    expect(created.ok).toBe(true);
    expect(listed.ok).toBe(true);
    expect(read.ok).toBe(true);
    expect(listed.data.totalCount).toBe(2);
  });

  it("serves beta bug report requests through the in-memory validation store", async () => {
    const bugReportStore = createSyntheticApiBugReportStore();
    const created = await handleCreateBugReportRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/v1/feedback/bug-reports" },
        body: syntheticApiBugReportRequestBody
      }),
      bugReportStore
    );

    expect(created.ok).toBe(true);
    if (created.ok) {
      expect(created.data.status).toBe("open");
      expect(created.data.title).toBe("Synthetic dashboard issue");
    }
  });
});
