import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import type { ApiFeedbackDto, ApiFeedbackStore } from "../../feedback/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";
import { parseFeedbackIdParam, type ApiFeedbackIdParams } from "./feedback-id-param.js";
import { requireOwnershipScope } from "../../ownership/index.js";

export const API_GET_FEEDBACK_ROUTE = createApiRouteDefinition({
  method: API_HTTP_METHODS.get,
  path: "/feedback/:feedbackId",
  operationId: "getFeedback",
  summary: "Read product validation feedback",
  tags: ["feedback"],
  requiresAuthentication: true
});

export async function handleGetFeedbackRequest(
  request: ApiRequest<unknown, Record<string, unknown>, ApiFeedbackIdParams>,
  store: ApiFeedbackStore
): Promise<ApiResponse<ApiFeedbackDto, ReturnType<typeof createApiError>>> {
  const meta = {
    correlationId: request.context.correlationId,
    requestId: request.context.requestId
  };
  const parsed = parseFeedbackIdParam(request.params ?? {});

  if (!parsed.valid) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.validationFailed,
        statusCode: 400,
        message: "Feedback identifier is invalid.",
        correlationId: meta.correlationId,
        requestId: meta.requestId,
        details: parsed.issues.map((issue) => `${issue.field}:${issue.code}`)
      }),
      meta
    );
  }

  const feedback = await store.getFeedback(requireOwnershipScope(request.context), parsed.value.feedbackId);
  if (feedback === undefined) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.notFound,
        statusCode: 404,
        message: "Feedback was not found.",
        correlationId: meta.correlationId,
        requestId: meta.requestId
      }),
      meta
    );
  }

  return createApiSuccessResponse(feedback, meta);
}
