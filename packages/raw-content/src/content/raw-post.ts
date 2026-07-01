import type { RawContentIngestionMetadata } from "../ingestion/index.js";
import type { RawContentProvenance } from "../provenance/index.js";
import type {
  RawContentSafeMetadata,
  RawContentSourceMetadata,
  RawContentTimestamp
} from "../source/index.js";
import type { RawContentAuthorReference } from "./raw-author.js";
import type { RawContentCommunityReference } from "./raw-community.js";

export type RawContentPostId = string;

export type RawContentPostReference = {
  readonly id: RawContentPostId;
  readonly source: RawContentSourceMetadata;
  readonly permalink?: string;
};

export type RawContentSourceMetrics = {
  readonly score?: number;
  readonly reactionCount?: number;
  readonly commentCount?: number;
  readonly isHidden?: boolean;
};

export type RawContentPost = {
  readonly id: RawContentPostId;
  readonly title: string;
  readonly bodyText?: string;
  readonly author: RawContentAuthorReference;
  readonly community: RawContentCommunityReference;
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
