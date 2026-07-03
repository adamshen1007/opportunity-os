import { createApiSuccessResponse, type ApiRequest, type ApiSuccessResponse } from "../../http/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";
import type { ApiHealthDto } from "./health-schema.js";

export const API_HEALTH_ROUTE = createApiRouteDefinition({
  method: API_HTTP_METHODS.get,
  path: "/health",
  operationId: "getHealth",
  summary: "Read API health status",
  tags: ["health"],
  requiresAuthentication: false
});

export interface ApiHealthRouteInput {
  readonly serviceName: string;
  readonly version: string;
  readonly clock: () => string;
}

export function handleApiHealthRequest(
  request: ApiRequest,
  input: ApiHealthRouteInput
): ApiSuccessResponse<ApiHealthDto> {
  return createApiSuccessResponse(
    {
      status: "ok",
      serviceName: input.serviceName,
      version: input.version,
      checkedAt: input.clock()
    },
    {
      correlationId: request.context.correlationId,
      requestId: request.context.requestId
    }
  );
}
