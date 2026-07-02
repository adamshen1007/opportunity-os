import type { StructuredAnalysisConfidence } from "@opportunity-os/analysis";
import type { OpportunityConfidence } from "@opportunity-os/opportunity-engine";
import type {
  CandidateOpportunityId,
  CandidateOpportunitySafeMetadata,
  CandidateOpportunityTimestamp
} from "../candidate/index.js";
import type { CandidateEvidenceCompleteness } from "../evidence/index.js";

export const CANDIDATE_CONFIDENCE_AGGREGATION_STATUSES = {
  ready: "ready",
  insufficientEvidence: "insufficient-evidence",
  reviewRequired: "review-required",
  unknown: "unknown"
} as const;

export type CandidateConfidenceAggregationStatus =
  (typeof CANDIDATE_CONFIDENCE_AGGREGATION_STATUSES)[keyof typeof CANDIDATE_CONFIDENCE_AGGREGATION_STATUSES];

export type CandidateConfidenceSignal = {
  readonly source: "opportunity-engine" | "structured-analysis" | "evidence-completeness";
  readonly confidence?: OpportunityConfidence | StructuredAnalysisConfidence;
  readonly completeness?: CandidateEvidenceCompleteness;
  readonly safeMetadata?: CandidateOpportunitySafeMetadata;
};

export type CandidateConfidenceAggregation = {
  readonly candidateId: CandidateOpportunityId;
  readonly status: CandidateConfidenceAggregationStatus;
  readonly aggregatedAt: CandidateOpportunityTimestamp;
  readonly signals: readonly CandidateConfidenceSignal[];
  readonly summary?: OpportunityConfidence;
  readonly safeMetadata?: CandidateOpportunitySafeMetadata;
};

