import type { DashboardApiClientOptions, DashboardApiResult } from "./client";
import { createDashboardApiClient } from "./client";
import type { DashboardApiLogoutDto, DashboardApiSessionDto } from "./types";

export async function getCurrentSession(options: DashboardApiClientOptions): Promise<DashboardApiResult<DashboardApiSessionDto>> {
  return createDashboardApiClient(options).request<DashboardApiSessionDto>({ method: "GET", path: "/auth/session" });
}

export async function logoutCurrentSession(options: DashboardApiClientOptions): Promise<DashboardApiResult<DashboardApiLogoutDto>> {
  return createDashboardApiClient(options).request<DashboardApiLogoutDto>({ method: "POST", path: "/auth/logout" });
}
