import { describe, expect, it } from "vitest";
import {
  EMBEDDING_ERROR_CODES,
  EMBEDDING_EVENT_NAMES,
  EMBEDDING_FIXTURE_IDS,
  EMBEDDING_FIXTURE_TIMESTAMP,
  EMBEDDING_RESULT_STATUSES,
  EmbeddingError,
  embeddingFixtureCacheEntry,
  embeddingFixtureEmbedding,
  embeddingFixtureProvider,
  embeddingFixtureRequestedEvent,
  embeddingFixtureRequest,
  embeddingFixtureResult,
  embeddingFixtureTextChunk,
  embeddingFixtureVector,
  redactEmbeddingErrorValue,
  type BatchEmbeddingResult,
  type EmbeddingEventEnvelope,
  type EmbeddingResult
} from "../index.js";

describe("embedding results, errors, events, and fixtures", () => {
  it("locks result, error, and event vocabularies", () => {
    expect(EMBEDDING_RESULT_STATUSES).toEqual([
      "success",
      "partial-success",
      "validation-failure",
      "provider-failure",
      "cache-hit",
      "cache-miss",
      "skipped"
    ]);
    expect(EMBEDDING_ERROR_CODES).toEqual([
      "EMBEDDING_VALIDATION_FAILED",
      "EMBEDDING_PROVIDER_FAILED",
      "EMBEDDING_CACHE_FAILED",
      "EMBEDDING_EVENT_FAILED",
      "EMBEDDING_INTERNAL_FAILURE"
    ]);
    expect(EMBEDDING_EVENT_NAMES).toEqual([
      "embedding.requested",
      "embedding.validated",
      "embedding.generated",
      "embedding.failed",
      "embedding.cached",
      "embedding.skipped"
    ]);
  });

  it("models success, batch, and failure result contracts", () => {
    const success: EmbeddingResult = embeddingFixtureResult;
    const batch: BatchEmbeddingResult = {
      batchId: EMBEDDING_FIXTURE_IDS.batchId,
      status: "success",
      results: [success]
    };
    const failure: EmbeddingResult = {
      ok: false,
      status: "validation-failure",
      issues: [
        {
          code: "empty-text",
          path: ["inputs", "0", "text"],
          message: "Embedding input text must not be empty."
        }
      ]
    };

    expect(success.ok).toBe(true);
    expect(batch.results).toHaveLength(1);
    expect(failure.ok).toBe(false);
    expect(JSON.stringify({ success, batch, failure })).not.toMatch(/access_token|refresh_token|authorization|api_key|raw_provider/iu);
  });

  it("serializes embedding errors without secrets, stacks, or causes", () => {
    const error = new EmbeddingError({
      code: "EMBEDDING_PROVIDER_FAILED",
      category: "provider",
      message: "Provider failed with api_key=sk-fixture-secret and access_token=secret-token",
      correlationId: "corr_embedding_error",
      requestId: "req_embedding_error",
      cause: new Error("raw cause with token=secret")
    });
    const safeDetails = error.toSafeDetails();
    const serialized = JSON.stringify(error);

    expect(safeDetails.message).toContain("[REDACTED]");
    expect(serialized).not.toMatch(/sk-fixture-secret|secret-token|raw cause|stack|cause/iu);
    expect(redactEmbeddingErrorValue("authorization=Bearer abc123")).toBe("[REDACTED]");
  });

  it("models embedding events with safe payloads", () => {
    const event: EmbeddingEventEnvelope = embeddingFixtureRequestedEvent;

    expect(event.metadata.eventName).toBe("embedding.requested");
    expect(event.metadata.category).toBe("integration");
    expect(event.payload).toMatchObject({
      request: {
        requestId: EMBEDDING_FIXTURE_IDS.requestId
      }
    });
    expect(JSON.stringify(event)).not.toMatch(/api_key|access_token|refresh_token|authorization|raw_provider/iu);
  });

  it("provides deterministic synthetic fixtures only", () => {
    expect(EMBEDDING_FIXTURE_TIMESTAMP).toBe("2026-07-02T00:00:00.000Z");
    expect(embeddingFixtureVector).toEqual([0.101, 0.202, 0.303]);
    expect(embeddingFixtureEmbedding.vector.values).toEqual(embeddingFixtureVector);
    expect(embeddingFixtureTextChunk.text).toContain("Synthetic normalized chunk");
    expect(embeddingFixtureProvider.metadata.providerId).toBe("fixture-provider");
    expect(embeddingFixtureRequest.inputs[0]?.text).toBe(embeddingFixtureTextChunk.text);
    expect(embeddingFixtureCacheEntry.status).toBe("fresh");
    expect(JSON.stringify({
      embeddingFixtureEmbedding,
      embeddingFixtureProvider,
      embeddingFixtureRequest,
      embeddingFixtureCacheEntry
    })).not.toMatch(/real embedding|api_key|secret|credential|raw provider payload/iu);
  });
});
