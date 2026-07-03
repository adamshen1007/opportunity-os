import { API_ERROR_CODES, createApiError, type ApiError } from "./api-error.js";

export interface ErrorMappingInput {
  readonly error: unknown;
  readonly correlationId: string;
  readonly requestId?: string;
}

export function mapUnknownErrorToApiError(input: ErrorMappingInput): ApiError {
  if (isApiErrorLike(input.error)) {
    return createApiError({
      code: input.error.code,
      statusCode: input.error.statusCode,
      message: input.error.message,
      correlationId: input.correlationId,
      requestId: input.requestId,
      details: input.error.details
    });
  }

  return createApiError({
    code: API_ERROR_CODES.internal,
    statusCode: 500,
    message: "An internal API error occurred.",
    correlationId: input.correlationId,
    requestId: input.requestId
  });
}

function isApiErrorLike(error: unknown): error is Pick<ApiError, "code" | "statusCode" | "message" | "details"> {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const candidate = error as Record<string, unknown>;
  return typeof candidate["code"] === "string" && typeof candidate["statusCode"] === "number" && typeof candidate["message"] === "string";
}
