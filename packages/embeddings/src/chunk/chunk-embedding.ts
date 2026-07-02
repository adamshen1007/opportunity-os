import type { TextChunk, TextChunkId } from "@opportunity-os/normalization";
import type { EmbeddingContract } from "../embedding/index.js";
import type { EmbeddingMetadata } from "../metadata/index.js";

export type ChunkEmbeddingId = string;

export type ChunkEmbeddingReference = {
  readonly chunkId: TextChunkId;
  readonly canonicalTextId: TextChunk["canonicalTextId"];
  readonly chunkOrder: TextChunk["order"];
};

export type ChunkEmbeddingContract = {
  readonly id: ChunkEmbeddingId;
  readonly chunk: ChunkEmbeddingReference;
  readonly embedding: EmbeddingContract;
  readonly metadata: EmbeddingMetadata;
};

export type ChunkEmbeddingBatch = {
  readonly batchId: string;
  readonly embeddings: readonly ChunkEmbeddingContract[];
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};
