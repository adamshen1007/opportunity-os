import { describe, expect, it } from "vitest";
import {
  API_ERROR_CODES,
  createApiError,
  createSyntheticApiRequest,
  handleGetOpportunityRequest,
  handleRankOpportunitiesRequest,
  mapUnknownErrorToApiError,
  syntheticApiOpportunityPort,
  syntheticApiRankingPort
} from "../index.js";

const unsafeSamples = [
  "password=unsafe-value",
  "api_key=unsafe-value",
  "token=unsafe-value",
  "authorization: bearer unsafe-value",
  "dsn=unsafe-value",
  "credential=unsafe-value"
] as const;

describe("API security contracts", () => {
  it("maps unknown errors without leaking unsafe values", () => {
    const mapped = mapUnknownErrorToApiError({
      error: new Error(unsafeSamples.join(" ")),
      correlationId: "correlation-synthetic-1",
      requestId: "request-synthetic-1"
    });
    const serialized = JSON.stringify(mapped);

    expect(mapped.code).toBe(API_ERROR_CODES.internal);
    for (const unsafe of unsafeSamples) {
      expect(serialized).not.toContain(unsafe);
    }
  });

  it("keeps validation and missing-resource failures safe", async () => {
    const invalidRanking = await handleRankOpportunitiesRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/v1/rankings" },
        body: { opportunityIds: [] }
      }),
      syntheticApiRankingPort
    );
    const missingOpportunity = await handleGetOpportunityRequest(
      createSyntheticApiRequest({ params: { opportunityId: "missing" } }),
      syntheticApiOpportunityPort
    );

    expect(invalidRanking.ok).toBe(false);
    expect(missingOpportunity.ok).toBe(false);
    expect(JSON.stringify(invalidRanking)).not.toContain("unsafe-value");
    expect(JSON.stringify(missingOpportunity)).not.toContain("unsafe-value");
  });

  it("creates explicit API errors without stack output", () => {
    const error = createApiError({
      code: API_ERROR_CODES.forbidden,
      statusCode: 403,
      message: "Permission is required.",
      correlationId: "correlation-synthetic-1"
    });
    const serialized = JSON.stringify(error);

    expect(serialized).toContain(API_ERROR_CODES.forbidden);
    expect(serialized).not.toContain("stack");
    expect(serialized).not.toContain("cause");
  });
});
