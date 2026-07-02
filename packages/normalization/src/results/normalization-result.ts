import type { RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type { NormalizationOutput } from "../pipeline/index.js";
import type { NormalizationValidationIssue } from "../validation/index.js";

export const NORMALIZATION_RESULT_STATUSES = [
  "success",
  "partial-success",
  "validation-failure",
  "failure"
] as const;

export type NormalizationResultStatus =
  (typeof NORMALIZATION_RESULT_STATUSES)[number];

export type NormalizationFailure = {
  readonly code: string;
  readonly safeMessage: string;
  readonly issues: readonly NormalizationValidationIssue[];
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type NormalizationSuccess<TOutput extends NormalizationOutput = NormalizationOutput> = {
  readonly ok: true;
  readonly status: "success" | "partial-success";
  readonly output: TOutput;
  readonly issues: readonly NormalizationValidationIssue[];
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type NormalizationFailureResult = {
  readonly ok: false;
  readonly status: "validation-failure" | "failure";
  readonly failure: NormalizationFailure;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type NormalizationResult<TOutput extends NormalizationOutput = NormalizationOutput> =
  | NormalizationSuccess<TOutput>
  | NormalizationFailureResult;
