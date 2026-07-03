import {
  OPPORTUNITY_RANKING_FACTOR_IDS,
  OPPORTUNITY_RANKING_FACTOR_KINDS,
  type OpportunityRankingFactor
} from "../factors/index.js";
import {
  OPPORTUNITY_RANKING_SIGNAL_IDS,
  OPPORTUNITY_RANKING_SIGNAL_SOURCES,
  type OpportunityRankingSignal
} from "../signals/index.js";
import { DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET } from "../weights/index.js";
import { OPPORTUNITY_RANKING_MODES } from "../ranking/primitives.js";
import type {
  OpportunityRankingFieldPath,
  OpportunityRankingRequestId,
  OpportunityRankingRunId,
  OpportunityRankingScoreValue,
  OpportunityRankingTimestamp,
  OpportunityRankingUpstreamReference,
  OpportunityRankingVersion
} from "../ranking/primitives.js";
import type { OpportunityRankingInput } from "../ranking/ranking-input.js";
import type { OpportunityRankingPipelineOptions } from "../ranking/ranking-pipeline.js";

const rankedAt = "2026-07-03T00:00:00.000Z" as OpportunityRankingTimestamp;
const version = "ranking-v1" as OpportunityRankingVersion;

export const SYNTHETIC_OPPORTUNITY_RANKING_UPSTREAM_REFERENCES = {
  candidate: {
    packageName: "@opportunity-os/opportunity-candidates",
    entityKind: "candidate-opportunity",
    entityId: "candidate-synthetic-1",
    version: "candidate-v1"
  },
  generatedOpportunityA: {
    packageName: "@opportunity-os/opportunity-generation",
    entityKind: "generated-opportunity",
    entityId: "generated-opportunity-a",
    version: "generation-v1"
  },
  generatedOpportunityB: {
    packageName: "@opportunity-os/opportunity-generation",
    entityKind: "generated-opportunity",
    entityId: "generated-opportunity-b",
    version: "generation-v1"
  },
  generationOutput: {
    packageName: "@opportunity-os/opportunity-generation",
    entityKind: "generation-output",
    entityId: "generation-output-synthetic-1",
    version: "generation-v1"
  }
} as const satisfies Readonly<Record<string, OpportunityRankingUpstreamReference>>;

export const SYNTHETIC_OPPORTUNITY_RANKING_SIGNALS: readonly OpportunityRankingSignal[] = [
  {
    signalId: OPPORTUNITY_RANKING_SIGNAL_IDS.candidateConfidence,
    source: OPPORTUNITY_RANKING_SIGNAL_SOURCES.candidate,
    fieldPath: "candidate.syntheticConfidence" as OpportunityRankingFieldPath,
    value: 0.9 as OpportunityRankingScoreValue,
    normalizedValue: 0.9 as OpportunityRankingScoreValue,
    explanation: "Synthetic candidate confidence is explicit."
  },
  {
    signalId: OPPORTUNITY_RANKING_SIGNAL_IDS.evidenceCompleteness,
    source: OPPORTUNITY_RANKING_SIGNAL_SOURCES.evidence,
    fieldPath: "candidate.syntheticEvidence" as OpportunityRankingFieldPath,
    value: 0.8 as OpportunityRankingScoreValue,
    normalizedValue: 0.8 as OpportunityRankingScoreValue,
    explanation: "Synthetic evidence completeness is explicit."
  },
  {
    signalId: OPPORTUNITY_RANKING_SIGNAL_IDS.sourceDiversity,
    source: OPPORTUNITY_RANKING_SIGNAL_SOURCES.analysis,
    fieldPath: "candidate.syntheticSourceDiversity" as OpportunityRankingFieldPath,
    value: 0.7 as OpportunityRankingScoreValue,
    normalizedValue: 0.7 as OpportunityRankingScoreValue,
    explanation: "Synthetic source diversity is explicit."
  },
  {
    signalId: OPPORTUNITY_RANKING_SIGNAL_IDS.generationReadiness,
    source: OPPORTUNITY_RANKING_SIGNAL_SOURCES.generation,
    fieldPath: "generation.syntheticReadiness" as OpportunityRankingFieldPath,
    value: 0.6 as OpportunityRankingScoreValue,
    normalizedValue: 0.6 as OpportunityRankingScoreValue,
    explanation: "Synthetic generation readiness is explicit."
  }
] as const;

export const SYNTHETIC_OPPORTUNITY_RANKING_FACTORS: readonly OpportunityRankingFactor[] = [
  {
    factorId: OPPORTUNITY_RANKING_FACTOR_IDS.confidenceStrength,
    kind: OPPORTUNITY_RANKING_FACTOR_KINDS.confidence,
    signalIds: [OPPORTUNITY_RANKING_SIGNAL_IDS.candidateConfidence],
    value: 0.9 as OpportunityRankingScoreValue,
    explanation: "Synthetic confidence factor uses an explicit signal."
  },
  {
    factorId: OPPORTUNITY_RANKING_FACTOR_IDS.evidenceCompleteness,
    kind: OPPORTUNITY_RANKING_FACTOR_KINDS.evidence,
    signalIds: [OPPORTUNITY_RANKING_SIGNAL_IDS.evidenceCompleteness],
    value: 0.8 as OpportunityRankingScoreValue,
    explanation: "Synthetic evidence factor uses an explicit signal."
  },
  {
    factorId: OPPORTUNITY_RANKING_FACTOR_IDS.sourceCoverage,
    kind: OPPORTUNITY_RANKING_FACTOR_KINDS.source,
    signalIds: [OPPORTUNITY_RANKING_SIGNAL_IDS.sourceDiversity],
    value: 0.7 as OpportunityRankingScoreValue,
    explanation: "Synthetic source factor uses an explicit signal."
  },
  {
    factorId: OPPORTUNITY_RANKING_FACTOR_IDS.generationQuality,
    kind: OPPORTUNITY_RANKING_FACTOR_KINDS.generation,
    signalIds: [OPPORTUNITY_RANKING_SIGNAL_IDS.generationReadiness],
    value: 0.6 as OpportunityRankingScoreValue,
    explanation: "Synthetic generation factor uses an explicit signal."
  }
] as const;

export const SYNTHETIC_OPPORTUNITY_RANKING_OPTIONS = {
  runId: "ranking-run-synthetic-1" as OpportunityRankingRunId,
  rankedAt
} as const satisfies OpportunityRankingPipelineOptions;

export const SYNTHETIC_OPPORTUNITY_RANKING_INPUT = {
  requestId: "ranking-request-synthetic-1" as OpportunityRankingRequestId,
  generatedOpportunities: [
    SYNTHETIC_OPPORTUNITY_RANKING_UPSTREAM_REFERENCES.generatedOpportunityB,
    SYNTHETIC_OPPORTUNITY_RANKING_UPSTREAM_REFERENCES.generatedOpportunityA
  ],
  generationOutputs: [SYNTHETIC_OPPORTUNITY_RANKING_UPSTREAM_REFERENCES.generationOutput],
  candidates: [SYNTHETIC_OPPORTUNITY_RANKING_UPSTREAM_REFERENCES.candidate],
  signals: {
    signals: SYNTHETIC_OPPORTUNITY_RANKING_SIGNALS,
    deterministic: true,
    providerIndependent: true,
    explainable: true
  },
  factors: {
    factors: SYNTHETIC_OPPORTUNITY_RANKING_FACTORS,
    deterministic: true,
    explainable: true
  },
  weights: DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET,
  context: {
    requestedAt: rankedAt,
    requestedBy: "synthetic-test",
    mode: OPPORTUNITY_RANKING_MODES.deterministic,
    version,
    safeMetadata: {
      fixture: true,
      synthetic: true
    }
  }
} as const satisfies OpportunityRankingInput;

export const createSyntheticOpportunityRankingInput = (
  overrides: Partial<OpportunityRankingInput> = {}
): OpportunityRankingInput => ({
  ...SYNTHETIC_OPPORTUNITY_RANKING_INPUT,
  ...overrides
});
