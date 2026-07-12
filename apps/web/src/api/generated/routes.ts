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
  },
  createFeedback: {
    method: "POST",
    path: "/feedback",
    operationId: "createFeedback"
  },
  listFeedback: {
    method: "GET",
    path: "/feedback",
    operationId: "listFeedback"
  },
  getFeedback: {
    method: "GET",
    path: "/feedback/:feedbackId",
    operationId: "getFeedback"
  },
  createPrivateBetaBugReport: {
    method: "POST",
    path: "/feedback/bug-reports",
    operationId: "createPrivateBetaBugReport"
  },
  createRedditScan: {
    method: "POST",
    path: "/scans/reddit",
    operationId: "createRedditScan"
  },
  createScan: {
    method: "POST",
    path: "/scans",
    operationId: "createScan"
  }
} as const;

export type GeneratedApiOperationId = keyof typeof generatedApiRoutes;
