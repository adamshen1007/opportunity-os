import type { RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type { NormalizationOutput } from "../pipeline/index.js";

export const NORMALIZATION_VALIDATION_ISSUE_CODES = [
  "missing-canonical-text",
  "missing-source-provenance",
  "empty-normalized-text",
  "invalid-text-range",
  "unsafe-metadata",
  "stage-incomplete",
  "chunk-boundary-invalid",
  "language-tag-invalid"
] as const;

export type NormalizationValidationIssueCode =
  (typeof NORMALIZATION_VALIDATION_ISSUE_CODES)[number];

export type NormalizationValidationIssue = {
  readonly code: NormalizationValidationIssueCode;
  readonly path: readonly string[];
  readonly safeMessage: string;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type NormalizationValidationSuccess<TOutput extends NormalizationOutput = NormalizationOutput> = {
  readonly ok: true;
  readonly output: TOutput;
  readonly issues: readonly [];
};

export type NormalizationValidationFailure = {
  readonly ok: false;
  readonly issues: readonly NormalizationValidationIssue[];
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type NormalizationValidationResult<TOutput extends NormalizationOutput = NormalizationOutput> =
  | NormalizationValidationSuccess<TOutput>
  | NormalizationValidationFailure;

export type NormalizationValidationContract = {
  readonly stage: "validation";
  readonly issueCodes: typeof NORMALIZATION_VALIDATION_ISSUE_CODES;
};
