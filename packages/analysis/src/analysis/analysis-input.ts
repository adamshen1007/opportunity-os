import type { ChunkEmbeddingReference } from "@opportunity-os/embeddings";
import type { AnalysisRequest, PromptInput, StructuredOutputContract } from "@opportunity-os/llm-analysis";
import type { NormalizationOutput } from "@opportunity-os/normalization";
import type { RawContentProvenance, RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type {
  StructuredAnalysisId,
  StructuredAnalysisPrimitiveValue,
  StructuredAnalysisVersion
} from "./primitives.js";

export type StructuredAnalysisInputSource = {
  readonly normalizedContent: NormalizationOutput;
  readonly embeddingReferences: readonly ChunkEmbeddingReference[];
  readonly provenance: RawContentProvenance;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type StructuredAnalysisInput = {
  readonly analysisId: StructuredAnalysisId;
  readonly version: StructuredAnalysisVersion;
  readonly source: StructuredAnalysisInputSource;
  readonly llmRequest?: AnalysisRequest;
  readonly promptInput?: PromptInput;
  readonly targetSchema: StructuredOutputContract;
  readonly values: Readonly<Record<string, StructuredAnalysisPrimitiveValue>>;
};

