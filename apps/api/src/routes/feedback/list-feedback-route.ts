import { type ApiFeedbackCollectionDto, type ApiFeedbackStore } from "../../feedback/index.js";
import { createApiSuccessResponse, type ApiRequest, type ApiSuccessResponse } from "../../http/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";
import { parseFeedbackListQuery, type ApiFeedbackListQuery } from "./feedback-query.js";
import { requireOwnershipScope } from "../../ownership/index.js";

export const API_LIST_FEEDBACK_ROUTE = createApiRouteDefinition({
  method: API_HTTP_METHODS.get,
  path: "/feedback",
  operationId: "listFeedback",
  summary: "List product validation feedback",
  tags: ["feedback"],
  requiresAuthentication: true
});

export async function handleListFeedbackRequest(
  request: ApiRequest<unknown, ApiFeedbackListQuery>,
  store: ApiFeedbackStore
): Promise<ApiSuccessResponse<ApiFeedbackCollectionDto>> {
  const query = parseFeedbackListQuery(request.query);
  const feedback = await store.listFeedback({ ...query, scope: requireOwnershipScope(request.context) });

  return createApiSuccessResponse(
    {
      feedback,
      totalCount: feedback.length
    },
    {
      correlationId: request.context.correlationId,
      requestId: request.context.requestId
    }
  );
}
