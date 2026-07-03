import type {
  OpportunityRankingSafeMetadata,
  OpportunityRankingScoreValue
} from "../ranking/primitives.js";
import type {
  OpportunityRankingSignal,
  OpportunityRankingSignalId,
  OpportunityRankingSignalIdValue
} from "../signals/index.js";

export type OpportunityRankingFactorId = string & {
  readonly __brand: "OpportunityRankingFactorId";
};

export const OPPORTUNITY_RANKING_FACTOR_IDS = {
  confidenceStrength: "confidence-strength",
  evidenceCompleteness: "evidence-completeness",
  sourceCoverage: "source-coverage",
  generationQuality: "generation-quality"
} as const;

export type OpportunityRankingFactorIdValue =
  (typeof OPPORTUNITY_RANKING_FACTOR_IDS)[keyof typeof OPPORTUNITY_RANKING_FACTOR_IDS];

export const OPPORTUNITY_RANKING_FACTOR_KINDS = {
  confidence: "confidence",
  evidence: "evidence",
  source: "source",
  generation: "generation"
} as const;

export type OpportunityRankingFactorKind =
  (typeof OPPORTUNITY_RANKING_FACTOR_KINDS)[keyof typeof OPPORTUNITY_RANKING_FACTOR_KINDS];

export type OpportunityRankingFactor = {
  readonly factorId: OpportunityRankingFactorIdValue | OpportunityRankingFactorId;
  readonly kind: OpportunityRankingFactorKind;
  readonly signalIds: readonly (OpportunityRankingSignalIdValue | OpportunityRankingSignalId)[];
  readonly value: OpportunityRankingScoreValue;
  readonly explanation: string;
  readonly safeMetadata?: OpportunityRankingSafeMetadata;
};

export type OpportunityRankingFactorInput = {
  readonly factorId: OpportunityRankingFactorIdValue | OpportunityRankingFactorId;
  readonly signals: readonly OpportunityRankingSignal[];
};

export type OpportunityRankingFactorSet = {
  readonly factors: readonly OpportunityRankingFactor[];
  readonly deterministic: true;
  readonly explainable: true;
};
