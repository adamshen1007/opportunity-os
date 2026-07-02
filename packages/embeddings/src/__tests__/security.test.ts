import { describe, expect, it } from "vitest";
import {
  EmbeddingError,
  embeddingFixtureCacheEntry,
  embeddingFixtureEmbedding,
  embeddingFixtureProvider,
  embeddingFixtureRequestedEvent,
  embeddingFixtureRequest,
  embeddingFixtureResult,
  embeddingFixtureTextChunk,
  redactEmbeddingErrorValue
} from "../index.js";

const forbiddenSecretPattern =
  /access_token|refresh_token|authorization|bearer secret-token|client_secret|api_key|provider_key|database_url|dsn=|raw_provider_payload|raw provider response|stack trace|super-secret|sk-fixture-secret/iu;

describe("embedding security contracts", () => {
  it("keeps fixtures synthetic and free of secrets or raw provider payloads", () => {
    const serialized = JSON.stringify({
      embeddingFixtureCacheEntry,
      embeddingFixtureEmbedding,
      embeddingFixtureProvider,
      embeddingFixtureRequest,
      embeddingFixtureResult,
      embeddingFixtureTextChunk,
      embeddingFixtureRequestedEvent
    });

    expect(serialized).not.toMatch(forbiddenSecretPattern);
    expect(serialized).toContain("synthetic");
    expect(serialized).not.toMatch(/real embedding|provider payload/iu);
  });

  it("redacts secret-like values from safe embedding errors", () => {
    const error = new EmbeddingError({
      code: "EMBEDDING_PROVIDER_FAILED",
      category: "provider",
      message:
        "Embedding provider failed api_key=super-secret authorization=Bearer secret-token client_secret=super-secret dsn=super-secret",
      correlationId: "corr_embedding_security",
      requestId: "req_embedding_security",
      cause: new Error("raw provider response with raw_provider_payload and stack trace")
    });
    const serialized = JSON.stringify(error);

    expect(serialized).toContain("EMBEDDING_PROVIDER_FAILED");
    expect(serialized).not.toMatch(forbiddenSecretPattern);
    expect(serialized).not.toContain("cause");
    expect(serialized).not.toContain("stack");
  });

  it("redacts standalone secret-like strings deterministically", () => {
    expect(
      redactEmbeddingErrorValue("password=super-secret token=super-secret api_key=super-secret")
    ).toBe("[REDACTED] [REDACTED] [REDACTED]");
    expect(redactEmbeddingErrorValue("authorization=Bearer secret-token")).toBe("[REDACTED]");
  });
});
