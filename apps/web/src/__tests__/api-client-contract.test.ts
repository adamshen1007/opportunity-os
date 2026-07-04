import { describe, expect, it } from "vitest";
import {
  createDashboardApiClient,
  createFeedback,
  generatedApiRoutes,
  getFeedback,
  getOpportunity,
  getRanking,
  listFeedback,
  listOpportunities,
  rankOpportunities
} from "../api";
import { dashboardFeedbackFixtures, dashboardOpportunityFixtures, dashboardRankingFixtures } from "../testing";

const syntheticApiOpportunity = dashboardOpportunityFixtures[0]!;
const syntheticApiRanking = dashboardRankingFixtures[0]!;
const syntheticApiFeedback = dashboardFeedbackFixtures[0]!;

function createApiSuccessResponse<TData>(data: TData, meta: { readonly correlationId: string; readonly requestId?: string }) {
  return {
    ok: true,
    data,
    meta
  };
}

function createApiFailureResponse(
  error: {
    readonly code: string;
    readonly statusCode: number;
    readonly message: string;
    readonly correlationId: string;
    readonly requestId?: string;
  },
  meta: { readonly correlationId: string; readonly requestId?: string }
) {
  return {
    ok: false,
    error,
    meta
  };
}

function createJsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body
  } as Response;
}

describe("Dashboard API client contracts", () => {
  it("lists opportunities through the generated API route contract", async () => {
    const calls: string[] = [];
    const client = createDashboardApiClient({
      baseUrl: "https://api.test",
      correlationId: "correlation-001",
      fetch: async (input) => {
        calls.push(String(input));
        return createJsonResponse(
          createApiSuccessResponse(
            {
              opportunities: [syntheticApiOpportunity],
              totalCount: 1
            },
            { correlationId: "correlation-001" }
          )
        );
      }
    });

    const result = await listOpportunities(client, { limit: 10, status: "ranked" });

    expect(result.ok).toBe(true);
    expect(calls[0]).toBe(`https://api.test${generatedApiRoutes.listOpportunities.path}?limit=10&status=ranked`);
    if (result.ok) {
      expect(result.data.opportunities[0]?.opportunityId).toBe(syntheticApiOpportunity.opportunityId);
    }
  });

  it("reads opportunity and ranking resources without a live API server", async () => {
    const calls: string[] = [];
    const client = createDashboardApiClient({
      baseUrl: "https://api.test",
      correlationId: "correlation-002",
      requestId: "request-002",
      fetch: async (input) => {
        calls.push(String(input));
        return createJsonResponse(
          createApiSuccessResponse(String(input).includes("/rankings/") ? syntheticApiRanking : syntheticApiOpportunity, {
            correlationId: "correlation-002",
            requestId: "request-002"
          })
        );
      }
    });

    const opportunity = await getOpportunity(client, "synthetic opportunity/001");
    const ranking = await getRanking(client, "synthetic ranking/001");

    expect(opportunity.ok).toBe(true);
    expect(ranking.ok).toBe(true);
    expect(calls).toEqual([
      `https://api.test${generatedApiRoutes.getOpportunity.path.replace(":opportunityId", "synthetic%20opportunity%2F001")}`,
      `https://api.test${generatedApiRoutes.getRanking.path.replace(":rankingId", "synthetic%20ranking%2F001")}`
    ]);
  });

  it("posts ranking requests through the typed API layer", async () => {
    let requestBody = "";
    const client = createDashboardApiClient({
      baseUrl: "https://api.test",
      correlationId: "correlation-003",
      fetch: async (_input, init) => {
        requestBody = String(init?.body);
        return createJsonResponse(createApiSuccessResponse(syntheticApiRanking, { correlationId: "correlation-003" }));
      }
    });

    const result = await rankOpportunities(client, ["synthetic-opportunity-001"]);

    expect(result.ok).toBe(true);
    expect(JSON.parse(requestBody)).toEqual({ opportunityIds: ["synthetic-opportunity-001"] });
  });

  it("creates, lists, and reads feedback through the typed API layer", async () => {
    const calls: string[] = [];
    const bodies: string[] = [];
    const client = createDashboardApiClient({
      baseUrl: "https://api.test",
      correlationId: "correlation-feedback-001",
      fetch: async (input, init) => {
        calls.push(String(input));
        if (init?.body) {
          bodies.push(String(init.body));
        }
        const isList = String(input).includes("?opportunityId=");
        return createJsonResponse(
          createApiSuccessResponse(
            isList
              ? {
                  feedback: [syntheticApiFeedback],
                  totalCount: 1
                }
              : syntheticApiFeedback,
            { correlationId: "correlation-feedback-001" }
          )
        );
      }
    });

    const created = await createFeedback(client, {
      opportunityId: syntheticApiOpportunity.opportunityId,
      status: "rated",
      reasonCategories: ["weak-evidence"],
      ratings: syntheticApiFeedback.ratings
    });
    const listed = await listFeedback(client, { opportunityId: syntheticApiOpportunity.opportunityId });
    const read = await getFeedback(client, "feedback synthetic/001");

    expect(created.ok).toBe(true);
    expect(listed.ok).toBe(true);
    expect(read.ok).toBe(true);
    expect(calls).toEqual([
      `https://api.test${generatedApiRoutes.createFeedback.path}`,
      `https://api.test${generatedApiRoutes.listFeedback.path}?opportunityId=synthetic-opportunity-001`,
      `https://api.test${generatedApiRoutes.getFeedback.path.replace(":feedbackId", "feedback%20synthetic%2F001")}`
    ]);
    expect(JSON.parse(bodies[0]!)).toEqual({
      opportunityId: "synthetic-opportunity-001",
      status: "rated",
      reasonCategories: ["weak-evidence"],
      ratings: syntheticApiFeedback.ratings
    });
  });

  it("maps API errors without exposing secrets, stacks, raw payloads, or internal details", async () => {
    const client = createDashboardApiClient({
      baseUrl: "https://api.test",
      correlationId: "correlation-004",
      fetch: async () =>
        createJsonResponse(
          createApiFailureResponse(
            {
              code: "api.internal",
              statusCode: 500,
              message: "raw payload included token secret stack",
              correlationId: "correlation-004"
            },
            { correlationId: "correlation-004" }
          )
        )
    });

    const result = await listOpportunities(client);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toBe("The dashboard could not complete the request. Retry or check the API health endpoint.");
      expect(JSON.stringify(result.error)).not.toMatch(/token|secret|stack|raw payload/iu);
    }
  });
});
