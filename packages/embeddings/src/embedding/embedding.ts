import type { EmbeddingVectorContract } from "./embedding-vector.js";

export const EMBEDDING_VALUE_KINDS = [
  "text",
  "chunk"
] as const;

export type EmbeddingValueKind = typeof EMBEDDING_VALUE_KINDS[number];

export type EmbeddingId = string;

export type EmbeddingModelId = string;

export type EmbeddingProviderId = string;

export type EmbeddingContract = {
  readonly id: EmbeddingId;
  readonly kind: EmbeddingValueKind;
  readonly providerId: EmbeddingProviderId;
  readonly modelId: EmbeddingModelId;
  readonly vector: EmbeddingVectorContract;
  readonly createdAt: string;
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};
