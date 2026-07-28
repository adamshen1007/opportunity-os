import { createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import type { ApiScanResultDto } from "../../pipeline/index.js";
import type { ApiScanPersistenceStore } from "../../persistence/index.js";
import { requireOwnershipScope } from "../../ownership/index.js";

export interface ApiScanHistoryDto {
  readonly scans: readonly ApiScanResultDto[];
}

export async function handleListScansRequest(
  request: ApiRequest<unknown, { limit?: string }>,
  persistence: ApiScanPersistenceStore
): Promise<ApiResponse<ApiScanHistoryDto, never>> {
  const parsed = Number(request.query?.limit ?? 10);
  const limit = Number.isInteger(parsed) ? Math.max(1, Math.min(parsed, 25)) : 10;
  return createApiSuccessResponse(
    { scans: await persistence.listScanResults(requireOwnershipScope(request.context), limit) },
    { correlationId: request.context.correlationId, requestId: request.context.requestId }
  );
}
