import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import {
  API_INVITE_ACCEPTANCE_FAILURE_REASONS,
  type ApiAcceptInviteRequestBody,
  type ApiInviteAcceptanceDto,
  type ApiInviteStore,
  validateAcceptInviteBody
} from "../../auth/index.js";
import { attachSessionToken } from "../../auth/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";

export const API_ACCEPT_INVITE_ROUTE = createApiRouteDefinition({
  method: API_HTTP_METHODS.post,
  path: "/auth/invites/accept",
  operationId: "acceptPrivateBetaInvite",
  summary: "Accept a Private Beta invite",
  tags: ["auth"],
  requiresAuthentication: false
});

export async function handleAcceptInviteRequest(
  request: ApiRequest<ApiAcceptInviteRequestBody>,
  store: ApiInviteStore
): Promise<ApiResponse<ApiInviteAcceptanceDto, ReturnType<typeof createApiError>>> {
  const meta = {
    correlationId: request.context.correlationId,
    requestId: request.context.requestId
  };
  const parsed = validateAcceptInviteBody(request.body);

  if (!parsed.valid) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.validationFailed,
        statusCode: 400,
        message: "Invite acceptance request is invalid.",
        correlationId: meta.correlationId,
        requestId: meta.requestId,
        details: parsed.issues.map((issue) => `${issue.field}:${issue.code}`)
      }),
      meta
    );
  }

  const acceptance = await store.acceptInvite(parsed.value);

  if (!acceptance.accepted) {
    return createApiFailureResponse(
      createApiError({
        code:
          acceptance.reason === API_INVITE_ACCEPTANCE_FAILURE_REASONS.inviteNotFound
            ? API_ERROR_CODES.unauthorized
            : API_ERROR_CODES.forbidden,
        statusCode: acceptance.reason === API_INVITE_ACCEPTANCE_FAILURE_REASONS.inviteNotFound ? 401 : 403,
        message: acceptance.safeMessage,
        correlationId: meta.correlationId,
        requestId: meta.requestId,
        details: [`invite:${acceptance.reason}`]
      }),
      meta
    );
  }

  const response = createApiSuccessResponse(
    {
      invite: acceptance.invite,
      session: acceptance.session
    },
    meta
  );
  attachSessionToken(response, acceptance.sessionToken);
  return response;
}
