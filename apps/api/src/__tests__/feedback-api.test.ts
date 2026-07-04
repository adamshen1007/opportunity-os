import { describe, expect, it } from "vitest";
import {
  API_BUG_REPORT_SEVERITIES,
  API_BUG_REPORT_STATUSES,
  API_CREATE_BUG_REPORT_ROUTE,
  API_CREATE_FEEDBACK_ROUTE,
  API_ERROR_CODES,
  API_FEEDBACK_RATING_TARGETS,
  API_FEEDBACK_REASON_CATEGORIES,
  API_FEEDBACK_STATUSES,
  API_GET_FEEDBACK_ROUTE,
  API_LIST_FEEDBACK_ROUTE,
  createSyntheticApiBugReportStore,
  createInMemoryFeedbackStore,
  createSyntheticApiFeedbackStore,
  createSyntheticApiRequest,
  handleCreateBugReportRequest,
  handleCreateFeedbackRequest,
  handleGetFeedbackRequest,
  handleListFeedbackRequest,
  syntheticApiBugReport,
  syntheticApiBugReportRequestBody,
  syntheticApiFeedback,
  syntheticApiFeedbackRequestBody,
  syntheticApiOpportunity,
  syntheticApiSession,
  validateCreateBugReportBody,
  validateCreateFeedbackBody
} from "../index.js";

describe("Feedback API behavior", () => {
  it("creates deterministic feedback in an explicit in-memory store", async () => {
    const store = createInMemoryFeedbackStore({
      clock: () => "2026-07-04T00:00:00.000Z",
      idFactory: () => "feedback-created-1"
    });
    const response = await handleCreateFeedbackRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/v1/feedback" },
        body: syntheticApiFeedbackRequestBody
      }),
      store
    );

    expect(API_CREATE_FEEDBACK_ROUTE.path).toBe("/feedback");
    expect(response.ok).toBe(true);
    if (response.ok) {
      expect(response.data.feedbackId).toBe("feedback-created-1");
      expect(response.data.opportunityId).toBe(syntheticApiOpportunity.opportunityId);
      expect(response.data.ratings.map((rating) => rating.target)).toEqual([
        API_FEEDBACK_RATING_TARGETS.usefulness,
        API_FEEDBACK_RATING_TARGETS.evidenceQuality,
        API_FEEDBACK_RATING_TARGETS.rankingQuality
      ]);
    }
  });

  it("lists and reads feedback deterministically", async () => {
    const store = createSyntheticApiFeedbackStore();
    const listed = await handleListFeedbackRequest(
      createSyntheticApiRequest({ query: { opportunityId: syntheticApiOpportunity.opportunityId } }),
      store
    );
    const found = await handleGetFeedbackRequest(
      createSyntheticApiRequest({ params: { feedbackId: syntheticApiFeedback.feedbackId } }),
      store
    );

    expect(API_LIST_FEEDBACK_ROUTE.operationId).toBe("listFeedback");
    expect(API_GET_FEEDBACK_ROUTE.operationId).toBe("getFeedback");
    expect(listed.ok).toBe(true);
    expect(listed.data.totalCount).toBe(1);
    expect(found.ok).toBe(true);
    if (found.ok) {
      expect(found.data.status).toBe(API_FEEDBACK_STATUSES.rated);
      expect(found.data.reasonCategories).toEqual([API_FEEDBACK_REASON_CATEGORIES.weakEvidence]);
    }
  });

  it("validates feedback requests with safe issue details", async () => {
    const store = createSyntheticApiFeedbackStore();
    const validation = validateCreateFeedbackBody({
      opportunityId: "",
      status: "unsupported" as never,
      reasonCategories: ["unsafe-token-value" as never],
      ratings: [{ target: "unsupported-target" as never, value: 99 as never }]
    });
    const response = await handleCreateFeedbackRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/v1/feedback" },
        body: {
          opportunityId: "",
          status: "unsupported" as never,
          reasonCategories: ["unsafe-token-value" as never],
          ratings: [{ target: "unsupported-target" as never, value: 99 as never }]
        }
      }),
      store
    );

    expect(validation.valid).toBe(false);
    expect(response.ok).toBe(false);
    if (!response.ok) {
      expect(response.error.code).toBe(API_ERROR_CODES.validationFailed);
      expect(response.error.details).toContain("opportunityId:missing-required-field");
      expect(JSON.stringify(response.error)).not.toContain("unsafe-token-value");
    }
  });

  it("returns safe not found feedback errors", async () => {
    const response = await handleGetFeedbackRequest(
      createSyntheticApiRequest({ params: { feedbackId: "missing-feedback" } }),
      createSyntheticApiFeedbackStore()
    );

    expect(response.ok).toBe(false);
    if (!response.ok) {
      expect(response.error.code).toBe(API_ERROR_CODES.notFound);
      expect(JSON.stringify(response.error)).not.toContain("stack");
      expect(JSON.stringify(response.error)).not.toContain("cause");
    }
  });

  it("creates deterministic beta bug reports without external services", async () => {
    const store = createSyntheticApiBugReportStore();
    const response = await handleCreateBugReportRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/v1/feedback/bug-reports" },
        body: syntheticApiBugReportRequestBody
      }),
      store
    );
    const reports = await store.listBugReports();

    expect(API_CREATE_BUG_REPORT_ROUTE.operationId).toBe("createPrivateBetaBugReport");
    expect(API_CREATE_BUG_REPORT_ROUTE.path).toBe("/feedback/bug-reports");
    expect(response.ok).toBe(true);
    if (response.ok) {
      expect(response.data.bugReportId).toBe("bug-report-synthetic-created-1");
      expect(response.data.sessionId).toBe(syntheticApiSession.sessionId);
      expect(response.data.severity).toBe(API_BUG_REPORT_SEVERITIES.medium);
      expect(response.data.status).toBe(API_BUG_REPORT_STATUSES.open);
    }
    expect(reports).toHaveLength(2);
    expect(reports[0]?.bugReportId).toBe(syntheticApiBugReport.bugReportId);
  });

  it("validates beta bug reports with safe details", async () => {
    const unsafeDescription = "raw token secret stack provider payload";
    const validation = validateCreateBugReportBody({
      sessionId: "",
      title: "",
      safeDescription: unsafeDescription,
      severity: "critical" as never
    });
    const response = await handleCreateBugReportRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/v1/feedback/bug-reports" },
        body: {
          sessionId: "",
          title: "",
          safeDescription: unsafeDescription,
          severity: "critical" as never
        }
      }),
      createSyntheticApiBugReportStore()
    );

    expect(validation.valid).toBe(false);
    expect(response.ok).toBe(false);
    if (!response.ok) {
      expect(response.error.details).toEqual([
        "sessionId:missing-required-field",
        "title:missing-required-field",
        "severity:unsupported-value"
      ]);
      expect(JSON.stringify(response.error)).not.toMatch(/token|secret|stack|provider payload/iu);
    }
  });
});
