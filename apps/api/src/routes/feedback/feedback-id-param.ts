import {
  API_VALIDATION_ISSUE_CODES,
  createApiValidationFailure,
  createApiValidationSuccess,
  type ApiValidationResult
} from "../../validation/index.js";

export interface ApiFeedbackIdParams {
  readonly feedbackId?: string;
}

export function parseFeedbackIdParam(params: ApiFeedbackIdParams): ApiValidationResult<{ readonly feedbackId: string }> {
  if (params.feedbackId === undefined || params.feedbackId.trim().length === 0) {
    return createApiValidationFailure([
      {
        code: API_VALIDATION_ISSUE_CODES.missingRequiredField,
        field: "feedbackId",
        message: "feedbackId is required."
      }
    ]);
  }

  return createApiValidationSuccess({ feedbackId: params.feedbackId });
}

