export const generatedApiRoutes = {
  listOpportunities: {
    method: "GET",
    path: "/opportunities",
    operationId: "listOpportunities"
  },
  getOpportunity: {
    method: "GET",
    path: "/opportunities/:opportunityId",
    operationId: "getOpportunity"
  },
  rankOpportunities: {
    method: "POST",
    path: "/rankings",
    operationId: "rankOpportunities"
  },
  getRanking: {
    method: "GET",
    path: "/rankings/:rankingId",
    operationId: "getRanking"
  }
} as const;

export type GeneratedApiOperationId = keyof typeof generatedApiRoutes;
