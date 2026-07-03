import {
  API_VALIDATION_ISSUE_CODES,
  createApiValidationFailure,
  createApiValidationSuccess,
  type ApiValidationIssue,
  type ApiValidationResult
} from "./validation-result.js";

export interface RequiredFieldRule {
  readonly field: string;
  readonly label?: string;
}

export function validateRequiredFields<TValue extends Record<string, unknown>>(
  value: TValue,
  rules: readonly RequiredFieldRule[]
): ApiValidationResult<TValue> {
  const issues: ApiValidationIssue[] = [];

  for (const rule of rules) {
    const fieldValue = value[rule.field];
    if (fieldValue === undefined || fieldValue === null || fieldValue === "") {
      issues.push({
        code: API_VALIDATION_ISSUE_CODES.missingRequiredField,
        field: rule.field,
        message: `${rule.label ?? rule.field} is required.`
      });
    }
  }

  return issues.length > 0 ? createApiValidationFailure(issues) : createApiValidationSuccess(value);
}
