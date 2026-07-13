import { AppShell } from "../components/layout";
import { DashboardHomeContent } from "../features/dashboard/dashboard-home-content";
import { loadDashboardLocalData } from "../api";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  const dashboardData = await loadDashboardLocalData();
  return (
    <AppShell
      title="Opportunity dashboard"
      subtitle="Review evidence-backed opportunities, understand why they are ranked, and capture validation feedback."
    >
      <DashboardHomeContent initialOpportunities={dashboardData.opportunities} />
    </AppShell>
  );
}
