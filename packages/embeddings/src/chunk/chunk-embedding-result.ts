import type { ChunkEmbeddingContract } from "./chunk-embedding.js";

export const CHUNK_EMBEDDING_RESULT_STATUSES = [
  "success",
  "partial-success",
  "validation-failure",
  "provider-failure"
] as const;

export type ChunkEmbeddingResultStatus = typeof CHUNK_EMBEDDING_RESULT_STATUSES[number];

export type ChunkEmbeddingResult = {
  readonly status: ChunkEmbeddingResultStatus;
  readonly embeddings: readonly ChunkEmbeddingContract[];
  readonly issueCodes?: readonly string[];
  readonly safeMessage?: string;
};
