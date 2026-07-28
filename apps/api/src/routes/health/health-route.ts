import { createApiSuccessResponse, type ApiRequest, type ApiSuccessResponse } from "../../http/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";
import type { ApiHealthDependencyDto, ApiHealthDto } from "./health-schema.js";

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
  readonly releaseSha?: string;
  readonly environment?: string;
  readonly dependencies?: readonly ApiHealthDependencyDto[];
  readonly clock: () => string;
}

export function handleApiHealthRequest(
  request: ApiRequest,
  input: ApiHealthRouteInput
): ApiSuccessResponse<ApiHealthDto> {
  const checkedAt = input.clock();
  const dependencies = input.dependencies ?? [];

  return createApiSuccessResponse(
    {
      status: dependencies.some((dependency) => dependency.status !== "ok") ? "degraded" : "ok",
      serviceName: input.serviceName,
      version: input.version,
      releaseSha: input.releaseSha ?? "local",
      environment: input.environment ?? "local",
      checkedAt,
      dependencies
    },
    {
      correlationId: request.context.correlationId,
      requestId: request.context.requestId
    }
  );
}
