import type { AnalysisResponse } from "../analysis/index.js";
import type { AnalysisErrorSafeDetails } from "../errors/index.js";
import type { AnalysisValidationIssue } from "../validation/index.js";

export const ANALYSIS_RESULT_STATUSES = {
  success: "success",
  validationFailure: "validation-failure",
  providerUnavailable: "provider-unavailable",
  unsafeOutput: "unsafe-output",
  failed: "failed"
} as const;

export type AnalysisResultStatus =
  (typeof ANALYSIS_RESULT_STATUSES)[keyof typeof ANALYSIS_RESULT_STATUSES];

export type AnalysisResultSuccess = {
  readonly status: typeof ANALYSIS_RESULT_STATUSES.success;
  readonly response: AnalysisResponse;
};

export type AnalysisResultFailure = {
  readonly status: Exclude<AnalysisResultStatus, typeof ANALYSIS_RESULT_STATUSES.success>;
  readonly issues: readonly AnalysisValidationIssue[];
  readonly error?: AnalysisErrorSafeDetails;
};

export type AnalysisResult =
  | AnalysisResultSuccess
  | AnalysisResultFailure;
