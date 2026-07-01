import type { RawContentIngestionMetadata } from "../ingestion/index.js";
import type { RawContentProvenance } from "../provenance/index.js";
import type {
  RawContentSafeMetadata,
  RawContentSourceMetadata,
  RawContentTimestamp
} from "../source/index.js";

export type RawContentCommunityId = string;

export type RawContentCommunityReference = {
  readonly id: RawContentCommunityId;
  readonly name: string;
  readonly source: RawContentSourceMetadata;
};

export type RawContentCommunityVisibility = "public" | "restricted" | "private" | "unknown";

export type RawContentCommunity = {
  readonly id: RawContentCommunityId;
  readonly name: string;
  readonly displayName?: string;
  readonly title?: string;
  readonly description?: string;
  readonly visibility: RawContentCommunityVisibility;
  readonly subscriberCount?: number;
  readonly createdAt?: RawContentTimestamp;
  readonly source: RawContentSourceMetadata;
  readonly ingestion: RawContentIngestionMetadata;
  readonly provenance: RawContentProvenance;
  readonly safeMetadata?: RawContentSafeMetadata;
};
