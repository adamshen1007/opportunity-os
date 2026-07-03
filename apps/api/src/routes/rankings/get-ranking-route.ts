import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import type { ApiRankingCommandPort } from "../../ports/index.js";
import type { ApiRankingDto } from "../../resources/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";
import { parseRankingIdParam, type ApiRankingIdParams } from "./ranking-id-param.js";

export const API_GET_RANKING_ROUTE = createApiRouteDefinition({
  method: API_HTTP_METHODS.get,
  path: "/rankings/:rankingId",
  operationId: "getRanking",
  summary: "Read a ranking result",
  tags: ["rankings"],
  requiresAuthentication: true
});

export async function handleGetRankingRequest(
  request: ApiRequest<unknown, Record<string, unknown>, ApiRankingIdParams>,
  port: ApiRankingCommandPort
): Promise<ApiResponse<ApiRankingDto, ReturnType<typeof createApiError>>> {
  const meta = {
    correlationId: request.context.correlationId,
    requestId: request.context.requestId
  };
  const parsed = parseRankingIdParam(request.params ?? {});

  if (!parsed.valid) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.validationFailed,
        statusCode: 400,
        message: "Ranking identifier is invalid.",
        correlationId: meta.correlationId,
        requestId: meta.requestId,
        details: parsed.issues.map((issue) => `${issue.field}:${issue.code}`)
      }),
      meta
    );
  }

  const ranking = await port.getRanking({
    rankingId: parsed.value.rankingId,
    correlationId: meta.correlationId,
    requestId: meta.requestId
  });

  if (ranking === undefined) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.notFound,
        statusCode: 404,
        message: "Ranking result was not found.",
        correlationId: meta.correlationId,
        requestId: meta.requestId
      }),
      meta
    );
  }

  return createApiSuccessResponse(ranking, meta);
}
