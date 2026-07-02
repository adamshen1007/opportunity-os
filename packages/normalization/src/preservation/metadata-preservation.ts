import type { RawContentSafeMetadata } from "@opportunity-os/raw-content";

export const METADATA_PRESERVATION_POLICIES = [
  "preserve-safe-source-metadata",
  "preserve-ingestion-metadata",
  "preserve-public-provider-reference",
  "drop-unsafe-provider-payload"
] as const;

export type MetadataPreservationPolicy =
  (typeof METADATA_PRESERVATION_POLICIES)[number];

export type MetadataPreservationRecord = {
  readonly policy: MetadataPreservationPolicy;
  readonly sourcePath: readonly string[];
  readonly targetPath: readonly string[];
  readonly preserved: boolean;
  readonly safeMessage?: string;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type MetadataPreservationContract = {
  readonly stage: "metadata-preservation";
  readonly records: readonly MetadataPreservationRecord[];
  readonly safeMetadata?: RawContentSafeMetadata;
};
