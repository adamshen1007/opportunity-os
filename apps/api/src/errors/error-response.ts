import type { ApiFailureResponse, ApiResponseMeta } from "../http/index.js";
import { createApiFailureResponse } from "../http/index.js";
import type { ApiError } from "./api-error.js";

export function createApiErrorResponse(error: ApiError, meta: ApiResponseMeta): ApiFailureResponse<ApiError> {
  return createApiFailureResponse(error, meta);
}
