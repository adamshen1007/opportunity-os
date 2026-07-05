import { AppShell } from "../../components/layout";
import { Panel } from "../../components/ui";
import { loadDashboardLocalData } from "../../api/local-data";
import { DashboardToolbar } from "../../features/dashboard/dashboard-toolbar";
import { OpportunityList } from "../../features/opportunities/opportunity-list";
import { PaginationControls } from "../../features/pagination/pagination-controls";

export const dynamic = "force-dynamic";

export default async function OpportunityListPage() {
  const dashboardData = await loadDashboardLocalData();

  return (
    <AppShell
      title="Opportunities"
      subtitle="Review synthetic opportunities with ranking metadata, confidence, and evidence readiness."
    >
      <DashboardToolbar />
      <Panel title="Opportunity List">
        <OpportunityList opportunities={dashboardData.opportunities} />
        <PaginationControls currentPage={1} totalPages={1} />
      </Panel>
    </AppShell>
  );
}
