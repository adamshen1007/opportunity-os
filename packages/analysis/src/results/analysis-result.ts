import type { StructuredAnalysisOutput } from "../analysis/index.js";
import type { StructuredAnalysisConfidenceSummary } from "../confidence/index.js";
import type { StructuredAnalysisErrorSafeDetails } from "../errors/index.js";
import type { StructuredAnalysisEvidenceReference } from "../evidence/index.js";
import type { StructuredAnalysisProvenance } from "../provenance/index.js";
import type { StructuredAnalysisValidationIssue } from "../validation/index.js";

export const STRUCTURED_ANALYSIS_RESULT_STATUSES = {
  success: "success",
  validationFailure: "validation-failure",
  unsafeOutput: "unsafe-output",
  failed: "failed"
} as const;

export type StructuredAnalysisResultStatus =
  (typeof STRUCTURED_ANALYSIS_RESULT_STATUSES)[keyof typeof STRUCTURED_ANALYSIS_RESULT_STATUSES];

export type StructuredAnalysisResultSuccess = {
  readonly status: typeof STRUCTURED_ANALYSIS_RESULT_STATUSES.success;
  readonly output: StructuredAnalysisOutput;
  readonly evidence: readonly StructuredAnalysisEvidenceReference[];
  readonly confidence: StructuredAnalysisConfidenceSummary;
  readonly provenance: StructuredAnalysisProvenance;
};

export type StructuredAnalysisResultFailure = {
  readonly status: Exclude<StructuredAnalysisResultStatus, typeof STRUCTURED_ANALYSIS_RESULT_STATUSES.success>;
  readonly issues: readonly StructuredAnalysisValidationIssue[];
  readonly error?: StructuredAnalysisErrorSafeDetails;
};

export type StructuredAnalysisResult =
  | StructuredAnalysisResultSuccess
  | StructuredAnalysisResultFailure;

