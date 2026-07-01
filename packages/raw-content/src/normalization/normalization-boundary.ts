import type { RawContentEnvelope, RawContentItem } from "../content/index.js";
import type { RawContentSafeMetadata } from "../source/index.js";
import type { RawContentValidationIssue } from "../validation/index.js";

export const RAW_CONTENT_NORMALIZATION_BOUNDARY_STAGES = [
  "raw-content-input",
  "normalized-output"
] as const;

export type RawContentNormalizationBoundaryStage =
  (typeof RAW_CONTENT_NORMALIZATION_BOUNDARY_STAGES)[number];

export type RawContentNormalizationInput<TContent extends RawContentItem = RawContentItem> = {
  readonly stage: "raw-content-input";
  readonly envelope: RawContentEnvelope<TContent>;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type RawContentNormalizationOutput = {
  readonly stage: "normalized-output";
  readonly sourceEnvelope: RawContentEnvelope;
  readonly normalizedReference: {
    readonly kind: "canonical-content-reference";
    readonly id?: string;
  };
  readonly issues: readonly RawContentValidationIssue[];
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type RawContentNormalizationBoundary = {
  readonly name: "raw-content-normalization-boundary";
  readonly input: RawContentNormalizationInput;
  readonly output: RawContentNormalizationOutput;
};
