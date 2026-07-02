import { describe, expect, it } from "vitest";
import {
  EMBEDDING_CACHE_ENTRY_STATUSES,
  EMBEDDING_CACHE_LOOKUP_STATUSES,
  EMBEDDING_VALIDATION_ISSUE_CODES,
  type EmbeddingCacheEntry,
  type EmbeddingCacheKey,
  type EmbeddingCachePort,
  type EmbeddingValidationResult
} from "../index.js";

const cacheKey: EmbeddingCacheKey = {
  sourceId: "chunk_1",
  providerId: "fixture-provider",
  modelId: "fixture-model",
  dimensions: 3,
  contentFingerprint: "fingerprint_fixture_1"
};

describe("embedding validation and cache contracts", () => {
  it("locks validation issue vocabulary", () => {
    expect(EMBEDDING_VALIDATION_ISSUE_CODES).toEqual([
      "missing-input",
      "empty-text",
      "invalid-dimensions",
      "unsupported-provider-capability",
      "unsupported-model",
      "input-too-large",
      "invalid-chunk-reference",
      "unsafe-metadata"
    ]);
  });

  it("models safe validation failures", () => {
    const result: EmbeddingValidationResult = {
      valid: false,
      issues: [
        {
          code: "invalid-chunk-reference",
          path: ["inputs", "0", "source"],
          message: "Chunk reference is missing required normalized content metadata."
        }
      ]
    };

    expect(result.valid).toBe(false);
    expect(JSON.stringify(result)).not.toMatch(/secret|access_token|authorization|raw_provider/iu);
  });

  it("locks cache vocabularies and port shape without an implementation", async () => {
    expect(EMBEDDING_CACHE_ENTRY_STATUSES).toEqual([
      "fresh",
      "stale",
      "expired"
    ]);
    expect(EMBEDDING_CACHE_LOOKUP_STATUSES).toEqual([
      "hit",
      "miss",
      "stale",
      "failure"
    ]);

    const entry: EmbeddingCacheEntry = {
      key: {
        key: cacheKey,
        version: "1.0.0"
      },
      embedding: {
        id: "embedding_1",
        kind: "chunk",
        providerId: cacheKey.providerId,
        modelId: cacheKey.modelId,
        vector: {
          values: [0.1, 0.2, 0.3],
          dimensions: cacheKey.dimensions,
          normalized: true
        },
        createdAt: "2026-07-02T00:00:00.000Z"
      },
      metadata: {
        source: {
          chunkId: cacheKey.sourceId
        },
        model: {
          providerId: cacheKey.providerId,
          modelId: cacheKey.modelId,
          dimensions: cacheKey.dimensions
        },
        provenance: {
          source: {
            platform: "reddit",
            objectKind: "post",
            objectId: "reddit_post_1",
            collectedAt: "2026-07-02T00:00:00.000Z",
            safeProviderMetadata: {
              kind: "safe-provider-metadata",
              redacted: true,
              source: "reddit",
              fields: {
                fixture: true
              }
            }
          },
          ingestion: {
            ingestionId: "ingestion_1",
            collectedAt: "2026-07-02T00:00:00.000Z",
            correlationId: "corr_embedding_1",
            connector: {
              connectorId: "reddit",
              connectorName: "Reddit",
              connectorVersion: "0.0.0"
            }
          },
          providerReference: {
            platform: "reddit",
            objectId: "reddit_post_1"
          },
          collectedThrough: "reddit-provider-transport",
          transformBoundary: "raw-content-contract",
          recordedAt: "2026-07-02T00:00:00.000Z"
        },
        generatedAt: "2026-07-02T00:00:00.000Z"
      },
      status: "fresh",
      storedAt: "2026-07-02T00:00:00.000Z"
    };

    const contractOnlyPort: EmbeddingCachePort = {
      lookup: async () => ({
        status: "hit",
        entry
      }),
      store: async () => ({
        stored: true
      }),
      invalidate: async () => ({
        stored: true
      })
    };

    await expect(contractOnlyPort.lookup(cacheKey)).resolves.toMatchObject({ status: "hit" });
    expect(JSON.stringify(entry)).not.toMatch(/secret|access_token|authorization|database_url/iu);
  });
});
