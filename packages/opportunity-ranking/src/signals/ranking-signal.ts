import type {
  OpportunityRankingFieldPath,
  OpportunityRankingSafeMetadata,
  OpportunityRankingScoreValue
} from "../ranking/primitives.js";

export type OpportunityRankingSignalId = string & {
  readonly __brand: "OpportunityRankingSignalId";
};

export const OPPORTUNITY_RANKING_SIGNAL_IDS = {
  candidateConfidence: "candidate-confidence",
  evidenceCompleteness: "evidence-completeness",
  sourceDiversity: "source-diversity",
  generationReadiness: "generation-readiness"
} as const;

export type OpportunityRankingSignalIdValue =
  (typeof OPPORTUNITY_RANKING_SIGNAL_IDS)[keyof typeof OPPORTUNITY_RANKING_SIGNAL_IDS];

export const OPPORTUNITY_RANKING_SIGNAL_SOURCES = {
  candidate: "candidate",
  evidence: "evidence",
  generation: "generation",
  analysis: "analysis"
} as const;

export type OpportunityRankingSignalSource =
  (typeof OPPORTUNITY_RANKING_SIGNAL_SOURCES)[keyof typeof OPPORTUNITY_RANKING_SIGNAL_SOURCES];

export type OpportunityRankingSignal = {
  readonly signalId: OpportunityRankingSignalIdValue | OpportunityRankingSignalId;
  readonly source: OpportunityRankingSignalSource;
  readonly fieldPath: OpportunityRankingFieldPath;
  readonly value: OpportunityRankingScoreValue;
  readonly normalizedValue: OpportunityRankingScoreValue;
  readonly explanation: string;
  readonly safeMetadata?: OpportunityRankingSafeMetadata;
};

export type OpportunityRankingSignalSet = {
  readonly signals: readonly OpportunityRankingSignal[];
  readonly deterministic: true;
  readonly providerIndependent: true;
  readonly explainable: true;
};
