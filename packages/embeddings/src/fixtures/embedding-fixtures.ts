import { rawContentFixtureProvenance } from "@opportunity-os/raw-content";
import type { TextChunk } from "@opportunity-os/normalization";
import type { EmbeddingCacheEntry } from "../cache/index.js";
import type { ChunkEmbeddingContract } from "../chunk/index.js";
import type { EmbeddingContract } from "../embedding/index.js";
import type { EmbeddingEventEnvelope } from "../events/index.js";
import type { EmbeddingMetadata } from "../metadata/index.js";
import type { EmbeddingProviderContract } from "../provider/index.js";
import type { EmbeddingRequest } from "../request/index.js";
import type { EmbeddingResult } from "../results/index.js";
import type { EmbeddingValidationResult } from "../validation/index.js";

export const EMBEDDING_FIXTURE_TIMESTAMP = "2026-07-02T00:00:00.000Z" as const;

export const EMBEDDING_FIXTURE_IDS = {
  correlationId: "corr_embedding_fixture_001",
  requestId: "embedding_request_fixture_001",
  providerId: "fixture-provider",
  modelId: "fixture-model",
  canonicalTextId: "canonical_text_fixture_001",
  chunkId: "chunk_fixture_001",
  embeddingId: "embedding_fixture_001",
  batchId: "embedding_batch_fixture_001",
  cacheFingerprint: "embedding_fingerprint_fixture_001"
} as const;

export const embeddingFixtureVector = [0.101, 0.202, 0.303] as const;

export const embeddingFixtureTextChunk: TextChunk = {
  id: EMBEDDING_FIXTURE_IDS.chunkId,
  canonicalTextId: EMBEDDING_FIXTURE_IDS.canonicalTextId,
  order: 0,
  text: "Synthetic normalized chunk for embedding contracts.",
  range: {
    start: 0,
    end: 52
  },
  sourceSegmentIds: ["segment_fixture_001"],
  strategy: "segment-boundary",
  safeMetadata: {
    fixture: true,
    synthetic: true
  }
};

export const embeddingFixtureProvider: EmbeddingProviderContract = {
  metadata: {
    providerId: EMBEDDING_FIXTURE_IDS.providerId,
    name: "Fixture Embedding Provider",
    version: "0.0.0",
    description: "Deterministic contract-only embedding provider fixture.",
    stability: "experimental",
    capabilities: ["single-input", "batch-input", "chunk-input"],
    models: [
      {
        modelId: EMBEDDING_FIXTURE_IDS.modelId,
        dimensions: {
          dimensions: embeddingFixtureVector.length
        },
        maximumInputTokens: 128,
        maximumBatchSize: 8
      }
    ],
    safeMetadata: {
      fixture: true
    }
  }
};

export const embeddingFixtureMetadata: EmbeddingMetadata = {
  source: {
    rawContentId: "raw_post_fixture_001",
    canonicalTextId: EMBEDDING_FIXTURE_IDS.canonicalTextId,
    chunkId: EMBEDDING_FIXTURE_IDS.chunkId
  },
  model: {
    providerId: EMBEDDING_FIXTURE_IDS.providerId,
    modelId: EMBEDDING_FIXTURE_IDS.modelId,
    dimensions: embeddingFixtureVector.length
  },
  provenance: rawContentFixtureProvenance,
  generatedAt: EMBEDDING_FIXTURE_TIMESTAMP,
  safeMetadata: {
    fixture: true,
    syntheticVector: true
  }
};

export const embeddingFixtureEmbedding: EmbeddingContract = {
  id: EMBEDDING_FIXTURE_IDS.embeddingId,
  kind: "chunk",
  providerId: EMBEDDING_FIXTURE_IDS.providerId,
  modelId: EMBEDDING_FIXTURE_IDS.modelId,
  vector: {
    values: embeddingFixtureVector,
    dimensions: embeddingFixtureVector.length,
    normalized: true
  },
  createdAt: EMBEDDING_FIXTURE_TIMESTAMP,
  safeMetadata: {
    fixture: true,
    syntheticVector: true
  }
};

export const embeddingFixtureChunkEmbedding: ChunkEmbeddingContract = {
  id: "chunk_embedding_fixture_001",
  chunk: {
    chunkId: EMBEDDING_FIXTURE_IDS.chunkId,
    canonicalTextId: EMBEDDING_FIXTURE_IDS.canonicalTextId,
    chunkOrder: 0
  },
  embedding: embeddingFixtureEmbedding,
  metadata: embeddingFixtureMetadata
};

export const embeddingFixtureRequest: EmbeddingRequest = {
  requestId: EMBEDDING_FIXTURE_IDS.requestId,
  providerId: EMBEDDING_FIXTURE_IDS.providerId,
  modelId: EMBEDDING_FIXTURE_IDS.modelId,
  inputs: [
    {
      inputId: "embedding_input_fixture_001",
      kind: "chunk",
      text: embeddingFixtureTextChunk.text,
      source: {
        sourcePackage: "@opportunity-os/normalization",
        sourceId: EMBEDDING_FIXTURE_IDS.chunkId,
        sourceVersion: "1.0.0"
      },
      safeMetadata: {
        fixture: true
      }
    }
  ],
  context: {
    correlationId: EMBEDDING_FIXTURE_IDS.correlationId,
    requestId: EMBEDDING_FIXTURE_IDS.requestId,
    service: "embedding-fixture"
  },
  options: {
    dimensions: embeddingFixtureVector.length,
    normalizeOutput: true
  }
};

export const embeddingFixtureValidationSuccess: EmbeddingValidationResult = {
  valid: true
};

export const embeddingFixtureResult: EmbeddingResult = {
  ok: true,
  status: "success",
  embeddings: [embeddingFixtureChunkEmbedding],
  cacheStatus: "miss",
  issues: [],
  safeMetadata: {
    fixture: true
  }
};

export const embeddingFixtureCacheEntry: EmbeddingCacheEntry = {
  key: {
    key: {
      sourceId: EMBEDDING_FIXTURE_IDS.chunkId,
      providerId: EMBEDDING_FIXTURE_IDS.providerId,
      modelId: EMBEDDING_FIXTURE_IDS.modelId,
      dimensions: embeddingFixtureVector.length,
      contentFingerprint: EMBEDDING_FIXTURE_IDS.cacheFingerprint
    },
    version: "1.0.0"
  },
  embedding: embeddingFixtureEmbedding,
  metadata: embeddingFixtureMetadata,
  status: "fresh",
  storedAt: EMBEDDING_FIXTURE_TIMESTAMP
};

export const embeddingFixtureRequestedEvent: EmbeddingEventEnvelope = {
  metadata: {
    eventId: "event_embedding_requested_fixture_001",
    eventName: "embedding.requested",
    category: "integration",
    version: "v1",
    timestamp: EMBEDDING_FIXTURE_TIMESTAMP,
    source: "@opportunity-os/embeddings",
    correlationId: EMBEDDING_FIXTURE_IDS.correlationId,
    requestId: EMBEDDING_FIXTURE_IDS.requestId
  },
  payload: {
    request: embeddingFixtureRequest,
    safeMetadata: {
      fixture: true
    }
  }
};
