import type { RawContentSafeMetadata } from "@opportunity-os/raw-content";

export type TextSegmentId = string;

export type TextCharacterRange = {
  readonly start: number;
  readonly end: number;
};

export type TextSegment = {
  readonly id: TextSegmentId;
  readonly order: number;
  readonly text: string;
  readonly range: TextCharacterRange;
  readonly sourceRange?: TextCharacterRange;
  readonly safeMetadata?: RawContentSafeMetadata;
};
