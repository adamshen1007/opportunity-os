import type { ChunkEmbeddingReference } from "@opportunity-os/embeddings";
import type { NormalizationOutput } from "@opportunity-os/normalization";
import type { RawContentProvenance, RawContentSafeMetadata } from "@opportunity-os/raw-content";

export type PromptInputReference = {
  readonly normalizedContent?: NormalizationOutput;
  readonly embeddingReferences: readonly ChunkEmbeddingReference[];
  readonly provenance: RawContentProvenance;
  readonly safeMetadata: RawContentSafeMetadata;
};

export type PromptInput = {
  readonly inputId: string;
  readonly references: PromptInputReference;
  readonly variables: Readonly<Record<string, unknown>>;
};
