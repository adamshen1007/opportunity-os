import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import {
  type ApiCreateFeedbackRequestBody,
  type ApiFeedbackDto,
  type ApiFeedbackStore,
  validateCreateFeedbackBody
} from "../../feedback/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";

export const API_CREATE_FEEDBACK_ROUTE = createApiRouteDefinition({
  method: API_HTTP_METHODS.post,
  path: "/feedback",
  operationId: "createFeedback",
  summary: "Create deterministic product validation feedback",
  tags: ["feedback"],
  requiresAuthentication: true
});

export async function handleCreateFeedbackRequest(
  request: ApiRequest<ApiCreateFeedbackRequestBody>,
  store: ApiFeedbackStore
): Promise<ApiResponse<ApiFeedbackDto, ReturnType<typeof createApiError>>> {
  const meta = {
    correlationId: request.context.correlationId,
    requestId: request.context.requestId
  };
  const parsed = validateCreateFeedbackBody(request.body);

  if (!parsed.valid) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.validationFailed,
        statusCode: 400,
        message: "Feedback request is invalid.",
        correlationId: meta.correlationId,
        requestId: meta.requestId,
        details: parsed.issues.map((issue) => `${issue.field}:${issue.code}`)
      }),
      meta
    );
  }

  const feedback = await store.createFeedback({
    ...parsed.value,
    correlationId: meta.correlationId,
    requestId: meta.requestId
  });

  return createApiSuccessResponse(feedback, meta);
}

