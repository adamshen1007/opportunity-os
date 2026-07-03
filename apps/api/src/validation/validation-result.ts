export const API_VALIDATION_ISSUE_CODES = {
  invalidType: "invalid-type",
  missingRequiredField: "missing-required-field",
  unsupportedValue: "unsupported-value"
} as const;

export type ApiValidationIssueCode = (typeof API_VALIDATION_ISSUE_CODES)[keyof typeof API_VALIDATION_ISSUE_CODES];

export interface ApiValidationIssue {
  readonly code: ApiValidationIssueCode;
  readonly field: string;
  readonly message: string;
}

export interface ApiValidationSuccess<TValue> {
  readonly valid: true;
  readonly value: TValue;
}

export interface ApiValidationFailure {
  readonly valid: false;
  readonly issues: readonly ApiValidationIssue[];
}

export type ApiValidationResult<TValue> = ApiValidationSuccess<TValue> | ApiValidationFailure;

export function createApiValidationSuccess<TValue>(value: TValue): ApiValidationSuccess<TValue> {
  return {
    valid: true,
    value
  };
}

export function createApiValidationFailure(issues: readonly ApiValidationIssue[]): ApiValidationFailure {
  return {
    valid: false,
    issues: [...issues]
  };
}
