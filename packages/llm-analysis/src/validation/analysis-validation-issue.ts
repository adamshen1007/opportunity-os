export const ANALYSIS_VALIDATION_ISSUE_CODES = {
  missingPromptInput: "missing-prompt-input",
  invalidPromptOutput: "invalid-prompt-output",
  unsafePayload: "unsafe-payload",
  unsupportedStructuredOutput: "unsupported-structured-output",
  missingProvenance: "missing-provenance"
} as const;

export type AnalysisValidationIssueCode =
  (typeof ANALYSIS_VALIDATION_ISSUE_CODES)[keyof typeof ANALYSIS_VALIDATION_ISSUE_CODES];

export type AnalysisValidationIssue = {
  readonly code: AnalysisValidationIssueCode;
  readonly path: readonly string[];
  readonly message: string;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean | null>>;
};
