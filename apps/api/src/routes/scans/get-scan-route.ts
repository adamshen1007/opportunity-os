import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import type { ApiScanResultDto } from "../../pipeline/index.js";
import type { ApiScanPersistenceStore } from "../../persistence/index.js";
import { requireOwnershipScope } from "../../ownership/index.js";

export async function handleGetScanRequest(
  request: ApiRequest<unknown, Record<string, string>, { scanId?: string }>,
  persistence: ApiScanPersistenceStore
): Promise<ApiResponse<ApiScanResultDto, ReturnType<typeof createApiError>>> {
  const meta = { correlationId: request.context.correlationId, requestId: request.context.requestId };
  const scanId = request.params?.scanId?.trim();
  const result = scanId ? await persistence.getScanResult(requireOwnershipScope(request.context), scanId) : undefined;
  if (!result) {
    return createApiFailureResponse(createApiError({
      code: API_ERROR_CODES.notFound,
      statusCode: 404,
      message: "Scan result was not found.",
      correlationId: meta.correlationId,
      requestId: meta.requestId
    }), meta);
  }
  return createApiSuccessResponse(result, meta);
}
