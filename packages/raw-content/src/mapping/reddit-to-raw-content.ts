import type {
  RedditAuthor,
  RedditComment,
  RedditDataEnvelope,
  RedditPost,
  RedditSubreddit
} from "@opportunity-os/connectors-reddit";
import type {
  RawContentAuthor,
  RawContentComment,
  RawContentCommunity,
  RawContentEnvelope,
  RawContentPost
} from "../content/index.js";
import type { RawContentIngestionMetadata } from "../ingestion/index.js";
import type { RawContentProvenance } from "../provenance/index.js";
import type { RawContentSafeMetadata } from "../source/index.js";
import type { RawContentValidationIssue } from "../validation/index.js";

export const REDDIT_RAW_CONTENT_MAPPING_TARGETS = [
  "posts",
  "comments",
  "subreddits",
  "authors"
] as const;

export type RedditRawContentMappingTarget =
  (typeof REDDIT_RAW_CONTENT_MAPPING_TARGETS)[number];

export type RedditRawContentMappingContext = {
  readonly ingestion: RawContentIngestionMetadata;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type RedditRawContentSourceInput =
  | RedditPost
  | RedditComment
  | RedditSubreddit
  | RedditAuthor;

export type RedditRawContentMappedItem =
  | RawContentPost
  | RawContentComment
  | RawContentCommunity
  | RawContentAuthor;

export type RedditRawContentMappingInput = {
  readonly envelope: RedditDataEnvelope;
  readonly context: RedditRawContentMappingContext;
};

export type RedditRawContentMappingResult = {
  readonly sourceKind: RedditDataEnvelope["kind"];
  readonly envelopes: readonly RawContentEnvelope<RedditRawContentMappedItem>[];
  readonly provenance: readonly RawContentProvenance[];
  readonly issues: readonly RawContentValidationIssue[];
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type RedditRawContentMappingContract = {
  readonly name: "reddit-to-raw-content-mapping";
  readonly targets: typeof REDDIT_RAW_CONTENT_MAPPING_TARGETS;
};
