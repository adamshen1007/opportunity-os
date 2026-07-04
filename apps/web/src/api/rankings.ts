import type { DashboardApiRequester } from "./opportunities";
import { generatedApiRoutes } from "./generated/routes";
import type { DashboardApiResult } from "./client";
import type { DashboardApiRankingDto } from "./types";

export function rankOpportunities(
  client: DashboardApiRequester,
  opportunityIds: readonly string[]
): Promise<DashboardApiResult<DashboardApiRankingDto>> {
  return client.request<DashboardApiRankingDto, { readonly opportunityIds: readonly string[] }>({
    method: "POST",
    path: generatedApiRoutes.rankOpportunities.path,
    body: {
      opportunityIds
    }
  });
}

export function getRanking(
  client: DashboardApiRequester,
  rankingId: string
): Promise<DashboardApiResult<DashboardApiRankingDto>> {
  return client.request<DashboardApiRankingDto>({
    method: "GET",
    path: generatedApiRoutes.getRanking.path.replace(":rankingId", encodeURIComponent(rankingId))
  });
}
