import { type ApiInviteStore } from "../../auth/index.js";
import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";

export interface ApiLogoutDto {
  readonly loggedOut: true;
}

export const API_LOGOUT_ROUTE = createApiRouteDefinition({
  method: API_HTTP_METHODS.post,
  path: "/auth/logout",
  operationId: "logoutPrivateBetaSession",
  summary: "Revoke the current Private Beta session",
  tags: ["auth"],
  requiresAuthentication: true
});

export async function handleLogoutRequest(
  request: ApiRequest,
  store: ApiInviteStore
): Promise<ApiResponse<ApiLogoutDto, ReturnType<typeof createApiError>>> {
  const meta = { correlationId: request.context.correlationId, requestId: request.context.requestId };
  if (!request.context.sessionId || !(await store.revokeSession(request.context.sessionId))) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.unauthorized,
        statusCode: 401,
        message: "The beta session is no longer active.",
        correlationId: meta.correlationId,
        requestId: meta.requestId,
        details: ["session:inactive"]
      }),
      meta
    );
  }
  return createApiSuccessResponse({ loggedOut: true }, meta);
}
