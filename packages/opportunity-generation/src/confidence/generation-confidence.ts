import type {
  CandidateConfidenceAggregation,
  CandidateEvidenceCompleteness,
  CandidateOpportunity
} from "@opportunity-os/opportunity-candidates";
import type { OpportunityConfidence } from "@opportunity-os/opportunity-engine";
import type {
  OpportunityGenerationSafeMetadata,
  OpportunityGenerationTimestamp
} from "../generation/index.js";

export const GENERATION_CONFIDENCE_AGGREGATION_STATUSES = {
  ready: "ready",
  incomplete: "incomplete",
  reviewRequired: "review-required",
  unavailable: "unavailable"
} as const;

export type GenerationConfidenceAggregationStatus =
  (typeof GENERATION_CONFIDENCE_AGGREGATION_STATUSES)[keyof typeof GENERATION_CONFIDENCE_AGGREGATION_STATUSES];

export type GenerationConfidenceSignal = {
  readonly source: "candidate" | "evidence" | "hypothesis";
  readonly candidateConfidence?: CandidateConfidenceAggregation;
  readonly evidenceCompleteness?: CandidateEvidenceCompleteness;
  readonly confidence?: OpportunityConfidence;
  readonly safeMetadata?: OpportunityGenerationSafeMetadata;
};

export type GenerationConfidenceAggregation = {
  readonly candidateId: CandidateOpportunity["candidateId"];
  readonly status: GenerationConfidenceAggregationStatus;
  readonly aggregatedAt: OpportunityGenerationTimestamp;
  readonly signals: readonly GenerationConfidenceSignal[];
  readonly summary?: OpportunityConfidence;
  readonly safeMetadata?: OpportunityGenerationSafeMetadata;
};

export type GenerationConfidenceAggregationContract = {
  readonly candidate: CandidateOpportunity;
  readonly aggregation: GenerationConfidenceAggregation;
  readonly deterministic: true;
};
