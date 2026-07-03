import {
  API_VALIDATION_ISSUE_CODES,
  createApiValidationFailure,
  createApiValidationSuccess,
  type ApiValidationIssue,
  type ApiValidationResult
} from "../validation/index.js";
import type { RawApiFilterQuery } from "./filter-query.js";

export function validateApiFilterFields(
  query: RawApiFilterQuery,
  allowedFields: readonly string[]
): ApiValidationResult<RawApiFilterQuery> {
  const allowed = new Set(allowedFields);
  const issues: ApiValidationIssue[] = [];

  for (const key of Object.keys(query)) {
    if (!allowed.has(key)) {
      issues.push({
        code: API_VALIDATION_ISSUE_CODES.unsupportedValue,
        field: key,
        message: `${key} is not an allowed filter.`
      });
    }
  }

  return issues.length > 0 ? createApiValidationFailure(issues) : createApiValidationSuccess(query);
}
