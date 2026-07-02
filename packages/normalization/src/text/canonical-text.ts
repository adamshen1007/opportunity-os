import type {
  RawContentKind,
  RawContentSafeMetadata,
  RawContentSourceMetadata,
  RawContentTimestamp
} from "@opportunity-os/raw-content";
import type { TextSegment } from "./text-segment.js";

export const CANONICAL_TEXT_VERSION = "1.0.0" as const;

export type CanonicalTextId = string;

export type CanonicalTextFormat = "plain-text";

export type CanonicalText = {
  readonly id: CanonicalTextId;
  readonly version: typeof CANONICAL_TEXT_VERSION;
  readonly format: CanonicalTextFormat;
  readonly sourceKind: RawContentKind;
  readonly source: RawContentSourceMetadata;
  readonly text: string;
  readonly segments: readonly TextSegment[];
  readonly normalizedAt: RawContentTimestamp;
  readonly safeMetadata?: RawContentSafeMetadata;
};
