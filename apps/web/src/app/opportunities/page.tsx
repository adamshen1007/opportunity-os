import { AppShell } from "../../components/layout";
import { DashboardToolbar } from "../../features/dashboard/dashboard-toolbar";
import { ActiveOpportunityList } from "../../features/scans";

export const dynamic = "force-dynamic";

export default function OpportunityListPage() {
  return (
    <AppShell
      title="Opportunities"
      subtitle="Choose a ranked candidate, then inspect the evidence and explanation before saving or dismissing it."
    >
      <DashboardToolbar />
      <ActiveOpportunityList />
    </AppShell>
  );
}
