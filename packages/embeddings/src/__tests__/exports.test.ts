import { describe, expect, it } from "vitest";
import * as embeddings from "../index.js";

const REQUIRED_ROOT_EXPORTS = [
  "EMBEDDINGS_PACKAGE_NAME",
  "EMBEDDINGS_FOUNDATION_PHASE",
  "EMBEDDING_VALUE_KINDS",
  "CHUNK_EMBEDDING_RESULT_STATUSES",
  "EMBEDDING_CACHE_ENTRY_STATUSES",
  "EMBEDDING_CACHE_LOOKUP_STATUSES",
  "EMBEDDING_ERROR_CODES",
  "EMBEDDING_EVENT_NAMES",
  "EMBEDDING_FIXTURE_IDS",
  "EMBEDDING_FIXTURE_TIMESTAMP",
  "EMBEDDING_PROVIDER_CAPABILITIES",
  "EMBEDDING_PROVIDER_STABILITY_STATUSES",
  "EMBEDDING_RESULT_STATUSES",
  "EMBEDDING_RESPONSE_STATUSES",
  "EMBEDDING_VALIDATION_ISSUE_CODES",
  "EmbeddingError",
  "embeddingFixtureCacheEntry",
  "embeddingFixtureChunkEmbedding",
  "embeddingFixtureEmbedding",
  "embeddingFixtureMetadata",
  "embeddingFixtureProvider",
  "embeddingFixtureRequestedEvent",
  "embeddingFixtureRequest",
  "embeddingFixtureResult",
  "embeddingFixtureTextChunk",
  "embeddingFixtureValidationSuccess",
  "embeddingFixtureVector",
  "redactEmbeddingErrorValue"
] as const;

describe("embeddings public exports", () => {
  it("keeps approved runtime contracts importable from the package root", () => {
    for (const exportName of REQUIRED_ROOT_EXPORTS) {
      expect(Object.hasOwn(embeddings, exportName)).toBe(true);
    }
  });
});
