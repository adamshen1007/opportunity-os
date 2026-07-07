import { generatedApiRoutes } from "./generated/routes";
import type { DashboardApiResult } from "./client";
import type { DashboardApiRequester } from "./opportunities";
import type { DashboardApiRedditScanRequestBody, DashboardApiScanResultDto } from "./types";

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
