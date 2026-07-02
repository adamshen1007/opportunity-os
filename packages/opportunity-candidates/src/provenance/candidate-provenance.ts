import type {
  StructuredAnalysisEvidenceReference,
  StructuredAnalysisProvenance
} from "@opportunity-os/analysis";
import type { ChunkEmbeddingReference, EmbeddingProvenance } from "@opportunity-os/embeddings";
import type { AnalysisRequestId } from "@opportunity-os/llm-analysis";
import type {
  OpportunityEvidenceReference,
  OpportunityHypothesisId,
  OpportunitySourceReference
} from "@opportunity-os/opportunity-engine";
import type {
  OpportunityPipelineProvenanceReference,
  OpportunityPipelineRunId,
  PipelineCandidateOpportunityId,
  PipelineEvidenceAggregationId,
  PipelineHypothesisAssemblyId
} from "@opportunity-os/opportunity-pipeline";
import type { CandidateOpportunitySafeMetadata, CandidateOpportunityTimestamp } from "../candidate/index.js";

export const CANDIDATE_OPPORTUNITY_PROVENANCE_BOUNDARIES = {
  opportunityPipeline: "opportunity-pipeline",
  opportunityEngine: "opportunity-engine",
  structuredAnalysis: "structured-analysis",
  llmAnalysis: "llm-analysis",
  embeddings: "embeddings"
} as const;

export type CandidateOpportunityProvenanceBoundary =
  (typeof CANDIDATE_OPPORTUNITY_PROVENANCE_BOUNDARIES)[keyof typeof CANDIDATE_OPPORTUNITY_PROVENANCE_BOUNDARIES];

export type CandidateOpportunityUpstreamReferences = {
  readonly pipelineRunId: OpportunityPipelineRunId;
  readonly pipelineCandidateId: PipelineCandidateOpportunityId;
  readonly evidenceAggregationId?: PipelineEvidenceAggregationId;
  readonly hypothesisAssemblyId?: PipelineHypothesisAssemblyId;
  readonly opportunitySources: readonly OpportunitySourceReference[];
  readonly opportunityEvidence: readonly OpportunityEvidenceReference[];
  readonly hypothesisIds: readonly OpportunityHypothesisId[];
  readonly structuredEvidence?: readonly StructuredAnalysisEvidenceReference[];
  readonly embeddingReferences?: readonly ChunkEmbeddingReference[];
};

export type CandidateOpportunityProvenance = {
  readonly boundary: CandidateOpportunityProvenanceBoundary;
  readonly recordedAt: CandidateOpportunityTimestamp;
  readonly pipelineProvenance: readonly OpportunityPipelineProvenanceReference[];
  readonly upstream: CandidateOpportunityUpstreamReferences;
  readonly structuredAnalysis?: StructuredAnalysisProvenance;
  readonly embedding?: EmbeddingProvenance;
  readonly llmAnalysisId?: AnalysisRequestId;
  readonly safeMetadata?: CandidateOpportunitySafeMetadata;
};

