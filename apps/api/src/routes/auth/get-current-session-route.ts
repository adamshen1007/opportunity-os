import { type ApiInviteStore, type ApiSessionDto } from "../../auth/index.js";
import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";

export const API_GET_CURRENT_SESSION_ROUTE = createApiRouteDefinition({
  method: API_HTTP_METHODS.get,
  path: "/auth/session",
  operationId: "getCurrentPrivateBetaSession",
  summary: "Read the current Private Beta session",
  tags: ["auth"],
  requiresAuthentication: true
});

export async function handleGetCurrentSessionRequest(
  request: ApiRequest,
  store: ApiInviteStore
): Promise<ApiResponse<ApiSessionDto, ReturnType<typeof createApiError>>> {
  const meta = { correlationId: request.context.correlationId, requestId: request.context.requestId };
  const session = request.context.sessionId ? await store.getSession(request.context.sessionId) : undefined;
  if (!session) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.unauthorized,
        statusCode: 401,
        message: "An active beta session is required.",
        correlationId: meta.correlationId,
        requestId: meta.requestId,
        details: ["session:inactive"]
      }),
      meta
    );
  }
  return createApiSuccessResponse(session, meta);
}
