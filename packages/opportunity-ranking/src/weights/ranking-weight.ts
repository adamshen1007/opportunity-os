import type {
  OpportunityRankingSafeMetadata,
  OpportunityRankingVersion
} from "../ranking/primitives.js";
import {
  OPPORTUNITY_RANKING_FACTOR_IDS,
  type OpportunityRankingFactorId,
  type OpportunityRankingFactorIdValue
} from "../factors/index.js";

export type OpportunityRankingWeightSetId = string & {
  readonly __brand: "OpportunityRankingWeightSetId";
};

export type OpportunityRankingWeightValue = number & {
  readonly __brand: "OpportunityRankingWeightValue";
};

export type OpportunityRankingWeight = {
  readonly factorId: OpportunityRankingFactorIdValue | OpportunityRankingFactorId;
  readonly weight: OpportunityRankingWeightValue;
  readonly explanation: string;
};

export type OpportunityRankingWeightSet = {
  readonly weightSetId: OpportunityRankingWeightSetId;
  readonly version: OpportunityRankingVersion;
  readonly weights: readonly OpportunityRankingWeight[];
  readonly deterministic: true;
  readonly explainable: true;
  readonly safeMetadata?: OpportunityRankingSafeMetadata;
};

export const DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET: OpportunityRankingWeightSet = {
  weightSetId: "default-opportunity-ranking-weights" as OpportunityRankingWeightSetId,
  version: "ranking-weights-v1" as OpportunityRankingVersion,
  deterministic: true,
  explainable: true,
  weights: [
    {
      factorId: OPPORTUNITY_RANKING_FACTOR_IDS.confidenceStrength,
      weight: 0.35 as OpportunityRankingWeightValue,
      explanation: "Candidate confidence is an explicit upstream readiness signal."
    },
    {
      factorId: OPPORTUNITY_RANKING_FACTOR_IDS.evidenceCompleteness,
      weight: 0.3 as OpportunityRankingWeightValue,
      explanation: "Evidence completeness is required for explainable prioritization."
    },
    {
      factorId: OPPORTUNITY_RANKING_FACTOR_IDS.sourceCoverage,
      weight: 0.2 as OpportunityRankingWeightValue,
      explanation: "Source coverage preserves provenance breadth in the ranking model."
    },
    {
      factorId: OPPORTUNITY_RANKING_FACTOR_IDS.generationQuality,
      weight: 0.15 as OpportunityRankingWeightValue,
      explanation: "Generation quality reflects deterministic upstream generation readiness."
    }
  ]
};
