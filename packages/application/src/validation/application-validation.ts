import { redactApplicationErrorText } from "../errors/index.js";

export type ApplicationValidationIssue = {
  readonly path: readonly string[];
  readonly code: string;
  readonly message: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
};

export type ApplicationValidationSuccess<TValue> = {
  readonly valid: true;
  readonly value: TValue;
};

export type ApplicationValidationFailure = {
  readonly valid: false;
  readonly issues: readonly ApplicationValidationIssue[];
};

export type ApplicationValidationResult<TValue> =
  | ApplicationValidationSuccess<TValue>
  | ApplicationValidationFailure;

export function applicationValidationSuccess<TValue>(
  value: TValue
): ApplicationValidationSuccess<TValue> {
  return {
    valid: true,
    value
  };
}

export function applicationValidationFailure(
  issues: readonly ApplicationValidationIssue[]
): ApplicationValidationFailure {
  return {
    valid: false,
    issues: issues.map((issue) => ({
      ...issue,
      message: redactApplicationErrorText(issue.message)
    }))
  };
}
