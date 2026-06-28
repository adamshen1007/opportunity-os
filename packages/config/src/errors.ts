export type ConfigErrorCode =
  | "CONFIG_REQUIRED_ENVIRONMENT_INVALID"
  | "CONFIG_SCHEMA_NOT_IMPLEMENTED"
  | "CONFIG_VALIDATION_NOT_IMPLEMENTED";

export interface ConfigValidationIssue {
  readonly code: ConfigErrorCode;
  readonly variableName: string;
  readonly message: string;
}

export class EnvironmentValidationError extends Error {
  readonly code = "CONFIG_REQUIRED_ENVIRONMENT_INVALID";
  readonly issues: readonly ConfigValidationIssue[];

  constructor(issues: readonly ConfigValidationIssue[]) {
    super(formatConfigValidationMessage(issues));
    this.name = "EnvironmentValidationError";
    this.issues = issues;
  }
}

function formatConfigValidationMessage(issues: readonly ConfigValidationIssue[]) {
  const messages = issues.map((issue) => `${issue.variableName}: ${issue.message}`);
  return `Invalid environment configuration: ${messages.join("; ")}`;
}
