import type { EmbeddingCacheEntry } from "./embedding-cache-entry.js";
import type { EmbeddingCacheKey } from "./embedding-cache-key.js";

export const EMBEDDING_CACHE_LOOKUP_STATUSES = [
  "hit",
  "miss",
  "stale",
  "failure"
] as const;

export type EmbeddingCacheLookupStatus = typeof EMBEDDING_CACHE_LOOKUP_STATUSES[number];

export type EmbeddingCacheLookupResult = {
  readonly status: EmbeddingCacheLookupStatus;
  readonly entry?: EmbeddingCacheEntry;
  readonly safeMessage?: string;
};

export type EmbeddingCacheStoreResult = {
  readonly stored: boolean;
  readonly safeMessage?: string;
};

export type EmbeddingCachePort = {
  readonly lookup: (key: EmbeddingCacheKey) => Promise<EmbeddingCacheLookupResult>;
  readonly store: (entry: EmbeddingCacheEntry) => Promise<EmbeddingCacheStoreResult>;
  readonly invalidate: (key: EmbeddingCacheKey) => Promise<EmbeddingCacheStoreResult>;
};
