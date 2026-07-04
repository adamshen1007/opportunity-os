import { API_GET_OPPORTUNITY_ROUTE, API_GET_RANKING_ROUTE, API_LIST_OPPORTUNITIES_ROUTE, API_RANK_OPPORTUNITIES_ROUTE } from "@opportunity-os/api";

export const dashboardOpenApiClientConfig = {
  source: "@opportunity-os/api",
  output: "apps/web/src/api/generated",
  routes: [
    API_LIST_OPPORTUNITIES_ROUTE.operationId,
    API_GET_OPPORTUNITY_ROUTE.operationId,
    API_RANK_OPPORTUNITIES_ROUTE.operationId,
    API_GET_RANKING_ROUTE.operationId
  ]
} as const;
