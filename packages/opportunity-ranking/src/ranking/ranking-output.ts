import type { OpportunityRankingFactor } from "../factors/index.js";
import type {
  OpportunityRankPosition,
  OpportunityRankingOutputStatus,
  OpportunityRankingRunId,
  OpportunityRankingSafeMetadata,
  OpportunityRankingScoreValue,
  OpportunityRankingStage,
  OpportunityRankingTimestamp,
  OpportunityRankingUpstreamReference,
  RankedOpportunityId
} from "./primitives.js";
import type { OpportunityRankingSignal } from "../signals/index.js";
import type { OpportunityRankingWeightSet } from "../weights/index.js";

export type OpportunityRankingExplanationSummary = {
  readonly summary: string;
  readonly signalCount: number;
  readonly factorCount: number;
  readonly weightSetId: OpportunityRankingWeightSet["weightSetId"];
};

export type RankedOpportunity = {
  readonly rankedOpportunityId: RankedOpportunityId;
  readonly opportunity: OpportunityRankingUpstreamReference;
  readonly rank: OpportunityRankPosition;
  readonly score: OpportunityRankingScoreValue;
  readonly signals: readonly OpportunityRankingSignal[];
  readonly factors: readonly OpportunityRankingFactor[];
  readonly explanation: OpportunityRankingExplanationSummary;
  readonly safeMetadata?: OpportunityRankingSafeMetadata;
};

export type OpportunityRankingOutput = {
  readonly runId: OpportunityRankingRunId;
  readonly status: OpportunityRankingOutputStatus;
  readonly rankedOpportunities: readonly RankedOpportunity[];
  readonly completedStages: readonly OpportunityRankingStage[];
  readonly rankedAt: OpportunityRankingTimestamp;
  readonly safeMetadata?: OpportunityRankingSafeMetadata;
};

export type OpportunityRankingOutputContract = {
  readonly output: OpportunityRankingOutput;
  readonly deterministic: true;
  readonly providerIndependent: true;
  readonly explainable: true;
};
