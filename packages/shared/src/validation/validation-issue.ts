export type ValidationIssueSeverity = "error" | "warning";

export type ValidationIssueMetadata = {
  readonly [key: string]: unknown;
};

export type ValidationIssue = {
  readonly code: string;
  readonly message: string;
  readonly path?: readonly string[];
  readonly severity: ValidationIssueSeverity;
  readonly metadata?: ValidationIssueMetadata;
};
