import {
  API_VALIDATION_ISSUE_CODES,
  createApiValidationFailure,
  createApiValidationSuccess,
  type ApiValidationResult
} from "../../validation/index.js";

export interface ApiRankingIdParams {
  readonly rankingId?: string;
}

export function parseRankingIdParam(params: ApiRankingIdParams): ApiValidationResult<{ readonly rankingId: string }> {
  if (params.rankingId === undefined || params.rankingId.trim().length === 0) {
    return createApiValidationFailure([
      {
        code: API_VALIDATION_ISSUE_CODES.missingRequiredField,
        field: "rankingId",
        message: "rankingId is required."
      }
    ]);
  }

  return createApiValidationSuccess({ rankingId: params.rankingId });
}
