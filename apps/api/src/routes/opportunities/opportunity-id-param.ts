import {
  API_VALIDATION_ISSUE_CODES,
  createApiValidationFailure,
  createApiValidationSuccess,
  type ApiValidationResult
} from "../../validation/index.js";

export interface ApiOpportunityIdParams {
  readonly opportunityId?: string;
}

export function parseOpportunityIdParam(params: ApiOpportunityIdParams): ApiValidationResult<{ readonly opportunityId: string }> {
  if (params.opportunityId === undefined || params.opportunityId.trim().length === 0) {
    return createApiValidationFailure([
      {
        code: API_VALIDATION_ISSUE_CODES.missingRequiredField,
        field: "opportunityId",
        message: "opportunityId is required."
      }
    ]);
  }

  return createApiValidationSuccess({ opportunityId: params.opportunityId });
}
