import { generatedApiRoutes } from "./generated/routes";
import type { DashboardApiResult } from "./client";
import type { DashboardApiOpportunityCollectionDto, DashboardApiOpportunityDto } from "./types";

export interface OpportunityListQuery {
  readonly limit?: number;
  readonly cursor?: string;
  readonly direction?: "forward" | "backward";
  readonly status?: string;
  readonly sourceType?: string;
}

export interface DashboardApiRequester {
  request<TData, TBody = unknown>(options: {
    readonly method: "GET" | "POST";
    readonly path: string;
    readonly query?: Readonly<Record<string, string | number | boolean | undefined>>;
    readonly body?: TBody;
  }): Promise<DashboardApiResult<TData>>;
}

export function listOpportunities(
  client: DashboardApiRequester,
  query: OpportunityListQuery = {}
): Promise<DashboardApiResult<DashboardApiOpportunityCollectionDto>> {
  const requestQuery: Readonly<Record<string, string | number | boolean | undefined>> = {
    limit: query.limit,
    cursor: query.cursor,
    direction: query.direction,
    status: query.status,
    sourceType: query.sourceType
  };

  return client.request<DashboardApiOpportunityCollectionDto>({
    method: "GET",
    path: generatedApiRoutes.listOpportunities.path,
    query: requestQuery
  });
}

export function getOpportunity(
  client: DashboardApiRequester,
  opportunityId: string
): Promise<DashboardApiResult<DashboardApiOpportunityDto>> {
  return client.request<DashboardApiOpportunityDto>({
    method: "GET",
    path: generatedApiRoutes.getOpportunity.path.replace(":opportunityId", encodeURIComponent(opportunityId))
  });
}
