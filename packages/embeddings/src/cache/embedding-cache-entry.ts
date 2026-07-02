import type { EmbeddingContract } from "../embedding/index.js";
import type { EmbeddingMetadata } from "../metadata/index.js";
import type { EmbeddingCacheKeyMetadata } from "./embedding-cache-key.js";

export const EMBEDDING_CACHE_ENTRY_STATUSES = [
  "fresh",
  "stale",
  "expired"
] as const;

export type EmbeddingCacheEntryStatus = typeof EMBEDDING_CACHE_ENTRY_STATUSES[number];

export type EmbeddingCacheEntry = {
  readonly key: EmbeddingCacheKeyMetadata;
  readonly embedding: EmbeddingContract;
  readonly metadata: EmbeddingMetadata;
  readonly status: EmbeddingCacheEntryStatus;
  readonly storedAt: string;
  readonly expiresAt?: string;
};
