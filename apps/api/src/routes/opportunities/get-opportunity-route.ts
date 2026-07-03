import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import type { ApiOpportunityQueryPort } from "../../ports/index.js";
import type { ApiOpportunityDto } from "../../resources/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";
import { parseOpportunityIdParam, type ApiOpportunityIdParams } from "./opportunity-id-param.js";

export const API_GET_OPPORTUNITY_ROUTE = createApiRouteDefinition({
  method: API_HTTP_METHODS.get,
  path: "/opportunities/:opportunityId",
  operationId: "getOpportunity",
  summary: "Read an opportunity",
  tags: ["opportunities"],
  requiresAuthentication: true
});

export async function handleGetOpportunityRequest(
  request: ApiRequest<unknown, Record<string, unknown>, ApiOpportunityIdParams>,
  port: ApiOpportunityQueryPort
): Promise<ApiResponse<ApiOpportunityDto, ReturnType<typeof createApiError>>> {
  const meta = {
    correlationId: request.context.correlationId,
    requestId: request.context.requestId
  };
  const parsed = parseOpportunityIdParam(request.params ?? {});

  if (!parsed.valid) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.validationFailed,
        statusCode: 400,
        message: "Opportunity identifier is invalid.",
        correlationId: meta.correlationId,
        requestId: meta.requestId,
        details: parsed.issues.map((issue) => `${issue.field}:${issue.code}`)
      }),
      meta
    );
  }

  const opportunity = await port.getOpportunity({
    opportunityId: parsed.value.opportunityId,
    correlationId: meta.correlationId,
    requestId: meta.requestId
  });

  if (opportunity === undefined) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.notFound,
        statusCode: 404,
        message: "Opportunity was not found.",
        correlationId: meta.correlationId,
        requestId: meta.requestId
      }),
      meta
    );
  }

  return createApiSuccessResponse(opportunity, meta);
}
