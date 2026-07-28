import { describe, expect, it } from "vitest";
import {
  API_AUTHORIZATION_DECISIONS,
  API_AUTH_STATES,
  API_ERROR_CODES,
  API_GET_OPPORTUNITY_ROUTE,
  API_GET_RANKING_ROUTE,
  API_HEALTH_ROUTE,
  API_LIST_OPPORTUNITIES_ROUTE,
  API_RANK_OPPORTUNITIES_ROUTE,
  API_VALIDATION_ISSUE_CODES,
  authorizeApiRequest,
  createAnonymousAuthContext,
  createApiEndpointContext,
  createAuthenticatedAuthContext,
  createRouteAuthorizationPolicy,
  handleApiHealthRequest,
  handleGetOpportunityRequest,
  handleGetRankingRequest,
  handleListOpportunitiesRequest,
  handleRankOpportunitiesRequest,
  type ApiOpportunityDto,
  type ApiOpportunityQueryPort,
  type ApiRankingCommandPort,
  type ApiRankingDto
} from "../index.js";

const requestContext = {
  correlationId: "correlation-1",
  requestId: "request-1",
  method: "GET",
  path: "/v1/opportunities"
};

const opportunity: ApiOpportunityDto = {
  opportunityId: "opportunity-1",
  title: "Synthetic opportunity",
  summary: "Synthetic summary",
  status: "ranked",
  confidence: 0.82,
  evidence: [
    {
      evidenceId: "evidence-1",
      sourceType: "synthetic",
      summary: "Synthetic evidence",
      confidence: 0.8
    }
  ],
  source: {
    sourceId: "source-1",
    sourceType: "synthetic"
  },
  rank: {
    position: 1,
    score: 82
  }
};

const ranking: ApiRankingDto = {
  rankingId: "ranking-1",
  status: "ranked",
  generatedAt: "2026-07-03T00:00:00.000Z",
  rankedOpportunities: [
    {
      opportunityId: "opportunity-1",
      position: 1,
      score: 82,
      explanation: {
        summary: "Synthetic ranking explanation",
        factors: [
          {
            factorId: "confidence",
            label: "Confidence",
            weight: 1,
            contribution: 82,
            message: "Confidence contributed to the deterministic score."
          }
        ]
      }
    }
  ]
};

const opportunityPort: ApiOpportunityQueryPort = {
  async listOpportunities(input) {
    return {
      opportunities: [opportunity],
      pagination: {
        limit: input.pagination.limit,
        direction: input.pagination.direction,
        hasNextPage: false,
        hasPreviousPage: false
      },
      totalCount: 1
    };
  },
  async getOpportunity(input) {
    return input.opportunityId === opportunity.opportunityId ? opportunity : undefined;
  }
};

const rankingPort: ApiRankingCommandPort = {
  async rankOpportunities(input) {
    return {
      ...ranking,
      rankedOpportunities: ranking.rankedOpportunities.filter((item) =>
        input.opportunityIds.includes(item.opportunityId)
      )
    };
  },
  async getRanking(input) {
    return input.rankingId === ranking.rankingId ? ranking : undefined;
  }
};

describe("API auth and endpoint contracts", () => {
  it("creates request context with explicit auth state", () => {
    const principal = createAuthenticatedAuthContext({
      principalId: "principal-1",
      permissions: ["opportunities:read"]
    });
    const context = createApiEndpointContext(requestContext, principal);

    expect(context.apiVersion).toBe("v1");
    expect(context.auth.state).toBe(API_AUTH_STATES.authenticated);
    expect(context.auth.principal?.permissions).toEqual(["opportunities:read"]);
  });

  it("authorizes route policies without naming a concrete auth system", () => {
    const policy = createRouteAuthorizationPolicy(API_LIST_OPPORTUNITIES_ROUTE, ["opportunities:read"]);
    const anonymous = authorizeApiRequest({ auth: createAnonymousAuthContext(), policy });
    const allowed = authorizeApiRequest({
      auth: createAuthenticatedAuthContext({
        principalId: "principal-1",
        permissions: ["opportunities:read"]
      }),
      policy
    });

    expect(anonymous.decision).toBe(API_AUTHORIZATION_DECISIONS.denied);
    expect(allowed.decision).toBe(API_AUTHORIZATION_DECISIONS.allowed);
  });

  it("returns deterministic health output", () => {
    const response = handleApiHealthRequest(
      {
        context: requestContext
      },
      {
        serviceName: "opportunity-api",
        version: "0.0.0",
        releaseSha: "a".repeat(40),
        environment: "production",
        clock: () => "2026-07-03T00:00:00.000Z"
      }
    );

    expect(API_HEALTH_ROUTE.path).toBe("/health");
    expect(response.ok).toBe(true);
    expect(response.data.status).toBe("ok");
    expect(response.data.environment).toBe("production");
    expect(response.data.releaseSha).toBe("a".repeat(40));
    expect(response.data.dependencies).toEqual([]);
    expect(response.data.checkedAt).toBe("2026-07-03T00:00:00.000Z");
  });

  it("returns degraded health when a dependency reports a safe failure", () => {
    const response = handleApiHealthRequest(
      {
        context: requestContext
      },
      {
        serviceName: "opportunity-api",
        version: "0.0.0",
        environment: "production",
        dependencies: [
          {
            name: "database",
            status: "unavailable",
            checkedAt: "2026-07-03T00:00:00.000Z",
            safeMessage: "Database health check unavailable."
          }
        ],
        clock: () => "2026-07-03T00:00:00.000Z"
      }
    );

    expect(response.data.status).toBe("degraded");
    expect(response.data.dependencies[0]?.safeMessage).toBe("Database health check unavailable.");
  });

  it("lists opportunities through an explicit port", async () => {
    const response = await handleListOpportunitiesRequest(
      {
        context: requestContext,
        query: { limit: "10", status: "ranked" }
      },
      opportunityPort
    );

    expect(API_LIST_OPPORTUNITIES_ROUTE.requiresAuthentication).toBe(true);
    expect(response.ok).toBe(true);
    if (response.ok) {
      expect(response.data.opportunities[0]?.opportunityId).toBe("opportunity-1");
      expect(response.data.totalCount).toBe(1);
    }
  });

  it("reads one opportunity and returns safe not found errors", async () => {
    const found = await handleGetOpportunityRequest(
      {
        context: requestContext,
        params: { opportunityId: "opportunity-1" }
      },
      opportunityPort
    );
    const missing = await handleGetOpportunityRequest(
      {
        context: requestContext,
        params: { opportunityId: "missing" }
      },
      opportunityPort
    );

    expect(API_GET_OPPORTUNITY_ROUTE.path).toBe("/opportunities/:opportunityId");
    expect(found.ok).toBe(true);
    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.error.code).toBe(API_ERROR_CODES.notFound);
      expect(JSON.stringify(missing.error)).not.toContain("secret");
    }
  });

  it("ranks opportunities through an explicit port", async () => {
    const response = await handleRankOpportunitiesRequest(
      {
        context: { ...requestContext, method: "POST", path: "/v1/rankings" },
        body: { opportunityIds: ["opportunity-1"] }
      },
      rankingPort
    );

    expect(API_RANK_OPPORTUNITIES_ROUTE.path).toBe("/rankings");
    expect(response.ok).toBe(true);
    if (response.ok) {
      expect(response.data.rankedOpportunities[0]?.position).toBe(1);
    }
  });

  it("validates ranking requests and reads ranking results", async () => {
    const invalid = await handleRankOpportunitiesRequest(
      {
        context: { ...requestContext, method: "POST", path: "/v1/rankings" },
        body: { opportunityIds: [] }
      },
      rankingPort
    );
    const found = await handleGetRankingRequest(
      {
        context: requestContext,
        params: { rankingId: "ranking-1" }
      },
      rankingPort
    );

    expect(API_GET_RANKING_ROUTE.path).toBe("/rankings/:rankingId");
    expect(invalid.ok).toBe(false);
    if (!invalid.ok) {
      expect(invalid.error.details?.[0]).toContain(API_VALIDATION_ISSUE_CODES.missingRequiredField);
    }
    expect(found.ok).toBe(true);
  });
});
