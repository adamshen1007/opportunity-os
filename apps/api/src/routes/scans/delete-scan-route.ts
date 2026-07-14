import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import type { ApiScanPersistenceStore } from "../../persistence/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";

export const API_DELETE_SCAN_ROUTE = createApiRouteDefinition({ method: API_HTTP_METHODS.delete, path: "/scans/:scanId", operationId: "deleteScan", summary: "Delete a persisted scan and its generated records", tags: ["scans", "privacy"], requiresAuthentication: true });

export async function handleDeleteScanRequest(request: ApiRequest<unknown, Record<string, unknown>, { scanId?: string }>, persistence: ApiScanPersistenceStore): Promise<ApiResponse<{ readonly deleted: true }, ReturnType<typeof createApiError>>> {
  const meta = { correlationId: request.context.correlationId, requestId: request.context.requestId };
  const deleted = request.params?.scanId ? await persistence.deleteScanResult(request.params.scanId) : false;
  if (deleted) return createApiSuccessResponse({ deleted: true }, meta);
  return createApiFailureResponse(createApiError({ code: API_ERROR_CODES.notFound, statusCode: 404, message: "Scan was not found.", correlationId: meta.correlationId, requestId: meta.requestId, details: ["scan:not-found"] }), meta);
}
