import type { ApiRequest, ApiRequestContext } from "../http/index.js";
import type { ApiOpportunityQueryPort, ApiRankingCommandPort } from "../ports/index.js";
import type { ApiOpportunityDto, ApiRankingDto } from "../resources/index.js";
import {
  API_FEEDBACK_RATING_TARGETS,
  API_FEEDBACK_REASON_CATEGORIES,
  API_FEEDBACK_STATUSES,
  createInMemoryFeedbackStore,
  type ApiCreateFeedbackRequestBody,
  type ApiFeedbackDto,
  type ApiFeedbackStore
} from "../feedback/index.js";

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
