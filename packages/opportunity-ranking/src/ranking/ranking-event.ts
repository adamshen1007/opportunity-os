import type {
  OpportunityRankingRequestId,
  OpportunityRankingRunId,
  OpportunityRankingSafeMetadata,
  OpportunityRankingTimestamp
} from "./primitives.js";

export const OPPORTUNITY_RANKING_EVENT_NAMES = {
  rankingValidationFailed: "opportunity-ranking.validation-failed",
  rankingCompleted: "opportunity-ranking.completed"
} as const;

export type OpportunityRankingEventName =
  (typeof OPPORTUNITY_RANKING_EVENT_NAMES)[keyof typeof OPPORTUNITY_RANKING_EVENT_NAMES];

export type OpportunityRankingEvent = {
  readonly eventName: OpportunityRankingEventName;
  readonly occurredAt: OpportunityRankingTimestamp;
  readonly requestId: OpportunityRankingRequestId;
  readonly runId?: OpportunityRankingRunId;
  readonly safeMetadata?: OpportunityRankingSafeMetadata;
};
