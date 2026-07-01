import type { RawContentIngestionMetadata } from "../ingestion/index.js";
import type { RawContentProvenance } from "../provenance/index.js";
import type { RawContentSafeMetadata } from "../source/index.js";
import type { RawContentAuthor } from "./raw-author.js";
import type { RawContentComment } from "./raw-comment.js";
import type { RawContentCommunity } from "./raw-community.js";
import type { RawContentPost } from "./raw-post.js";

export const RAW_CONTENT_KINDS = [
  "post",
  "comment",
  "author",
  "community"
] as const;

export const RAW_CONTENT_ENVELOPE_VERSION = "1.0.0" as const;

export type RawContentKind = (typeof RAW_CONTENT_KINDS)[number];

export type RawContentItem =
  | RawContentPost
  | RawContentComment
  | RawContentAuthor
  | RawContentCommunity;

export type RawContentEnvelope<TContent extends RawContentItem = RawContentItem> = {
  readonly kind: RawContentKind;
  readonly version: typeof RAW_CONTENT_ENVELOPE_VERSION;
  readonly content: TContent;
  readonly ingestion: RawContentIngestionMetadata;
  readonly provenance: RawContentProvenance;
  readonly safeMetadata?: RawContentSafeMetadata;
};
