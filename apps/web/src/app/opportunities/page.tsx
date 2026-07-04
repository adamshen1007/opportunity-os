import { AppShell } from "../../components/layout";
import { Panel } from "../../components/ui";
import { DashboardToolbar } from "../../features/dashboard/dashboard-toolbar";
import { OpportunityList } from "../../features/opportunities/opportunity-list";
import { PaginationControls } from "../../features/pagination/pagination-controls";
import { dashboardOpportunityFixtures } from "../../testing";

export default function OpportunityListPage() {
  return (
    <AppShell
      title="Opportunities"
      subtitle="Review synthetic opportunities with ranking metadata, confidence, and evidence readiness."
    >
      <DashboardToolbar />
      <Panel title="Opportunity List">
        <OpportunityList opportunities={dashboardOpportunityFixtures} />
        <PaginationControls currentPage={1} totalPages={1} />
      </Panel>
    </AppShell>
  );
}
