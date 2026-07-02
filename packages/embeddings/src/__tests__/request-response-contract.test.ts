import { describe, expect, it } from "vitest";
import {
  EMBEDDING_RESPONSE_STATUSES,
  type EmbeddingInput,
  type EmbeddingRequest,
  type EmbeddingResponse
} from "../index.js";

const input: EmbeddingInput = {
  inputId: "input_fixture_1",
  kind: "chunk",
  text: "A deterministic normalized text chunk.",
  source: {
    sourcePackage: "@opportunity-os/normalization",
    sourceId: "chunk_fixture_1",
    sourceVersion: "1.0.0"
  },
  safeMetadata: {
    fixture: true
  }
};

describe("embedding request and response contracts", () => {
  it("models explicit requests without environment access", () => {
    const request: EmbeddingRequest = {
      requestId: "embedding_request_1",
      providerId: "fixture-provider",
      modelId: "fixture-model",
      inputs: [input],
      context: {
        correlationId: "corr_embedding_1",
        requestId: "req_embedding_1",
        service: "embedding-contract-test"
      },
      options: {
        dimensions: 3,
        normalizeOutput: true,
        timeoutMilliseconds: 1000
      }
    };

    expect(request.inputs[0]?.source.sourcePackage).toBe("@opportunity-os/normalization");
    expect(JSON.stringify(request)).not.toMatch(/process\.env|access_token|api_key|authorization/iu);
  });

  it("locks response statuses and safe response shape", () => {
    expect(EMBEDDING_RESPONSE_STATUSES).toEqual([
      "success",
      "partial-success",
      "failure"
    ]);

    const response: EmbeddingResponse = {
      status: "success",
      embeddings: [
        {
          id: "embedding_fixture_1",
          kind: "chunk",
          providerId: "fixture-provider",
          modelId: "fixture-model",
          vector: {
            values: [0.1, 0.2, 0.3],
            dimensions: 3,
            normalized: true
          },
          createdAt: "2026-07-02T00:00:00.000Z"
        }
      ],
      usage: {
        inputCount: 1,
        outputCount: 1,
        inputTokens: 6
      }
    };

    expect(response.embeddings[0]?.vector.values).toEqual([0.1, 0.2, 0.3]);
    expect(JSON.stringify(response)).not.toMatch(/raw_provider|secret|credential|access_token|refresh_token|authorization/iu);
  });
});
