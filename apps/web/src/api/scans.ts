import { generatedApiRoutes } from "./generated/routes";
import type { DashboardApiResult } from "./client";
import type { DashboardApiRequester } from "./opportunities";
import type { DashboardApiRedditScanRequestBody, DashboardApiScanJobDto, DashboardApiScanRequestBody, DashboardApiScanResultDto } from "./types";

export interface DashboardApiScanHistoryDto {
  readonly scans: readonly DashboardApiScanResultDto[];
}

export function createScan(
  client: DashboardApiRequester,
  body: DashboardApiScanRequestBody
): Promise<DashboardApiResult<DashboardApiScanResultDto>> {
  return client.request<DashboardApiScanResultDto, DashboardApiScanRequestBody>({
    method: generatedApiRoutes.createScan.method,
    path: generatedApiRoutes.createScan.path,
    body
  });
}

export function createScanJob(client: DashboardApiRequester, body: DashboardApiScanRequestBody): Promise<DashboardApiResult<DashboardApiScanJobDto>> {
  return client.request<DashboardApiScanJobDto, DashboardApiScanRequestBody>({ method: "POST", path: "/scan-jobs", body });
}

export function getScanJob(client: DashboardApiRequester, jobId: string): Promise<DashboardApiResult<DashboardApiScanJobDto>> {
  return client.request<DashboardApiScanJobDto>({ method: "GET", path: `/scan-jobs/${encodeURIComponent(jobId)}` });
}

export function cancelScanJob(client: DashboardApiRequester, jobId: string): Promise<DashboardApiResult<DashboardApiScanJobDto>> {
  return client.request<DashboardApiScanJobDto>({ method: "POST", path: `/scan-jobs/${encodeURIComponent(jobId)}/cancel` });
}

export function createRedditScan(
  client: DashboardApiRequester,
  body: DashboardApiRedditScanRequestBody
): Promise<DashboardApiResult<DashboardApiScanResultDto>> {
  return client.request<DashboardApiScanResultDto, DashboardApiRedditScanRequestBody>({
    method: generatedApiRoutes.createRedditScan.method,
    path: generatedApiRoutes.createRedditScan.path,
    body
  });
}

export function getScan(
  client: DashboardApiRequester,
  scanId: string
): Promise<DashboardApiResult<DashboardApiScanResultDto>> {
  return client.request<DashboardApiScanResultDto>({
    method: generatedApiRoutes.getScan.method,
    path: generatedApiRoutes.getScan.path.replace(":scanId", encodeURIComponent(scanId))
  });
}

export function listScans(
  client: DashboardApiRequester,
  limit = 5
): Promise<DashboardApiResult<DashboardApiScanHistoryDto>> {
  return client.request<DashboardApiScanHistoryDto>({
    method: "GET",
    path: "/scans",
    query: { limit }
  });
}

export function deleteScan(client: DashboardApiRequester, scanId: string): Promise<DashboardApiResult<{ readonly deleted: true }>> {
  return client.request<{ readonly deleted: true }>({ method: "DELETE", path: `/scans/${encodeURIComponent(scanId)}` });
}
