export const DASHBOARD_ROUTE_IDS = {
  home: "home",
  opportunities: "opportunities",
  opportunityDetail: "opportunity-detail",
  rankings: "rankings",
  evidence: "evidence"
} as const;

export type DashboardRouteId = (typeof DASHBOARD_ROUTE_IDS)[keyof typeof DASHBOARD_ROUTE_IDS];

export interface DashboardRoute {
  readonly id: DashboardRouteId;
  readonly label: string;
  readonly href: string;
  readonly description: string;
}

export const dashboardRoutes = [
  {
    id: DASHBOARD_ROUTE_IDS.home,
    label: "Overview",
    href: "/",
    description: "Dashboard summary and current opportunity signals."
  },
  {
    id: DASHBOARD_ROUTE_IDS.opportunities,
    label: "Opportunities",
    href: "/opportunities",
    description: "Browse validated opportunity candidates."
  },
  {
    id: DASHBOARD_ROUTE_IDS.opportunityDetail,
    label: "Detail",
    href: "/opportunities",
    description: "Inspect evidence and confidence for one opportunity."
  },
  {
    id: DASHBOARD_ROUTE_IDS.rankings,
    label: "Rankings",
    href: "/rankings",
    description: "Review deterministic ranking outputs."
  },
  {
    id: DASHBOARD_ROUTE_IDS.evidence,
    label: "Evidence",
    href: "/evidence",
    description: "Trace supporting evidence and provenance."
  }
] as const satisfies readonly DashboardRoute[];
