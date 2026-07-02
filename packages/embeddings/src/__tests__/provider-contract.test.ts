import { describe, expect, it } from "vitest";
import {
  EMBEDDING_PROVIDER_CAPABILITIES,
  EMBEDDING_PROVIDER_STABILITY_STATUSES,
  type EmbeddingProviderContract
} from "../index.js";

describe("embedding provider abstraction", () => {
  it("locks provider stability and capability vocabularies", () => {
    expect(EMBEDDING_PROVIDER_STABILITY_STATUSES).toEqual([
      "experimental",
      "stable",
      "deprecated"
    ]);
    expect(EMBEDDING_PROVIDER_CAPABILITIES).toEqual([
      "single-input",
      "batch-input",
      "chunk-input",
      "usage-metadata",
      "dimension-selection"
    ]);
  });

  it("models provider metadata without a concrete provider implementation", () => {
    const provider: EmbeddingProviderContract = {
      metadata: {
        providerId: "fixture-provider",
        name: "Fixture Provider",
        version: "0.0.0",
        description: "Deterministic provider contract fixture.",
        stability: "experimental",
        capabilities: ["single-input", "batch-input"],
        models: [
          {
            modelId: "fixture-model",
            dimensions: {
              dimensions: 3
            },
            maximumInputTokens: 128,
            maximumBatchSize: 8
          }
        ],
        safeMetadata: {
          contractOnly: true
        }
      }
    };

    expect(provider.metadata.models[0]?.dimensions.dimensions).toBe(3);
    expect(JSON.stringify(provider)).not.toMatch(/access_token|api_key|authorization|client_secret/iu);
  });
});
