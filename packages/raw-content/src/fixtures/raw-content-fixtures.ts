import {
  RAW_CONTENT_DEDUPLICATION_STATUSES,
  RAW_CONTENT_FINGERPRINT_ALGORITHMS,
  type RawContentDeduplicationDecision,
  type RawContentFingerprint
} from "../deduplication/index.js";
import {
  RAW_CONTENT_ENVELOPE_VERSION,
  type RawContentAuthor,
  type RawContentComment,
  type RawContentCommunity,
  type RawContentEnvelope,
  type RawContentPost
} from "../content/index.js";
import type { RawContentIngestionMetadata } from "../ingestion/index.js";
import type { RawContentProvenance } from "../provenance/index.js";
import type { RawContentSourceMetadata } from "../source/index.js";
import type { RawContentValidationSuccess } from "../validation/index.js";

export const RAW_CONTENT_FIXTURE_TIMESTAMP = "2026-07-02T00:00:00.000Z" as const;

export const RAW_CONTENT_FIXTURE_IDS = {
  ingestionId: "ingestion_fixture_001",
  correlationId: "corr_raw_content_fixture_001",
  authorId: "raw_author_fixture_001",
  communityId: "raw_community_fixture_001",
  postId: "raw_post_fixture_001",
  commentId: "raw_comment_fixture_001",
  sourcePostId: "reddit_post_fixture_001",
  sourceCommentId: "reddit_comment_fixture_001",
  sourceAuthorId: "reddit_author_fixture_001",
  sourceCommunityId: "reddit_community_fixture_001"
} as const;

const safeProviderMetadata = {
  kind: "safe-provider-metadata",
  redacted: true,
  source: "reddit",
  fields: {
    fixture: true,
    payloadStored: false
  }
} as const;

export const rawContentFixtureIngestion: RawContentIngestionMetadata = {
  ingestionId: RAW_CONTENT_FIXTURE_IDS.ingestionId,
  collectedAt: RAW_CONTENT_FIXTURE_TIMESTAMP,
  correlationId: RAW_CONTENT_FIXTURE_IDS.correlationId,
  connector: {
    connectorId: "reddit",
    connectorName: "Reddit",
    connectorVersion: "0.0.0"
  }
};

export const rawContentFixturePostSource: RawContentSourceMetadata = {
  platform: "reddit",
  objectKind: "post",
  objectId: RAW_CONTENT_FIXTURE_IDS.sourcePostId,
  url: "https://reddit.example/r/opportunity/comments/fixture",
  collectedAt: RAW_CONTENT_FIXTURE_TIMESTAMP,
  publishedAt: RAW_CONTENT_FIXTURE_TIMESTAMP,
  safeProviderMetadata
};

export const rawContentFixtureCommentSource: RawContentSourceMetadata = {
  ...rawContentFixturePostSource,
  objectKind: "comment",
  objectId: RAW_CONTENT_FIXTURE_IDS.sourceCommentId,
  url: "https://reddit.example/r/opportunity/comments/fixture/comment"
};

export const rawContentFixtureAuthorSource: RawContentSourceMetadata = {
  ...rawContentFixturePostSource,
  objectKind: "author",
  objectId: RAW_CONTENT_FIXTURE_IDS.sourceAuthorId,
  url: "https://reddit.example/user/fixture_author"
};

export const rawContentFixtureCommunitySource: RawContentSourceMetadata = {
  ...rawContentFixturePostSource,
  objectKind: "community",
  objectId: RAW_CONTENT_FIXTURE_IDS.sourceCommunityId,
  url: "https://reddit.example/r/opportunity"
};

export const rawContentFixtureProvenance: RawContentProvenance = {
  source: rawContentFixturePostSource,
  ingestion: rawContentFixtureIngestion,
  providerReference: {
    platform: "reddit",
    objectId: RAW_CONTENT_FIXTURE_IDS.sourcePostId
  },
  collectedThrough: "reddit-provider-transport",
  transformBoundary: "raw-content-contract",
  recordedAt: RAW_CONTENT_FIXTURE_TIMESTAMP
};

export const rawContentFixtureAuthor: RawContentAuthor = {
  id: RAW_CONTENT_FIXTURE_IDS.authorId,
  handle: "fixture_author",
  displayName: "Fixture Author",
  profileUrl: "https://reddit.example/user/fixture_author",
  accountCreatedAt: RAW_CONTENT_FIXTURE_TIMESTAMP,
  source: rawContentFixtureAuthorSource,
  ingestion: rawContentFixtureIngestion,
  provenance: {
    ...rawContentFixtureProvenance,
    source: rawContentFixtureAuthorSource,
    providerReference: {
      platform: "reddit",
      objectId: RAW_CONTENT_FIXTURE_IDS.sourceAuthorId
    }
  },
  safeMetadata: {
    fixture: true
  }
};

export const rawContentFixtureCommunity: RawContentCommunity = {
  id: RAW_CONTENT_FIXTURE_IDS.communityId,
  name: "opportunity",
  displayName: "r/opportunity",
  title: "Opportunity Fixture Community",
  description: "Deterministic public fixture community.",
  visibility: "public",
  subscriberCount: 100,
  createdAt: RAW_CONTENT_FIXTURE_TIMESTAMP,
  source: rawContentFixtureCommunitySource,
  ingestion: rawContentFixtureIngestion,
  provenance: {
    ...rawContentFixtureProvenance,
    source: rawContentFixtureCommunitySource,
    providerReference: {
      platform: "reddit",
      objectId: RAW_CONTENT_FIXTURE_IDS.sourceCommunityId
    }
  },
  safeMetadata: {
    fixture: true
  }
};

export const rawContentFixturePost: RawContentPost = {
  id: RAW_CONTENT_FIXTURE_IDS.postId,
  title: "Fixture post for raw content contracts",
  bodyText: "This deterministic fixture contains only safe public text.",
  author: {
    id: rawContentFixtureAuthor.id,
    handle: rawContentFixtureAuthor.handle,
    source: rawContentFixtureAuthorSource
  },
  community: {
    id: rawContentFixtureCommunity.id,
    name: rawContentFixtureCommunity.name,
    source: rawContentFixtureCommunitySource
  },
  permalink: "https://reddit.example/r/opportunity/comments/fixture",
  metrics: {
    score: 42,
    commentCount: 1
  },
  createdAt: RAW_CONTENT_FIXTURE_TIMESTAMP,
  source: rawContentFixturePostSource,
  ingestion: rawContentFixtureIngestion,
  provenance: rawContentFixtureProvenance,
  safeMetadata: {
    fixture: true
  }
};

export const rawContentFixtureComment: RawContentComment = {
  id: RAW_CONTENT_FIXTURE_IDS.commentId,
  post: {
    id: rawContentFixturePost.id,
    source: rawContentFixturePostSource,
    permalink: rawContentFixturePost.permalink
  },
  author: {
    id: rawContentFixtureAuthor.id,
    handle: rawContentFixtureAuthor.handle,
    source: rawContentFixtureAuthorSource
  },
  bodyText: "Deterministic fixture comment.",
  permalink: "https://reddit.example/r/opportunity/comments/fixture/comment",
  metrics: {
    score: 7
  },
  createdAt: RAW_CONTENT_FIXTURE_TIMESTAMP,
  source: rawContentFixtureCommentSource,
  ingestion: rawContentFixtureIngestion,
  provenance: {
    ...rawContentFixtureProvenance,
    source: rawContentFixtureCommentSource,
    providerReference: {
      platform: "reddit",
      objectId: RAW_CONTENT_FIXTURE_IDS.sourceCommentId
    }
  },
  safeMetadata: {
    fixture: true
  }
};

export const rawContentFixturePostEnvelope: RawContentEnvelope<RawContentPost> = {
  kind: "post",
  version: RAW_CONTENT_ENVELOPE_VERSION,
  content: rawContentFixturePost,
  ingestion: rawContentFixtureIngestion,
  provenance: rawContentFixtureProvenance,
  safeMetadata: {
    fixture: true
  }
};

export const rawContentFixtureFingerprint: RawContentFingerprint = {
  value: "fingerprint_fixture_001",
  algorithm: RAW_CONTENT_FINGERPRINT_ALGORITHMS[0],
  inputKind: "post",
  sourceObjectId: RAW_CONTENT_FIXTURE_IDS.sourcePostId
};

export const rawContentFixtureValidationSuccess: RawContentValidationSuccess<
  RawContentEnvelope<RawContentPost>
> = {
  ok: true,
  envelope: rawContentFixturePostEnvelope,
  issues: []
};

export const rawContentFixtureDeduplicationDecision: RawContentDeduplicationDecision = {
  status: RAW_CONTENT_DEDUPLICATION_STATUSES[0],
  candidate: {
    envelope: rawContentFixturePostEnvelope,
    fingerprint: rawContentFixtureFingerprint
  },
  issues: [],
  decidedAt: RAW_CONTENT_FIXTURE_TIMESTAMP
};
