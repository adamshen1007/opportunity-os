import { generatedApiRoutes } from "./generated/routes";
import type { DashboardApiResult } from "./client";
import type { DashboardApiRequester } from "./opportunities";
import type { DashboardApiRedditScanRequestBody, DashboardApiScanRequestBody, DashboardApiScanResultDto } from "./types";

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
