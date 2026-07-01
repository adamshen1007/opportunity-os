import { describe, expect, it } from "vitest";
import {
  RAW_CONTENT_DEDUPLICATION_STATUSES,
  RAW_CONTENT_ENVELOPE_VERSION,
  RAW_CONTENT_EVENT_NAMES,
  RAW_CONTENT_FINGERPRINT_ALGORITHMS,
  RAW_CONTENT_KINDS,
  RAW_CONTENT_NORMALIZATION_BOUNDARY_STAGES,
  RAW_CONTENT_VALIDATION_ISSUE_CODES,
  REDDIT_RAW_CONTENT_MAPPING_TARGETS,
  type RawContentDeduplicationDecision,
  type RawContentEnvelope,
  type RawContentEventEnvelope,
  type RawContentFingerprint,
  type RawContentIngestionMetadata,
  type RawContentNormalizationInput,
  type RawContentPost,
  type RawContentProvenance,
  type RawContentStoragePort,
  type RawContentValidationIssue,
  type RedditRawContentMappingContract
} from "../index.js";

const ingestion: RawContentIngestionMetadata = {
  ingestionId: "ingestion_pipeline_1",
  collectedAt: "2026-07-02T00:00:00.000Z",
  correlationId: "corr_pipeline_1",
  connector: {
    connectorId: "reddit",
    connectorName: "Reddit",
    connectorVersion: "0.0.0"
  }
};

const source = {
  platform: "reddit",
  objectKind: "post",
  objectId: "reddit_post_pipeline_1",
  safeProviderMetadata: {
    kind: "safe-provider-metadata",
    redacted: true,
    source: "reddit"
  }
} as const;

const provenance: RawContentProvenance = {
  source,
  ingestion,
  providerReference: {
    platform: "reddit",
    objectId: "reddit_post_pipeline_1"
  },
  collectedThrough: "reddit-provider-transport",
  transformBoundary: "raw-content-contract",
  recordedAt: "2026-07-02T00:00:00.000Z"
};

const post: RawContentPost = {
  id: "raw_post_pipeline_1",
  title: "Pipeline contract post",
  author: {
    id: "raw_author_pipeline_1",
    handle: "pipeline_author",
    source: {
      ...source,
      objectKind: "author",
      objectId: "pipeline_author"
    }
  },
  community: {
    id: "raw_community_pipeline_1",
    name: "pipeline",
    source: {
      ...source,
      objectKind: "community",
      objectId: "pipeline"
    }
  },
  permalink: "https://reddit.example/r/pipeline/comments/1",
  metrics: {
    score: 1
  },
  source,
  ingestion,
  provenance
};

const envelope: RawContentEnvelope<RawContentPost> = {
  kind: "post",
  version: RAW_CONTENT_ENVELOPE_VERSION,
  content: post,
  ingestion,
  provenance
};

const validationIssue: RawContentValidationIssue = {
  code: "missing-required-field",
  path: ["content", "title"],
  message: "Title is required."
};

const fingerprint: RawContentFingerprint = {
  value: "fingerprint_pipeline_1",
  algorithm: "source-object-v1",
  inputKind: "post",
  sourceObjectId: "reddit_post_pipeline_1"
};

describe("raw content pipeline contracts", () => {
  it("locks pipeline vocabularies", () => {
    expect(RAW_CONTENT_NORMALIZATION_BOUNDARY_STAGES).toEqual([
      "raw-content-input",
      "normalized-output"
    ]);
    expect(RAW_CONTENT_FINGERPRINT_ALGORITHMS).toEqual([
      "source-object-v1",
      "content-text-v1"
    ]);
    expect(RAW_CONTENT_DEDUPLICATION_STATUSES).toEqual([
      "unique",
      "possible-duplicate",
      "duplicate",
      "undetermined"
    ]);
    expect(RAW_CONTENT_VALIDATION_ISSUE_CODES).toEqual([
      "missing-required-field",
      "unsafe-provider-metadata",
      "malformed-source-reference",
      "unsupported-content-kind",
      "provenance-incomplete"
    ]);
    expect(RAW_CONTENT_EVENT_NAMES).toEqual([
      "raw-content.received",
      "raw-content.validated",
      "raw-content.rejected",
      "raw-content.deduplication-decided"
    ]);
    expect(REDDIT_RAW_CONTENT_MAPPING_TARGETS).toEqual([
      "posts",
      "comments",
      "subreddits",
      "authors"
    ]);
    expect(RAW_CONTENT_KINDS).toContain("post");
  });

  it("models normalization, fingerprint, deduplication, and storage ports without behavior", async () => {
    const normalizationInput: RawContentNormalizationInput<RawContentPost> = {
      stage: "raw-content-input",
      envelope
    };

    const decision: RawContentDeduplicationDecision = {
      status: "unique",
      candidate: {
        envelope,
        fingerprint
      },
      issues: [],
      decidedAt: "2026-07-02T00:00:00.000Z"
    };

    const storagePort: RawContentStoragePort = {
      save: async (record) => ({ ok: true, value: record }),
      saveBatch: async (records) => ({ ok: true, value: records }),
      findByFingerprint: async () => ({ ok: true, value: undefined })
    };

    const result = await storagePort.save({
      envelope,
      fingerprint,
      validation: {
        ok: true,
        envelope,
        issues: []
      },
      deduplication: decision
    });

    expect(normalizationInput.stage).toBe("raw-content-input");
    expect(decision.status).toBe("unique");
    expect(result.ok).toBe(true);
  });

  it("models events and Reddit mapping contracts with safe payloads", () => {
    const event: RawContentEventEnvelope = {
      metadata: {
        eventId: "event_raw_content_1",
        eventName: "raw-content.rejected",
        category: "integration",
        version: "v1",
        timestamp: "2026-07-02T00:00:00.000Z",
        source: "@opportunity-os/raw-content",
        correlationId: "corr_pipeline_1"
      },
      payload: {
        envelope,
        issues: [validationIssue]
      }
    };

    const mapping: RedditRawContentMappingContract = {
      name: "reddit-to-raw-content-mapping",
      targets: REDDIT_RAW_CONTENT_MAPPING_TARGETS
    };

    const serialized = JSON.stringify({ event, mapping });
    expect(event.metadata.eventName).toBe("raw-content.rejected");
    expect(mapping.targets).toContain("posts");
    expect(serialized).not.toMatch(/access_token|refresh_token|authorization|raw_provider_payload|provider secret/iu);
  });
});
