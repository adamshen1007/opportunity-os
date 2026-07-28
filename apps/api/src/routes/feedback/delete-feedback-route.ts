import type { ApiFeedbackStore } from "../../feedback/index.js";
import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";
import { requireOwnershipScope } from "../../ownership/index.js";

export const API_DELETE_FEEDBACK_ROUTE = createApiRouteDefinition({ method: API_HTTP_METHODS.delete, path: "/feedback/:feedbackId", operationId: "deleteFeedback", summary: "Delete validation feedback", tags: ["feedback", "privacy"], requiresAuthentication: true });

export async function handleDeleteFeedbackRequest(request: ApiRequest<unknown, Record<string, unknown>, { feedbackId?: string }>, store: ApiFeedbackStore): Promise<ApiResponse<{ readonly deleted: true }, ReturnType<typeof createApiError>>> {
  const meta = { correlationId: request.context.correlationId, requestId: request.context.requestId };
  const deleted = request.params?.feedbackId ? await store.deleteFeedback(requireOwnershipScope(request.context), request.params.feedbackId) : false;
  if (deleted) return createApiSuccessResponse({ deleted: true }, meta);
  return createApiFailureResponse(createApiError({ code: API_ERROR_CODES.notFound, statusCode: 404, message: "Feedback was not found.", correlationId: meta.correlationId, requestId: meta.requestId, details: ["feedback:not-found"] }), meta);
}
