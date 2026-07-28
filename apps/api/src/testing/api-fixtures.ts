import type { ApiRequest, ApiRequestContext } from "../http/index.js";
import type { ApiOpportunityQueryPort, ApiRankingCommandPort } from "../ports/index.js";
import type { ApiOpportunityDto, ApiRankingDto } from "../resources/index.js";
import {
  API_INVITE_STATUSES,
  API_SESSION_STATUSES,
  createInMemoryInviteStore,
  hashAuthSecret,
  type ApiCreateInviteRequestBody,
  type ApiInviteRecord,
  type ApiInviteStore,
  type ApiSessionRecord,
  type ApiSessionDto
} from "../auth/index.js";
import {
  API_BUG_REPORT_SEVERITIES,
  API_BUG_REPORT_STATUSES,
  API_FEEDBACK_RATING_TARGETS,
  API_FEEDBACK_REASON_CATEGORIES,
  API_FEEDBACK_STATUSES,
  createInMemoryBugReportStore,
  createInMemoryFeedbackStore,
  type ApiBugReportDto,
  type ApiBugReportStore,
  type ApiCreateBugReportRequestBody,
  type ApiCreateFeedbackRequestBody,
  type ApiFeedbackDto,
  type ApiFeedbackStore
} from "../feedback/index.js";
import { createInMemoryScanPersistenceStore, type ApiScanPersistenceStore } from "../persistence/index.js";

export const syntheticApiRequestContext: ApiRequestContext = {
  correlationId: "correlation-synthetic-1",
  requestId: "request-synthetic-1",
  method: "GET",
  path: "/v1/opportunities"
} as const;

export const syntheticApiOpportunity: ApiOpportunityDto = {
  opportunityId: "opportunity-synthetic-1",
  title: "Synthetic opportunity",
  summary: "Synthetic opportunity summary",
  status: "ranked",
  confidence: 0.82,
  evidence: [
    {
      evidenceId: "evidence-synthetic-1",
      sourceType: "synthetic",
      summary: "Synthetic evidence summary",
      confidence: 0.8
    }
  ],
  source: {
    sourceId: "source-synthetic-1",
    sourceType: "synthetic"
  },
  rank: {
    position: 1,
    score: 82
  },
  safeMetadata: {
    fixture: true
  }
};

export const syntheticApiRanking: ApiRankingDto = {
  rankingId: "ranking-synthetic-1",
  status: "ranked",
  generatedAt: "2026-07-03T00:00:00.000Z",
  rankedOpportunities: [
    {
      opportunityId: syntheticApiOpportunity.opportunityId,
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
            message: "Synthetic confidence factor explanation."
          }
        ]
      }
    }
  ]
};

export const syntheticApiFeedback: ApiFeedbackDto = {
  feedbackId: "feedback-synthetic-1",
  opportunityId: syntheticApiOpportunity.opportunityId,
  status: API_FEEDBACK_STATUSES.rated,
  reasonCategories: [API_FEEDBACK_REASON_CATEGORIES.weakEvidence],
  ratings: [
    {
      target: API_FEEDBACK_RATING_TARGETS.usefulness,
      value: 4
    },
    {
      target: API_FEEDBACK_RATING_TARGETS.evidenceQuality,
      value: 3
    },
    {
      target: API_FEEDBACK_RATING_TARGETS.rankingQuality,
      value: 5
    }
  ],
  createdAt: "2026-07-04T00:00:00.000Z",
  safeMetadata: {
    fixture: true
  }
};

export const syntheticApiFeedbackRequestBody: ApiCreateFeedbackRequestBody = {
  opportunityId: syntheticApiOpportunity.opportunityId,
  status: API_FEEDBACK_STATUSES.rated,
  reasonCategories: [API_FEEDBACK_REASON_CATEGORIES.weakEvidence],
  ratings: syntheticApiFeedback.ratings
};

export const syntheticApiBugReport: ApiBugReportDto = {
  bugReportId: "bug-report-synthetic-1",
  title: "Synthetic dashboard issue",
  safeDescription: "Synthetic beta report with safe reproduction notes.",
  severity: API_BUG_REPORT_SEVERITIES.medium,
  status: API_BUG_REPORT_STATUSES.open,
  createdAt: "2026-07-04T00:00:00.000Z",
  safeMetadata: {
    fixture: true
  }
};

export const syntheticApiBugReportRequestBody: ApiCreateBugReportRequestBody = {
  title: syntheticApiBugReport.title,
  safeDescription: syntheticApiBugReport.safeDescription,
  severity: syntheticApiBugReport.severity,
  safeMetadata: {
    fixture: true
  }
};

export const syntheticPrivateBetaInviteCode = `inv_${"a".repeat(43)}`;
export const syntheticPrivateBetaSessionToken = `ses_${"b".repeat(43)}`;
const syntheticAuthPepper = "synthetic-auth-pepper";

export const syntheticApiInvite: ApiInviteRecord = {
  inviteId: "invite-synthetic-1",
  inviteCodeHash: hashAuthSecret(syntheticPrivateBetaInviteCode, syntheticAuthPepper),
  email: "design.partner@example.com",
  status: API_INVITE_STATUSES.pending,
  createdAt: "2026-07-04T00:00:00.000Z",
  expiresAt: "2026-07-11T00:00:00.000Z",
  safeMetadata: {
    fixture: true
  }
};

export const syntheticApiSession: ApiSessionDto = {
  status: API_SESSION_STATUSES.active,
  principal: {
    principalId: syntheticApiInvite.email,
    displayName: "Design Partner",
    permissions: ["private-beta:access"]
  },
  createdAt: "2026-07-04T00:00:00.000Z",
  expiresAt: "2026-07-04T08:00:00.000Z"
};

export const syntheticApiSessionRecord: ApiSessionRecord = {
  internalId: "session-synthetic-1",
  inviteId: syntheticApiInvite.inviteId,
  tokenHash: hashAuthSecret(syntheticPrivateBetaSessionToken, syntheticAuthPepper),
  session: syntheticApiSession
};

export const syntheticApiCreateInviteRequestBody: ApiCreateInviteRequestBody = {
  email: syntheticApiInvite.email,
  inviteCode: syntheticPrivateBetaInviteCode,
  expiresAt: syntheticApiInvite.expiresAt,
  safeMetadata: {
    fixture: true
  }
};

export const syntheticApiOpportunityPort: ApiOpportunityQueryPort = {
  async listOpportunities(input) {
    return {
      opportunities: [syntheticApiOpportunity],
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
    return input.opportunityId === syntheticApiOpportunity.opportunityId ? syntheticApiOpportunity : undefined;
  }
};

export const syntheticApiRankingPort: ApiRankingCommandPort = {
  async rankOpportunities(input) {
    return {
      ...syntheticApiRanking,
      rankedOpportunities: syntheticApiRanking.rankedOpportunities.filter((item) =>
        input.opportunityIds.includes(item.opportunityId)
      )
    };
  },
  async getRanking(input) {
    return input.rankingId === syntheticApiRanking.rankingId ? syntheticApiRanking : undefined;
  }
};

export function createSyntheticApiFeedbackStore(): ApiFeedbackStore {
  return createInMemoryFeedbackStore({
    initialFeedback: [syntheticApiFeedback],
    clock: () => "2026-07-04T00:00:00.000Z",
    idFactory: () => "feedback-synthetic-created-1"
  });
}

export function createSyntheticApiScanPersistenceStore(): ApiScanPersistenceStore {
  return createInMemoryScanPersistenceStore();
}

export function createSyntheticApiBugReportStore(): ApiBugReportStore {
  return createInMemoryBugReportStore({
    initialBugReports: [syntheticApiBugReport],
    clock: () => "2026-07-04T00:00:00.000Z",
    idFactory: () => "bug-report-synthetic-created-1"
  });
}

export function createSyntheticApiInviteStore(): ApiInviteStore {
  return createInMemoryInviteStore({
    initialInvites: [syntheticApiInvite],
    initialSessions: [syntheticApiSessionRecord],
    clock: () => "2026-07-04T00:00:00.000Z",
    inviteIdFactory: () => "invite-synthetic-created-1",
    sessionIdFactory: () => "session-synthetic-created-1",
    sessionTokenFactory: () => syntheticPrivateBetaSessionToken,
    secretPepper: syntheticAuthPepper
  });
}

export function createSyntheticApiRequest<TBody = unknown, TQuery = Record<string, unknown>, TParams = Record<string, unknown>>(
  request: Omit<ApiRequest<TBody, TQuery, TParams>, "context"> & {
    readonly context?: Partial<ApiRequestContext>;
  } = {}
): ApiRequest<TBody, TQuery, TParams> {
  return {
    ...request,
    context: {
      ...syntheticApiRequestContext,
      ...request.context
    }
  } as ApiRequest<TBody, TQuery, TParams>;
}
