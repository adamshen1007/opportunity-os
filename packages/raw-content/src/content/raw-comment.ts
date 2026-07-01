import type { RawContentIngestionMetadata } from "../ingestion/index.js";
import type { RawContentProvenance } from "../provenance/index.js";
import type {
  RawContentSafeMetadata,
  RawContentSourceMetadata,
  RawContentTimestamp
} from "../source/index.js";
import type { RawContentAuthorReference } from "./raw-author.js";
import type { RawContentPostReference, RawContentSourceMetrics } from "./raw-post.js";

export type RawContentCommentId = string;

export type RawContentCommentReference = {
  readonly id: RawContentCommentId;
  readonly source: RawContentSourceMetadata;
  readonly permalink?: string;
};

export type RawContentComment = {
  readonly id: RawContentCommentId;
  readonly post: RawContentPostReference;
  readonly parentComment?: RawContentCommentReference;
  readonly author: RawContentAuthorReference;
  readonly bodyText: string;
  readonly permalink: string;
  readonly metrics: RawContentSourceMetrics;
  readonly createdAt?: RawContentTimestamp;
  readonly updatedAt?: RawContentTimestamp;
  readonly editedAt?: RawContentTimestamp;
  readonly source: RawContentSourceMetadata;
  readonly ingestion: RawContentIngestionMetadata;
  readonly provenance: RawContentProvenance;
  readonly safeMetadata?: RawContentSafeMetadata;
};
