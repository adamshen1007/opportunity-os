import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import type { ApiOpportunityQueryPort } from "../../ports/index.js";
import type { ApiOpportunityCollectionDto } from "../../resources/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";
import { parseOpportunityListQuery } from "./opportunity-query.js";

export const API_LIST_OPPORTUNITIES_ROUTE = createApiRouteDefinition({
  method: API_HTTP_METHODS.get,
  path: "/opportunities",
  operationId: "listOpportunities",
  summary: "List opportunities",
  tags: ["opportunities"],
  requiresAuthentication: true
});

export async function handleListOpportunitiesRequest(
  request: ApiRequest<unknown, Record<string, string | number | boolean | undefined>>,
  port: ApiOpportunityQueryPort
): Promise<ApiResponse<ApiOpportunityCollectionDto, ReturnType<typeof createApiError>>> {
  const parsed = parseOpportunityListQuery(request.query ?? {});
  const meta = {
    correlationId: request.context.correlationId,
    requestId: request.context.requestId
  };

  if (!parsed.valid) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.validationFailed,
        statusCode: 400,
        message: "Opportunity query is invalid.",
        correlationId: meta.correlationId,
        requestId: meta.requestId,
        details: parsed.issues.map((issue) => `${issue.field}:${issue.code}`)
      }),
      meta
    );
  }

  const result = await port.listOpportunities({
    pagination: parsed.value.pagination,
    filters: parsed.value.filters,
    correlationId: meta.correlationId,
    requestId: meta.requestId
  });

  return createApiSuccessResponse(
    {
      opportunities: result.opportunities,
      totalCount: result.totalCount
    },
    meta
  );
}
