import { describe, expect, it } from "vitest";
import {
  CHUNK_EMBEDDING_RESULT_STATUSES,
  type ChunkEmbeddingContract,
  type ChunkEmbeddingRequest,
  type EmbeddingMetadata,
  type EmbeddingProvenance
} from "../index.js";
import type { RawContentProvenance } from "@opportunity-os/raw-content";
import type { TextChunk } from "@opportunity-os/normalization";

const provenance: RawContentProvenance = {
  source: {
    platform: "reddit",
    objectKind: "post",
    objectId: "reddit_post_1",
    url: "https://reddit.example/r/example/comments/1",
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
    objectId: "reddit_post_1",
    objectUrl: "https://reddit.example/r/example/comments/1"
  },
  collectedThrough: "reddit-provider-transport",
  transformBoundary: "raw-content-contract",
  recordedAt: "2026-07-02T00:00:00.000Z"
};

const chunk: TextChunk = {
  id: "chunk_1",
  canonicalTextId: "canonical_text_1",
  order: 0,
  text: "A normalized chunk.",
  range: {
    start: 0,
    end: 19
  },
  sourceSegmentIds: ["segment_1"],
  strategy: "segment-boundary"
};

const metadata: EmbeddingMetadata = {
  source: {
    rawContentId: "raw_post_1",
    canonicalTextId: chunk.canonicalTextId,
    chunkId: chunk.id
  },
  model: {
    providerId: "fixture-provider",
    modelId: "fixture-model",
    dimensions: 3
  },
  provenance,
  generatedAt: "2026-07-02T00:00:00.000Z"
};

describe("chunk embedding and metadata contracts", () => {
  it("locks chunk embedding result statuses", () => {
    expect(CHUNK_EMBEDDING_RESULT_STATUSES).toEqual([
      "success",
      "partial-success",
      "validation-failure",
      "provider-failure"
    ]);
  });

  it("connects embeddings to normalized text chunks", () => {
    const request: ChunkEmbeddingRequest = {
      requestId: "chunk_embedding_request_1",
      providerId: "fixture-provider",
      modelId: "fixture-model",
      chunks: [chunk],
      context: {
        correlationId: "corr_embedding_1"
      }
    };
    const contract: ChunkEmbeddingContract = {
      id: "chunk_embedding_1",
      chunk: {
        chunkId: chunk.id,
        canonicalTextId: chunk.canonicalTextId,
        chunkOrder: chunk.order
      },
      embedding: {
        id: "embedding_1",
        kind: "chunk",
        providerId: request.providerId,
        modelId: request.modelId,
        vector: {
          values: [0.1, 0.2, 0.3],
          dimensions: 3,
          normalized: true
        },
        createdAt: "2026-07-02T00:00:00.000Z"
      },
      metadata
    };

    expect(contract.chunk.chunkId).toBe("chunk_1");
    expect(contract.metadata.source.canonicalTextId).toBe("canonical_text_1");
    expect(JSON.stringify(contract)).not.toMatch(/access_token|refresh_token|authorization|raw_provider/iu);
  });

  it("preserves provenance through an embedding boundary", () => {
    const embeddingProvenance: EmbeddingProvenance = {
      ...provenance,
      embeddingBoundary: "chunk-embedding-contract"
    };

    expect(embeddingProvenance.ingestion.correlationId).toBe("corr_embedding_1");
    expect(embeddingProvenance.embeddingBoundary).toBe("chunk-embedding-contract");
  });
});
