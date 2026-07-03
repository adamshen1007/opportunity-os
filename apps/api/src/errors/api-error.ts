export const API_ERROR_CODES = {
  badRequest: "api.bad_request",
  conflict: "api.conflict",
  forbidden: "api.forbidden",
  internal: "api.internal",
  notFound: "api.not_found",
  unauthorized: "api.unauthorized",
  validationFailed: "api.validation_failed"
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

export interface ApiError {
  readonly code: ApiErrorCode;
  readonly statusCode: number;
  readonly message: string;
  readonly correlationId: string;
  readonly requestId?: string;
  readonly details?: readonly string[];
}

export function createApiError(error: ApiError): ApiError {
  return {
    code: error.code,
    statusCode: error.statusCode,
    message: error.message,
    correlationId: error.correlationId,
    requestId: error.requestId,
    details: error.details ? [...error.details] : undefined
  };
}
