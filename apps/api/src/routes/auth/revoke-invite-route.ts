import { type ApiInviteStore } from "../../auth/index.js";
import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";

export interface ApiRevokeInviteDto {
  readonly revoked: true;
}

export const API_REVOKE_INVITE_ROUTE = createApiRouteDefinition({
  method: API_HTTP_METHODS.post,
  path: "/auth/invites/:inviteId/revoke",
  operationId: "revokePrivateBetaInvite",
  summary: "Revoke a Private Beta invite and its active sessions",
  tags: ["auth"],
  requiresAuthentication: true
});

export async function handleRevokeInviteRequest(
  request: ApiRequest<unknown, Record<string, string>, Record<string, string>>,
  store: ApiInviteStore
): Promise<ApiResponse<ApiRevokeInviteDto, ReturnType<typeof createApiError>>> {
  const meta = { correlationId: request.context.correlationId, requestId: request.context.requestId };
  const inviteId = request.params?.inviteId?.trim();
  if (!inviteId || !(await store.revokeInvite(inviteId))) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.notFound,
        statusCode: 404,
        message: "Invite was not found or is already revoked.",
        correlationId: meta.correlationId,
        requestId: meta.requestId,
        details: ["invite:not_found"]
      }),
      meta
    );
  }
  return createApiSuccessResponse({ revoked: true }, meta);
}
