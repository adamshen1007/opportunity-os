import type { CandidateConfidenceAggregation, CandidateEvidenceCompleteness, CandidateOpportunity } from "@opportunity-os/opportunity-candidates";
import type { OpportunityPipelineProvenanceReference } from "@opportunity-os/opportunity-pipeline";
import type {
  OpportunityGenerationMode,
  OpportunityGenerationRequestId,
  OpportunityGenerationSafeMetadata,
  OpportunityGenerationTimestamp,
  OpportunityGenerationVersion
} from "./primitives.js";

export type OpportunityGenerationInputContext = {
  readonly requestedAt: OpportunityGenerationTimestamp;
  readonly requestedBy: "system" | "test" | "operator";
  readonly mode: OpportunityGenerationMode;
  readonly version: OpportunityGenerationVersion;
  readonly safeMetadata?: OpportunityGenerationSafeMetadata;
};

export type OpportunityGenerationInput = {
  readonly requestId: OpportunityGenerationRequestId;
  readonly candidate: CandidateOpportunity;
  readonly evidenceCompleteness?: CandidateEvidenceCompleteness;
  readonly confidenceAggregation?: CandidateConfidenceAggregation;
  readonly provenance: readonly OpportunityPipelineProvenanceReference[];
  readonly context: OpportunityGenerationInputContext;
};

export type OpportunityGenerationInputContract = {
  readonly input: OpportunityGenerationInput;
  readonly explicitInputsOnly: true;
  readonly providerIndependent: true;
};
