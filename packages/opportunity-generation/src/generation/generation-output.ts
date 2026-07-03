import type {
  CandidateConfidenceAggregation,
  CandidateEvidenceCompleteness,
  CandidateOpportunity
} from "@opportunity-os/opportunity-candidates";
import type {
  OpportunityConfidence,
  OpportunityEvidenceReference,
  OpportunityHypothesis,
  OpportunityId
} from "@opportunity-os/opportunity-engine";
import type {
  OpportunityGenerationOutputId,
  OpportunityGenerationRunId,
  OpportunityGenerationSafeMetadata,
  OpportunityGenerationStage,
  OpportunityGenerationTimestamp,
  OpportunityGenerationVersion
} from "./primitives.js";

export const OPPORTUNITY_GENERATION_OUTPUT_STATUSES = {
  generated: "generated",
  validationFailed: "validation-failed",
  evidenceIncomplete: "evidence-incomplete",
  confidenceUnavailable: "confidence-unavailable",
  failed: "failed"
} as const;

export type OpportunityGenerationOutputStatus =
  (typeof OPPORTUNITY_GENERATION_OUTPUT_STATUSES)[keyof typeof OPPORTUNITY_GENERATION_OUTPUT_STATUSES];

export type GeneratedOpportunity = {
  readonly opportunityId: OpportunityId;
  readonly candidate: CandidateOpportunity;
  readonly hypothesis: OpportunityHypothesis;
  readonly evidence: readonly OpportunityEvidenceReference[];
  readonly confidence?: OpportunityConfidence;
  readonly generatedAt: OpportunityGenerationTimestamp;
  readonly version: OpportunityGenerationVersion;
  readonly safeMetadata?: OpportunityGenerationSafeMetadata;
};

export type OpportunityGenerationOutput = {
  readonly outputId: OpportunityGenerationOutputId;
  readonly runId: OpportunityGenerationRunId;
  readonly status: OpportunityGenerationOutputStatus;
  readonly generatedOpportunity?: GeneratedOpportunity;
  readonly evidenceCompleteness?: CandidateEvidenceCompleteness;
  readonly confidenceAggregation?: CandidateConfidenceAggregation;
  readonly completedStages: readonly OpportunityGenerationStage[];
  readonly generatedAt: OpportunityGenerationTimestamp;
  readonly safeMetadata?: OpportunityGenerationSafeMetadata;
};

export type OpportunityGenerationOutputContract = {
  readonly output: OpportunityGenerationOutput;
  readonly deterministic: true;
  readonly providerIndependent: true;
};
