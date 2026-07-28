import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import type { ApiRankingCommandPort } from "../../ports/index.js";
import type { ApiRankingDto } from "../../resources/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";
import { validateRankOpportunitiesBody, type ApiRankOpportunitiesRequestBody } from "./ranking-request.js";

export const API_RANK_OPPORTUNITIES_ROUTE = createApiRouteDefinition({
  method: API_HTTP_METHODS.post,
  path: "/rankings",
  operationId: "rankOpportunities",
  summary: "Rank opportunities",
  tags: ["rankings"],
  requiresAuthentication: true
});

export async function handleRankOpportunitiesRequest(
  request: ApiRequest<ApiRankOpportunitiesRequestBody>,
  port: ApiRankingCommandPort
): Promise<ApiResponse<ApiRankingDto, ReturnType<typeof createApiError>>> {
  const meta = {
    correlationId: request.context.correlationId,
    requestId: request.context.requestId
  };
  const parsed = validateRankOpportunitiesBody(request.body);

  if (!parsed.valid) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.validationFailed,
        statusCode: 400,
        message: "Ranking request is invalid.",
        correlationId: meta.correlationId,
        requestId: meta.requestId,
        details: parsed.issues.map((issue) => `${issue.field}:${issue.code}`)
      }),
      meta
    );
  }

  const ranking = await port.rankOpportunities({
    opportunityIds: parsed.value.opportunityIds,
    correlationId: meta.correlationId,
    requestId: meta.requestId
  });

  if (ranking.rankedOpportunities.length !== parsed.value.opportunityIds.length) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.notFound,
        statusCode: 404,
        message: "One or more opportunities were not found.",
        correlationId: meta.correlationId,
        requestId: meta.requestId
      }),
      meta
    );
  }

  return createApiSuccessResponse(ranking, meta);
}
