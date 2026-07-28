import { API_ERROR_CODES, createApiError } from "../../errors/index.js";
import { createApiFailureResponse, createApiSuccessResponse, type ApiRequest, type ApiResponse } from "../../http/index.js";
import { validateScanRequestBody, type ApiScanRequestBody } from "../../pipeline/index.js";
import { API_HTTP_METHODS, createApiRouteDefinition } from "../../routing/index.js";
import type { ApiScanJobDto, ApiScanJobService } from "../../runtime/index.js";
import { requireOwnershipScope } from "../../ownership/index.js";

export const API_CREATE_SCAN_JOB_ROUTE = createApiRouteDefinition({ method: API_HTTP_METHODS.post, path: "/scan-jobs", operationId: "createScanJob", summary: "Queue a durable opportunity scan", tags: ["scans"], requiresAuthentication: true });
export const API_GET_SCAN_JOB_ROUTE = createApiRouteDefinition({ method: API_HTTP_METHODS.get, path: "/scan-jobs/:jobId", operationId: "getScanJob", summary: "Read durable opportunity scan status", tags: ["scans"], requiresAuthentication: true });
export const API_CANCEL_SCAN_JOB_ROUTE = createApiRouteDefinition({ method: API_HTTP_METHODS.post, path: "/scan-jobs/:jobId/cancel", operationId: "cancelScanJob", summary: "Cancel a queued opportunity scan", tags: ["scans"], requiresAuthentication: true });
export const API_RETRY_SCAN_JOB_ROUTE = createApiRouteDefinition({ method: API_HTTP_METHODS.post, path: "/scan-jobs/:jobId/retry", operationId: "retryScanJob", summary: "Retry a failed or cancelled opportunity scan", tags: ["scans"], requiresAuthentication: true });

type ScanJobResponse = ApiResponse<ApiScanJobDto, ReturnType<typeof createApiError>>;

export async function handleCreateScanJobRequest(request: ApiRequest<ApiScanRequestBody>, service: ApiScanJobService): Promise<ScanJobResponse> {
  const meta = { correlationId: request.context.correlationId, requestId: request.context.requestId };
  const parsed = validateScanRequestBody(request.body);
  if (!parsed.valid) return createApiFailureResponse(createApiError({ code: API_ERROR_CODES.validationFailed, statusCode: 400, message: "Scan request is invalid.", correlationId: meta.correlationId, requestId: meta.requestId, details: parsed.issues }), meta);
  const ownership = requireOwnershipScope(request.context);
  if (ownership.mode !== "owner") throw new Error("Administrator override cannot create user records.");
  return createApiSuccessResponse(await service.enqueue({ request: parsed.value, ...meta, ownerPrincipalId: ownership.principalId }), meta);
}

export async function handleGetScanJobRequest(request: ApiRequest<unknown, Record<string, unknown>, { jobId?: string }>, service: ApiScanJobService): Promise<ScanJobResponse> {
  return resolveJobResponse(request, service.get(requireOwnershipScope(request.context), request.params?.jobId?.trim() ?? ""));
}

export async function handleCancelScanJobRequest(request: ApiRequest<unknown, Record<string, unknown>, { jobId?: string }>, service: ApiScanJobService): Promise<ScanJobResponse> {
  return resolveJobResponse(request, service.cancel(requireOwnershipScope(request.context), request.params?.jobId?.trim() ?? ""));
}

export async function handleRetryScanJobRequest(request: ApiRequest<unknown, Record<string, unknown>, { jobId?: string }>, service: ApiScanJobService): Promise<ScanJobResponse> {
  return resolveJobResponse(request, service.retry(requireOwnershipScope(request.context), request.params?.jobId?.trim() ?? "", request.context.correlationId, request.context.requestId));
}

async function resolveJobResponse(request: ApiRequest, pending: Promise<ApiScanJobDto | undefined>): Promise<ScanJobResponse> {
  const meta = { correlationId: request.context.correlationId, requestId: request.context.requestId };
  const job = await pending;
  if (job) return createApiSuccessResponse(job, meta);
  return createApiFailureResponse(createApiError({ code: API_ERROR_CODES.notFound, statusCode: 404, message: "Scan job was not found or is not eligible for this action.", correlationId: meta.correlationId, requestId: meta.requestId, details: ["scan-job:not-found-or-ineligible"] }), meta);
}
