import { createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import type { ApiMetricsRegistry, ApiOperationsSnapshotDto } from "../../operations/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";

export const API_GET_OPERATIONS_ROUTE = createApiRouteDefinition({ method: API_HTTP_METHODS.get, path: "/operations", operationId: "getOperationsSummary", summary: "Read the safe API operations summary", tags: ["operations"], requiresAuthentication: true });

export function handleGetOperationsRequest(request: ApiRequest, metrics: ApiMetricsRegistry): ApiResponse<ApiOperationsSnapshotDto, never> {
  return createApiSuccessResponse(metrics.snapshot(), { correlationId: request.context.correlationId, requestId: request.context.requestId });
}
