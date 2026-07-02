import type { RawContentProvenance } from "@opportunity-os/raw-content";
import type { EmbeddingDimensionCount, EmbeddingModelId, EmbeddingProviderId } from "../embedding/index.js";

export type EmbeddingSourceReference = {
  readonly rawContentId?: string;
  readonly canonicalTextId?: string;
  readonly chunkId?: string;
};

export type EmbeddingModelMetadata = {
  readonly providerId: EmbeddingProviderId;
  readonly modelId: EmbeddingModelId;
  readonly dimensions: EmbeddingDimensionCount;
};

export type EmbeddingMetadata = {
  readonly source: EmbeddingSourceReference;
  readonly model: EmbeddingModelMetadata;
  readonly provenance: RawContentProvenance;
  readonly generatedAt: string;
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};
