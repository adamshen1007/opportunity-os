import type { EmbeddingValueKind } from "../embedding/index.js";

export type EmbeddingInputId = string;

export type EmbeddingInputSourceReference = {
  readonly sourcePackage: "@opportunity-os/normalization" | "@opportunity-os/raw-content";
  readonly sourceId: string;
  readonly sourceVersion?: string;
};

export type EmbeddingInput = {
  readonly inputId: EmbeddingInputId;
  readonly kind: EmbeddingValueKind;
  readonly text: string;
  readonly source: EmbeddingInputSourceReference;
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};
