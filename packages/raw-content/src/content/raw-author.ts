import type { RawContentIngestionMetadata } from "../ingestion/index.js";
import type { RawContentProvenance } from "../provenance/index.js";
import type {
  RawContentSafeMetadata,
  RawContentSourceMetadata,
  RawContentTimestamp
} from "../source/index.js";

export type RawContentAuthorId = string;

export type RawContentAuthorReference = {
  readonly id: RawContentAuthorId;
  readonly handle?: string;
  readonly source: RawContentSourceMetadata;
};

export type RawContentAuthor = {
  readonly id: RawContentAuthorId;
  readonly handle: string;
  readonly displayName?: string;
  readonly profileUrl?: string;
  readonly accountCreatedAt?: RawContentTimestamp;
  readonly source: RawContentSourceMetadata;
  readonly ingestion: RawContentIngestionMetadata;
  readonly provenance: RawContentProvenance;
  readonly safeMetadata?: RawContentSafeMetadata;
};
