import type { RawContentProvenance } from "@opportunity-os/raw-content";

export type EmbeddingProvenanceBoundary =
  | "embedding-contract"
  | "chunk-embedding-contract"
  | "cache-contract";

export type EmbeddingProvenance = RawContentProvenance & {
  readonly embeddingBoundary: EmbeddingProvenanceBoundary;
};

export type EmbeddingProvenanceRecord = {
  readonly boundary: EmbeddingProvenanceBoundary;
  readonly sourcePreserved: boolean;
  readonly ingestionPreserved: boolean;
  readonly safeMessage?: string;
};
