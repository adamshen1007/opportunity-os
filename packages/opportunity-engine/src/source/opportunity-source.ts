import type { StructuredAnalysisId, StructuredAnalysisProvenance } from "@opportunity-os/analysis";
import type { EmbeddingId } from "@opportunity-os/embeddings";
import type { AnalysisRequestId } from "@opportunity-os/llm-analysis";
import type { CanonicalTextId, NormalizationProvenance } from "@opportunity-os/normalization";
import type { RawContentEnvelope, RawContentProvenance, RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type { OpportunitySourceKind } from "../opportunity/index.js";

export type OpportunitySourceId = string & { readonly __brand: "OpportunitySourceId" };

export type OpportunitySourceReference = {
  readonly sourceId: OpportunitySourceId;
  readonly kind: OpportunitySourceKind;
  readonly rawContent?: RawContentEnvelope;
  readonly normalizedContentId?: CanonicalTextId;
  readonly embeddingId?: EmbeddingId;
  readonly llmAnalysisId?: AnalysisRequestId;
  readonly structuredAnalysisId?: StructuredAnalysisId;
  readonly provenance: OpportunitySourceProvenance;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type OpportunitySourceProvenance = {
  readonly rawContent?: RawContentProvenance;
  readonly normalization?: NormalizationProvenance;
  readonly structuredAnalysis?: StructuredAnalysisProvenance;
};
