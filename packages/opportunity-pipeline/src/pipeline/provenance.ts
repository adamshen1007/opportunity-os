import type {
  StructuredAnalysisEvidenceReference,
  StructuredAnalysisProvenance
} from "@opportunity-os/analysis";
import type { EmbeddingProvenance } from "@opportunity-os/embeddings";
import type { AnalysisRequestId } from "@opportunity-os/llm-analysis";
import type { NormalizationProvenance } from "@opportunity-os/normalization";
import type {
  OpportunityEvidenceReference,
  OpportunityHypothesisId,
  OpportunitySourceProvenance,
  OpportunitySourceReference
} from "@opportunity-os/opportunity-engine";
import type { RawContentProvenance, RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type {
  OpportunityPipelineRunId,
  OpportunityPipelineStageId,
  OpportunityPipelineTimestamp
} from "./primitives.js";

export const OPPORTUNITY_PIPELINE_PROVENANCE_BOUNDARIES = {
  rawContent: "raw-content",
  normalization: "normalization",
  embedding: "embedding",
  llmAnalysis: "llm-analysis",
  structuredAnalysis: "structured-analysis",
  opportunityEngine: "opportunity-engine",
  opportunityPipeline: "opportunity-pipeline"
} as const;

export type OpportunityPipelineProvenanceBoundary =
  (typeof OPPORTUNITY_PIPELINE_PROVENANCE_BOUNDARIES)[keyof typeof OPPORTUNITY_PIPELINE_PROVENANCE_BOUNDARIES];

export type OpportunityPipelineUpstreamProvenance = {
  readonly rawContent?: RawContentProvenance;
  readonly normalization?: NormalizationProvenance;
  readonly embedding?: EmbeddingProvenance;
  readonly llmAnalysisId?: AnalysisRequestId;
  readonly structuredAnalysis?: StructuredAnalysisProvenance;
  readonly opportunitySource?: OpportunitySourceProvenance;
};

export type OpportunityPipelineProvenanceReference = {
  readonly runId: OpportunityPipelineRunId;
  readonly stageId: OpportunityPipelineStageId;
  readonly boundary: OpportunityPipelineProvenanceBoundary;
  readonly recordedAt: OpportunityPipelineTimestamp;
  readonly upstream: OpportunityPipelineUpstreamProvenance;
  readonly opportunitySources?: readonly OpportunitySourceReference[];
  readonly opportunityEvidence?: readonly OpportunityEvidenceReference[];
  readonly structuredEvidence?: readonly StructuredAnalysisEvidenceReference[];
  readonly hypothesisIds?: readonly OpportunityHypothesisId[];
  readonly safeMetadata?: RawContentSafeMetadata;
};
