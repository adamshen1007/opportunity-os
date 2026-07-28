import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import {
  type ApiCreateFeedbackRequestBody,
  type ApiFeedbackDto,
  type ApiFeedbackStore,
  validateCreateFeedbackBody
} from "../../feedback/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import { withResolvedOpportunityRecordId } from "../../persistence/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";
import { requireOwnershipScope } from "../../ownership/index.js";

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
  store: ApiFeedbackStore,
  options: {
    readonly resolveOpportunityRecordId?: (opportunityId: string) => Promise<string | undefined>;
  } = {}
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

  const ownership = requireOwnershipScope(request.context);
  if (ownership.mode !== "owner") {
    return createApiFailureResponse(createApiError({ code: API_ERROR_CODES.forbidden, statusCode: 403, message: "Administrator override cannot create user feedback.", correlationId: meta.correlationId, requestId: meta.requestId }), meta);
  }
  const resolvedOpportunityRecordId = options.resolveOpportunityRecordId
    ? await options.resolveOpportunityRecordId(parsed.value.opportunityId)
    : parsed.value.opportunityId;
  if (!resolvedOpportunityRecordId) {
    return createApiFailureResponse(createApiError({ code: API_ERROR_CODES.notFound, statusCode: 404, message: "Opportunity was not found.", correlationId: meta.correlationId, requestId: meta.requestId }), meta);
  }
  const feedback = await store.createFeedback(withResolvedOpportunityRecordId({
    ...parsed.value,
    ownerPrincipalId: ownership.principalId,
    opportunityRecordId: resolvedOpportunityRecordId,
    correlationId: meta.correlationId,
    requestId: meta.requestId
  }, resolvedOpportunityRecordId));

  return createApiSuccessResponse(feedback, meta);
}
