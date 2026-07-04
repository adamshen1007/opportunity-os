import { dashboardRoutes } from "./routes";

export interface DashboardNavItem {
  readonly label: string;
  readonly href: string;
  readonly description: string;
}

export const dashboardNavItems = dashboardRoutes.map(({ label, href, description }) => ({
  label,
  href,
  description
})) satisfies readonly DashboardNavItem[];
