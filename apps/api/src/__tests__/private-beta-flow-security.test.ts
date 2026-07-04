import { describe, expect, it } from "vitest";
import {
  API_BUG_REPORT_STATUSES,
  API_FEEDBACK_RATING_TARGETS,
  API_FEEDBACK_REASON_CATEGORIES,
  API_FEEDBACK_STATUSES,
  API_SESSION_STATUSES,
  createInMemoryBugReportStore,
  createInMemoryFeedbackStore,
  createSyntheticApiInviteStore,
  createSyntheticApiRequest,
  handleAcceptInviteRequest,
  handleCreateBugReportRequest,
  handleCreateFeedbackRequest,
  handleGetSessionRequest,
  handleListFeedbackRequest,
  syntheticApiBugReportRequestBody,
  syntheticApiOpportunity,
  syntheticApiSession,
  syntheticPrivateBetaInviteCode
} from "../index.js";

const unsafeFlowSamples = [
  syntheticPrivateBetaInviteCode,
  "password=unsafe-value",
  "authorization: bearer unsafe-value",
  "token=unsafe-value",
  "client_secret=unsafe-value",
  "stack trace",
  "raw provider response"
] as const;

describe("Private Beta security and end-to-end validation flow", () => {
  it("covers invite onboarding dashboard feedback ratings and bug reporting without unsafe output", async () => {
    const inviteStore = createSyntheticApiInviteStore();
    const feedbackStore = createInMemoryFeedbackStore({
      clock: () => "2026-07-04T00:00:00.000Z",
      idFactory: createSequentialId("feedback-flow")
    });
    const bugReportStore = createInMemoryBugReportStore({
      clock: () => "2026-07-04T00:00:00.000Z",
      idFactory: createSequentialId("bug-report-flow")
    });

    const acceptedInvite = await handleAcceptInviteRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/v1/auth/invites/accept" },
        body: {
          inviteCode: syntheticPrivateBetaInviteCode,
          displayName: "Design Partner"
        }
      }),
      inviteStore
    );

    expect(acceptedInvite.ok).toBe(true);
    if (!acceptedInvite.ok) {
      return;
    }
    expect(acceptedInvite.data.session.status).toBe(API_SESSION_STATUSES.active);

    const session = await handleGetSessionRequest(
      createSyntheticApiRequest({
        params: {
          sessionId: acceptedInvite.data.session.sessionId
        }
      }),
      inviteStore
    );

    expect(session.ok).toBe(true);
    if (session.ok) {
      expect(session.data.principal.permissions).toEqual(["private-beta:access"]);
    }

    const saved = await handleCreateFeedbackRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/v1/feedback" },
        body: {
          opportunityId: syntheticApiOpportunity.opportunityId,
          status: API_FEEDBACK_STATUSES.saved,
          reasonCategories: [],
          ratings: []
        }
      }),
      feedbackStore
    );
    const dismissed = await handleCreateFeedbackRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/v1/feedback" },
        body: {
          opportunityId: syntheticApiOpportunity.opportunityId,
          status: API_FEEDBACK_STATUSES.dismissed,
          reasonCategories: [API_FEEDBACK_REASON_CATEGORIES.notActionable],
          ratings: []
        }
      }),
      feedbackStore
    );
    const rated = await handleCreateFeedbackRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/v1/feedback" },
        body: {
          opportunityId: syntheticApiOpportunity.opportunityId,
          status: API_FEEDBACK_STATUSES.reasonProvided,
          reasonCategories: [API_FEEDBACK_REASON_CATEGORIES.poorRanking],
          ratings: [
            { target: API_FEEDBACK_RATING_TARGETS.usefulness, value: 5 },
            { target: API_FEEDBACK_RATING_TARGETS.evidenceQuality, value: 4 },
            { target: API_FEEDBACK_RATING_TARGETS.rankingQuality, value: 3 }
          ],
          safeMetadata: {
            sessionId: acceptedInvite.data.session.sessionId
          }
        }
      }),
      feedbackStore
    );

    expect(saved.ok).toBe(true);
    expect(dismissed.ok).toBe(true);
    expect(rated.ok).toBe(true);

    const listedFeedback = await handleListFeedbackRequest(
      createSyntheticApiRequest({ query: { opportunityId: syntheticApiOpportunity.opportunityId } }),
      feedbackStore
    );

    expect(listedFeedback.ok).toBe(true);
    expect(listedFeedback.data.feedback).toHaveLength(3);
    expect(listedFeedback.data.feedback.map((item) => item.status)).toEqual([
      API_FEEDBACK_STATUSES.saved,
      API_FEEDBACK_STATUSES.dismissed,
      API_FEEDBACK_STATUSES.reasonProvided
    ]);

    const bugReport = await handleCreateBugReportRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/v1/feedback/bug-reports" },
        body: {
          ...syntheticApiBugReportRequestBody,
          sessionId: syntheticApiSession.sessionId,
          safeMetadata: {
            sessionId: acceptedInvite.data.session.sessionId,
            validationMode: "private-beta"
          }
        }
      }),
      bugReportStore
    );

    expect(bugReport.ok).toBe(true);
    if (bugReport.ok) {
      expect(bugReport.data.status).toBe(API_BUG_REPORT_STATUSES.open);
      expect(bugReport.data.sessionId).toBe(syntheticApiSession.sessionId);
    }

    const serialized = JSON.stringify({
      acceptedInvite,
      session,
      saved,
      dismissed,
      rated,
      listedFeedback,
      bugReport
    });

    for (const unsafe of unsafeFlowSamples) {
      expect(serialized).not.toContain(unsafe);
    }
  });
});

function createSequentialId(prefix: string): () => string {
  let sequence = 0;
  return () => `${prefix}-${++sequence}`;
}
