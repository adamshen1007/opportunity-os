import {
  API_VALIDATION_ISSUE_CODES,
  createApiValidationFailure,
  createApiValidationSuccess,
  type ApiValidationResult
} from "../../validation/index.js";

export interface ApiRankOpportunitiesRequestBody {
  readonly opportunityIds?: readonly string[];
}

export function validateRankOpportunitiesBody(
  body: ApiRankOpportunitiesRequestBody | undefined
): ApiValidationResult<{ readonly opportunityIds: readonly string[] }> {
  if (body?.opportunityIds === undefined || body.opportunityIds.length === 0) {
    return createApiValidationFailure([
      {
        code: API_VALIDATION_ISSUE_CODES.missingRequiredField,
        field: "opportunityIds",
        message: "opportunityIds is required."
      }
    ]);
  }

  const invalidIndex = body.opportunityIds.findIndex((id) => id.trim().length === 0);
  if (invalidIndex >= 0) {
    return createApiValidationFailure([
      {
        code: API_VALIDATION_ISSUE_CODES.unsupportedValue,
        field: `opportunityIds.${invalidIndex}`,
        message: "opportunityIds must contain non-empty values."
      }
    ]);
  }

  return createApiValidationSuccess({ opportunityIds: [...body.opportunityIds] });
}
