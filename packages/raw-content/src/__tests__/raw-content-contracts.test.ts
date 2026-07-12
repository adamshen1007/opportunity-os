import { describe, expect, it } from "vitest";
import {
  RAW_CONTENT_ENVELOPE_VERSION,
  RAW_CONTENT_KINDS,
  RAW_CONTENT_SOURCE_PLATFORMS,
  type RawContentAuthor,
  type RawContentComment,
  type RawContentCommunity,
  type RawContentEnvelope,
  type RawContentIngestionMetadata,
  type RawContentPost,
  type RawContentProvenance,
  type RawContentSafeProviderMetadata,
  type RawContentSourceMetadata
} from "../index.js";

const safeProviderMetadata: RawContentSafeProviderMetadata = {
  kind: "safe-provider-metadata",
  redacted: true,
  source: "reddit",
  fields: {
    source: "fixture",
    public: true
  }
};

const source: RawContentSourceMetadata = {
  platform: "reddit",
  objectKind: "post",
  objectId: "reddit_post_1",
  url: "https://reddit.example/r/example/comments/1",
  collectedAt: "2026-07-02T00:00:00.000Z",
  publishedAt: "2026-07-01T00:00:00.000Z",
  safeProviderMetadata
};

const ingestion: RawContentIngestionMetadata = {
  ingestionId: "ingestion_1",
  collectedAt: "2026-07-02T00:00:00.000Z",
  correlationId: "corr_raw_content_1",
  requestId: "req_raw_content_1",
  connector: {
    connectorId: "reddit",
    connectorName: "Reddit",
    connectorVersion: "0.0.0"
  },
  safeMetadata: {
    fixture: true
  }
};

const provenance: RawContentProvenance = {
  source,
  ingestion,
  providerReference: {
    platform: "reddit",
    objectId: "reddit_post_1",
    objectUrl: "https://reddit.example/r/example/comments/1"
  },
  collectedThrough: "reddit-provider-transport",
  transformBoundary: "raw-content-contract",
  recordedAt: "2026-07-02T00:00:00.000Z"
};

const author: RawContentAuthor = {
  id: "raw_author_1",
  handle: "example_author",
  displayName: "Example Author",
  profileUrl: "https://reddit.example/user/example_author",
  source: {
    ...source,
    objectKind: "author",
    objectId: "example_author"
  },
  ingestion,
  provenance
};

const community: RawContentCommunity = {
  id: "raw_community_1",
  name: "example",
  displayName: "r/example",
  title: "Example",
  visibility: "public",
  subscriberCount: 100,
  source: {
    ...source,
    objectKind: "community",
    objectId: "example"
  },
  ingestion,
  provenance
};

const post: RawContentPost = {
  id: "raw_post_1",
  title: "Example post",
  bodyText: "A deterministic fixture post.",
  author: {
    id: author.id,
    handle: author.handle,
    source: author.source
  },
  community: {
    id: community.id,
    name: community.name,
    source: community.source
  },
  permalink: "https://reddit.example/r/example/comments/1",
  metrics: {
    score: 42,
    commentCount: 2
  },
  createdAt: "2026-07-01T00:00:00.000Z",
  source,
  ingestion,
  provenance
};

const comment: RawContentComment = {
  id: "raw_comment_1",
  post: {
    id: post.id,
    source: post.source,
    permalink: post.permalink
  },
  author: post.author,
  bodyText: "A deterministic fixture comment.",
  permalink: "https://reddit.example/r/example/comments/1/comment/1",
  metrics: {
    score: 7
  },
  source: {
    ...source,
    objectKind: "comment",
    objectId: "reddit_comment_1"
  },
  ingestion,
  provenance
};

describe("raw content canonical contracts", () => {
  it("locks source platform and envelope vocabularies", () => {
    expect(RAW_CONTENT_SOURCE_PLATFORMS).toEqual(["reddit", "stack-exchange"]);
    expect(RAW_CONTENT_KINDS).toEqual([
      "post",
      "comment",
      "author",
      "community"
    ]);
    expect(RAW_CONTENT_ENVELOPE_VERSION).toBe("1.0.0");
  });

  it("models authors, communities, posts, and comments with safe metadata", () => {
    expect(author.source.safeProviderMetadata.redacted).toBe(true);
    expect(community.visibility).toBe("public");
    expect(post.author.handle).toBe("example_author");
    expect(comment.post.id).toBe("raw_post_1");

    const serialized = JSON.stringify({ author, community, post, comment });
    expect(serialized).not.toMatch(/access_token|refresh_token|authorization|raw_provider_payload/iu);
  });

  it("models ingestion, provenance, and envelopes without provider payload leakage", () => {
    const envelope: RawContentEnvelope<RawContentPost> = {
      kind: "post",
      version: RAW_CONTENT_ENVELOPE_VERSION,
      content: post,
      ingestion,
      provenance,
      safeMetadata: {
        fixture: true
      }
    };

    expect(envelope.ingestion.connector.connectorId).toBe("reddit");
    expect(envelope.provenance.collectedThrough).toBe("reddit-provider-transport");
    expect(envelope.provenance.transformBoundary).toBe("raw-content-contract");
    expect(JSON.stringify(envelope)).not.toMatch(/raw response|provider secret|token/iu);
  });
});
