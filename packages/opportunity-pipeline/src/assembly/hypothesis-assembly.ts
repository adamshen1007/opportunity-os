import type { OpportunityEvidenceReference, OpportunityHypothesis } from "@opportunity-os/opportunity-engine";
import type { RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type { PipelineEvidenceAggregation } from "./evidence-aggregation.js";
import type { OpportunityPipelineProvenanceReference } from "../pipeline/index.js";

export type PipelineHypothesisAssemblyId = string & {
  readonly __brand: "PipelineHypothesisAssemblyId";
};

export const PIPELINE_HYPOTHESIS_ASSEMBLY_STATUSES = {
  pending: "pending",
  assembled: "assembled",
  invalid: "invalid"
} as const;

export type PipelineHypothesisAssemblyStatus =
  (typeof PIPELINE_HYPOTHESIS_ASSEMBLY_STATUSES)[keyof typeof PIPELINE_HYPOTHESIS_ASSEMBLY_STATUSES];

export type PipelineHypothesisAssemblyInput = {
  readonly aggregation: PipelineEvidenceAggregation;
  readonly evidence: readonly OpportunityEvidenceReference[];
  readonly provenance: readonly OpportunityPipelineProvenanceReference[];
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type PipelineHypothesisAssembly = {
  readonly assemblyId: PipelineHypothesisAssemblyId;
  readonly status: PipelineHypothesisAssemblyStatus;
  readonly hypotheses: readonly OpportunityHypothesis[];
  readonly provenance: readonly OpportunityPipelineProvenanceReference[];
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type PipelineHypothesisAssemblyContract = {
  readonly input: PipelineHypothesisAssemblyInput;
  readonly output: PipelineHypothesisAssembly;
};
