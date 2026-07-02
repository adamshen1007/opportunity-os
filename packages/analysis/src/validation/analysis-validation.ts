import type { StructuredAnalysisFieldPath } from "../analysis/index.js";

export const STRUCTURED_ANALYSIS_VALIDATION_ISSUE_CODES = {
  missingRequiredField: "structured-analysis.missing_required_field",
  invalidFieldKind: "structured-analysis.invalid_field_kind",
  schemaMismatch: "structured-analysis.schema_mismatch",
  unsafeMetadata: "structured-analysis.unsafe_metadata",
  invalidEvidence: "structured-analysis.invalid_evidence",
  invalidConfidence: "structured-analysis.invalid_confidence"
} as const;

export type StructuredAnalysisValidationIssueCode =
  (typeof STRUCTURED_ANALYSIS_VALIDATION_ISSUE_CODES)[keyof typeof STRUCTURED_ANALYSIS_VALIDATION_ISSUE_CODES];

export type StructuredAnalysisValidationIssue = {
  readonly code: StructuredAnalysisValidationIssueCode;
  readonly message: string;
  readonly path?: StructuredAnalysisFieldPath;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean | null>>;
};

export type StructuredAnalysisValidationSuccess = {
  readonly valid: true;
  readonly issues: readonly [];
};

export type StructuredAnalysisValidationFailure = {
  readonly valid: false;
  readonly issues: readonly StructuredAnalysisValidationIssue[];
};

export type StructuredAnalysisValidationResult =
  | StructuredAnalysisValidationSuccess
  | StructuredAnalysisValidationFailure;

