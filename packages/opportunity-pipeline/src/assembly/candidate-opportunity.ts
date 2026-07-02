import type {
  OpportunityConfidence,
  OpportunityEvidenceReference,
  OpportunityHypothesis,
  OpportunityId,
  OpportunityScore
} from "@opportunity-os/opportunity-engine";
import type { RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type { PipelineEvidenceAggregation } from "./evidence-aggregation.js";
import type { PipelineHypothesisAssembly } from "./hypothesis-assembly.js";
import type {
  OpportunityPipelineLifecycleMetadata,
  OpportunityPipelineProvenanceReference
} from "../pipeline/index.js";

export type PipelineCandidateOpportunityId = string & {
  readonly __brand: "PipelineCandidateOpportunityId";
};

export const PIPELINE_CANDIDATE_OPPORTUNITY_STATUSES = {
  proposed: "proposed",
  validated: "validated",
  rejected: "rejected"
} as const;

export type PipelineCandidateOpportunityStatus =
  (typeof PIPELINE_CANDIDATE_OPPORTUNITY_STATUSES)[keyof typeof PIPELINE_CANDIDATE_OPPORTUNITY_STATUSES];

export type PipelineCandidateOpportunity = {
  readonly candidateId: PipelineCandidateOpportunityId;
  readonly opportunityId: OpportunityId;
  readonly status: PipelineCandidateOpportunityStatus;
  readonly hypothesis: OpportunityHypothesis;
  readonly evidence: readonly OpportunityEvidenceReference[];
  readonly score?: OpportunityScore;
  readonly confidence?: OpportunityConfidence;
  readonly provenance: readonly OpportunityPipelineProvenanceReference[];
  readonly lifecycle: OpportunityPipelineLifecycleMetadata;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type PipelineCandidateOpportunityInput = {
  readonly aggregation: PipelineEvidenceAggregation;
  readonly hypothesisAssembly: PipelineHypothesisAssembly;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type PipelineCandidateOpportunityContract = {
  readonly input: PipelineCandidateOpportunityInput;
  readonly candidates: readonly PipelineCandidateOpportunity[];
};
