export const NORMALIZATION_STAGES = [
  "raw-content-input",
  "canonical-text-model",
  "markdown-cleaning",
  "html-cleaning",
  "unicode-normalization",
  "whitespace-normalization",
  "url-normalization",
  "language-detection",
  "text-chunking",
  "metadata-preservation",
  "provenance-preservation",
  "validation",
  "finalization"
] as const;

export type NormalizationStage = (typeof NORMALIZATION_STAGES)[number];

export type NormalizationStageStatus =
  | "pending"
  | "completed"
  | "skipped"
  | "failed";

export type NormalizationStageRecord = {
  readonly stage: NormalizationStage;
  readonly status: NormalizationStageStatus;
  readonly safeMessage?: string;
};
