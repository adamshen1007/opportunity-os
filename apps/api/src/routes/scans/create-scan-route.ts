import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import { runOpportunityScanPipeline, validateScanRequestBody, type ApiScanRequestBody, type ApiScanResultDto } from "../../pipeline/index.js";
import { createNoopScanPersistenceStore, type ApiScanPersistenceStore } from "../../persistence/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";

export const API_CREATE_SCAN_ROUTE = createApiRouteDefinition({
  method: API_HTTP_METHODS.post,
  path: "/scans",
  operationId: "createScan",
  summary: "Run a source-neutral scan through the opportunity pipeline",
  tags: ["scans"],
  requiresAuthentication: true
});

export async function handleCreateScanRequest(
  request: ApiRequest<ApiScanRequestBody>,
  persistence: ApiScanPersistenceStore = createNoopScanPersistenceStore()
): Promise<ApiResponse<ApiScanResultDto, ReturnType<typeof createApiError>>> {
  const meta = { correlationId: request.context.correlationId, requestId: request.context.requestId };
  const parsed = validateScanRequestBody(request.body);
  if (!parsed.valid) {
    return createApiFailureResponse(createApiError({
      code: API_ERROR_CODES.validationFailed,
      statusCode: 400,
      message: "Scan request is invalid.",
      correlationId: meta.correlationId,
      requestId: meta.requestId,
      details: parsed.issues
    }), meta);
  }
  try {
    const result = await runOpportunityScanPipeline({
      ...parsed.value,
      correlationId: meta.correlationId,
      requestId: meta.requestId,
      requestedAt: new Date().toISOString()
    });
    await persistence.persistScanResult({ result, persistedAt: new Date().toISOString() });
    return createApiSuccessResponse(result, meta);
  } catch {
    return createApiFailureResponse(createApiError({
      code: API_ERROR_CODES.internal,
      statusCode: 500,
      message: "Scan failed before safe output was produced.",
      correlationId: meta.correlationId,
      requestId: meta.requestId
    }), meta);
  }
}
