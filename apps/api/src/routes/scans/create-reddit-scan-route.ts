import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import {
  runOpportunityScanPipeline,
  validateRedditScanRequestBody,
  type ApiRedditScanRequestBody,
  type ApiScanResultDto
} from "../../pipeline/index.js";
import { createNoopScanPersistenceStore, type ApiScanPersistenceStore } from "../../persistence/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";
import { requireOwnershipScope } from "../../ownership/index.js";

export const API_CREATE_REDDIT_SCAN_ROUTE = createApiRouteDefinition({
  method: API_HTTP_METHODS.post,
  path: "/scans/reddit",
  operationId: "createRedditScan",
  summary: "Run Reddit scan through the MVP opportunity pipeline",
  tags: ["scans"],
  requiresAuthentication: true
});

export async function handleCreateRedditScanRequest(
  request: ApiRequest<ApiRedditScanRequestBody>,
  persistence: ApiScanPersistenceStore = createNoopScanPersistenceStore()
): Promise<ApiResponse<ApiScanResultDto, ReturnType<typeof createApiError>>> {
  const meta = {
    correlationId: request.context.correlationId,
    requestId: request.context.requestId
  };
  const parsed = validateRedditScanRequestBody(request.body);

  if (!parsed.valid) {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.validationFailed,
        statusCode: 400,
        message: "Reddit scan request is invalid.",
        correlationId: meta.correlationId,
        requestId: meta.requestId,
        details: parsed.issues
      }),
      meta
    );
  }

  try {
    const result = await runOpportunityScanPipeline({
      ...parsed.value,
      correlationId: meta.correlationId,
      requestId: meta.requestId,
      requestedAt: "2026-07-07T00:00:00.000Z"
    });
    await persistence.persistScanResult({
      result,
      persistedAt: "2026-07-07T00:00:00.000Z",
      ownerPrincipalId: (() => {
        const ownership = requireOwnershipScope(request.context);
        if (ownership.mode !== "owner") throw new Error("Administrator override cannot create user records.");
        return ownership.principalId;
      })()
    });

    return createApiSuccessResponse(result, meta);
  } catch {
    return createApiFailureResponse(
      createApiError({
        code: API_ERROR_CODES.internal,
        statusCode: 500,
        message: "Reddit scan failed before safe output was produced.",
        correlationId: meta.correlationId,
        requestId: meta.requestId
      }),
      meta
    );
  }
}
