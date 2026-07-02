import type { StructuredAnalysisEvidenceReference } from "@opportunity-os/analysis";
import type { OpportunityEvidenceReference, OpportunitySourceReference } from "@opportunity-os/opportunity-engine";
import type { RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type { OpportunityPipelineProvenanceReference } from "../pipeline/index.js";

export type PipelineEvidenceAggregationId = string & {
  readonly __brand: "PipelineEvidenceAggregationId";
};

export const PIPELINE_EVIDENCE_AGGREGATION_STATUSES = {
  pending: "pending",
  assembled: "assembled",
  invalid: "invalid"
} as const;

export type PipelineEvidenceAggregationStatus =
  (typeof PIPELINE_EVIDENCE_AGGREGATION_STATUSES)[keyof typeof PIPELINE_EVIDENCE_AGGREGATION_STATUSES];

export type PipelineEvidenceAggregationInput = {
  readonly sources: readonly OpportunitySourceReference[];
  readonly structuredEvidence: readonly StructuredAnalysisEvidenceReference[];
  readonly provenance: readonly OpportunityPipelineProvenanceReference[];
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type PipelineEvidenceAggregation = {
  readonly aggregationId: PipelineEvidenceAggregationId;
  readonly status: PipelineEvidenceAggregationStatus;
  readonly evidence: readonly OpportunityEvidenceReference[];
  readonly provenance: readonly OpportunityPipelineProvenanceReference[];
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type PipelineEvidenceAggregationContract = {
  readonly input: PipelineEvidenceAggregationInput;
  readonly output: PipelineEvidenceAggregation;
};
