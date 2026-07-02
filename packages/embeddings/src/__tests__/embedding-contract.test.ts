import { describe, expect, it } from "vitest";
import {
  EMBEDDING_VALUE_KINDS,
  type EmbeddingContract,
  type EmbeddingDimensionContract,
  type EmbeddingVectorContract
} from "../index.js";

describe("embedding primitives", () => {
  it("locks embedding value kinds", () => {
    expect(EMBEDDING_VALUE_KINDS).toEqual([
      "text",
      "chunk"
    ]);
  });

  it("models vectors and dimensions without provider coupling", () => {
    const dimensions: EmbeddingDimensionContract = {
      dimensions: 3,
      expectedRange: {
        minimum: 1,
        maximum: 4096
      }
    };
    const vector: EmbeddingVectorContract = {
      values: [0.1, 0.2, 0.3],
      dimensions: dimensions.dimensions,
      normalized: true
    };
    const embedding: EmbeddingContract = {
      id: "embedding_fixture_1",
      kind: "text",
      providerId: "fixture-provider",
      modelId: "fixture-model",
      vector,
      createdAt: "2026-07-02T00:00:00.000Z",
      safeMetadata: {
        fixture: true
      }
    };

    expect(embedding.vector.values).toHaveLength(3);
    expect(embedding.vector.dimensions).toBe(3);
    expect(JSON.stringify(embedding)).not.toMatch(/token|secret|credential|raw_provider/iu);
  });
});
