import type { RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type {
  CanonicalTextId,
  TextCharacterRange,
  TextSegmentId
} from "../text/index.js";

export const TEXT_CHUNK_STRATEGIES = [
  "fixed-character-window",
  "paragraph-boundary",
  "segment-boundary",
  "source-boundary"
] as const;

export type TextChunkStrategy = (typeof TEXT_CHUNK_STRATEGIES)[number];

export type TextChunkId = string;

export type TextChunk = {
  readonly id: TextChunkId;
  readonly canonicalTextId: CanonicalTextId;
  readonly order: number;
  readonly text: string;
  readonly range: TextCharacterRange;
  readonly sourceSegmentIds: readonly TextSegmentId[];
  readonly strategy: TextChunkStrategy;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type TextChunkingOptions = {
  readonly strategy: TextChunkStrategy;
  readonly maxCharacters: number;
  readonly overlapCharacters: number;
  readonly preserveSegmentBoundaries: boolean;
};

export type TextChunkingContract = {
  readonly stage: "text-chunking";
  readonly canonicalTextId: CanonicalTextId;
  readonly options: TextChunkingOptions;
  readonly chunks: readonly TextChunk[];
  readonly safeMetadata?: RawContentSafeMetadata;
};
