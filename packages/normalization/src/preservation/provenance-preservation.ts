import type {
  RawContentProvenance,
  RawContentSafeMetadata
} from "@opportunity-os/raw-content";

export const PROVENANCE_PRESERVATION_POLICIES = [
  "preserve-source-reference",
  "preserve-ingestion-reference",
  "preserve-transform-boundary",
  "append-normalization-boundary"
] as const;

export type ProvenancePreservationPolicy =
  (typeof PROVENANCE_PRESERVATION_POLICIES)[number];

export type NormalizationProvenance = RawContentProvenance & {
  readonly normalizationBoundary: "normalization-contract";
};

export type ProvenancePreservationRecord = {
  readonly policy: ProvenancePreservationPolicy;
  readonly preserved: boolean;
  readonly safeMessage?: string;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type ProvenancePreservationContract = {
  readonly stage: "provenance-preservation";
  readonly sourceProvenance: RawContentProvenance;
  readonly normalizedProvenance: NormalizationProvenance;
  readonly records: readonly ProvenancePreservationRecord[];
  readonly safeMetadata?: RawContentSafeMetadata;
};
