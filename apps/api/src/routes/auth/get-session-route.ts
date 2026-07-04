import { type ApiInviteStore, type ApiSessionDto } from "../../auth/index.js";
import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";
import { parseApiSessionIdParam, type ApiSessionIdParams } from "./session-id-param.js";

export const API_GET_SESSION_ROUTE = createApiRouteDefinition({
  method: API_HTTP_METHODS.get,
  path: "/auth/sessions/:sessionId",
  operationId: "getPrivateBetaSession",
  summary: "Read a Private Beta session",
  tags: ["auth"],
  requiresAuthentication: true
});

export async function handleGetSessionRequest(
  request: ApiRequest<unknown, Record<string, unknown>, ApiSessionIdParams>,
  store: ApiInviteStore
): Promise<ApiResponse<ApiSessionDto, ReturnType<typeof createApiError>>> {
  const meta = {
    correlationId: request.context.correlationId,
    requestId: request.context.requestId
  };
  const sessionId = parseApiSessionIdParam(request.params);

  if (!sessionId) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.validationFailed,
        statusCode: 400,
        message: "Session identifier is required.",
        correlationId: meta.correlationId,
        requestId: meta.requestId,
        details: ["sessionId:missing-required-field"]
      }),
      meta
    );
  }

  const session = await store.getSession(sessionId);
  if (!session) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.notFound,
        statusCode: 404,
        message: "Session was not found.",
        correlationId: meta.correlationId,
        requestId: meta.requestId,
        details: ["session:not-found"]
      }),
      meta
    );
  }

  return createApiSuccessResponse(session, meta);
}
