import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import {
  type ApiCreateInviteRequestBody,
  type ApiInviteDto,
  type ApiInviteStore,
  validateCreateInviteBody
} from "../../auth/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";

export const API_CREATE_INVITE_ROUTE = createApiRouteDefinition({
  method: API_HTTP_METHODS.post,
  path: "/auth/invites",
  operationId: "createPrivateBetaInvite",
  summary: "Create a Private Beta invite",
  tags: ["auth"],
  requiresAuthentication: true
});

export async function handleCreateInviteRequest(
  request: ApiRequest<ApiCreateInviteRequestBody>,
  store: ApiInviteStore
): Promise<ApiResponse<ApiInviteDto, ReturnType<typeof createApiError>>> {
  const meta = {
    correlationId: request.context.correlationId,
    requestId: request.context.requestId
  };
  const parsed = validateCreateInviteBody(request.body);

  if (!parsed.valid) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.validationFailed,
        statusCode: 400,
        message: "Invite request is invalid.",
        correlationId: meta.correlationId,
        requestId: meta.requestId,
        details: parsed.issues.map((issue) => `${issue.field}:${issue.code}`)
      }),
      meta
    );
  }

  const invite = await store.createInvite({
    ...parsed.value,
    correlationId: meta.correlationId,
    requestId: meta.requestId
  });

  return createApiSuccessResponse(invite, meta);
}
