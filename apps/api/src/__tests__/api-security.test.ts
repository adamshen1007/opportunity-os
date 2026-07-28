import { describe, expect, it } from "vitest";
import {
  API_ERROR_CODES,
  createSyntheticApiBugReportStore,
  createSyntheticApiInviteStore,
  createApiError,
  createSyntheticApiFeedbackStore,
  createSyntheticApiRequest,
  handleAcceptInviteRequest,
  handleCreateBugReportRequest,
  handleCreateFeedbackRequest,
  handleGetOpportunityRequest,
  handleGetFeedbackRequest,
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

  it("keeps feedback validation and missing feedback failures safe", async () => {
    const invalidFeedback = await handleCreateFeedbackRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/v1/feedback" },
        body: {
          opportunityId: "",
          status: "unsupported" as never,
          reasonCategories: ["authorization: bearer unsafe-value" as never],
          ratings: [{ target: "api_key=unsafe-value" as never, value: 99 as never }]
        }
      }),
      createSyntheticApiFeedbackStore()
    );
    const missingFeedback = await handleGetFeedbackRequest(
      createSyntheticApiRequest({ params: { feedbackId: "missing-feedback" } }),
      createSyntheticApiFeedbackStore()
    );

    expect(invalidFeedback.ok).toBe(false);
    expect(missingFeedback.ok).toBe(false);
    const serialized = JSON.stringify({ invalidFeedback, missingFeedback });
    for (const unsafe of unsafeSamples) {
      expect(serialized).not.toContain(unsafe);
    }
  });

  it("keeps invite validation and session failures safe", async () => {
    const invalidInvite = await handleAcceptInviteRequest(
      createSyntheticApiRequest({
        body: {
          inviteCode: "token=unsafe-value"
        }
      }),
      createSyntheticApiInviteStore()
    );

    expect(invalidInvite.ok).toBe(false);
    const serialized = JSON.stringify(invalidInvite);
    for (const unsafe of unsafeSamples) {
      expect(serialized).not.toContain(unsafe);
    }
  });

  it("keeps beta bug report validation failures safe", async () => {
    const invalidReport = await handleCreateBugReportRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/v1/feedback/bug-reports" },
        body: {
          title: "",
          safeDescription: "token=unsafe-value password=unsafe-value stack trace",
          severity: "api_key=unsafe-value" as never
        }
      }),
      createSyntheticApiBugReportStore()
    );

    expect(invalidReport.ok).toBe(false);
    const serialized = JSON.stringify(invalidReport);
    for (const unsafe of unsafeSamples) {
      expect(serialized).not.toContain(unsafe);
    }
    expect(serialized).not.toContain("stack trace");
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
