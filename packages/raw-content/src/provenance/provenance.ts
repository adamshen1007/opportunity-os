import type { RawContentIngestionMetadata } from "../ingestion/index.js";
import type {
  RawContentSafeMetadata,
  RawContentSourceMetadata,
  RawContentSourcePlatform,
  RawContentTimestamp
} from "../source/index.js";

export type RawContentProvenanceTransformBoundary =
  | "provider-output"
  | "raw-content-contract";

export type RawContentProviderReference = {
  readonly platform: RawContentSourcePlatform;
  readonly objectId: string;
  readonly objectUrl?: string;
};

export type RawContentProvenance = {
  readonly source: RawContentSourceMetadata;
  readonly ingestion: RawContentIngestionMetadata;
  readonly providerReference: RawContentProviderReference;
  readonly collectedThrough: "reddit-provider-transport" | "stack-exchange-provider-transport";
  readonly transformBoundary: RawContentProvenanceTransformBoundary;
  readonly recordedAt: RawContentTimestamp;
  readonly safeMetadata?: RawContentSafeMetadata;
};
