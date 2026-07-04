import { AppShell } from "../components/layout";
import { EmptyState, ErrorState, LoadingState } from "../components/states";
import { safeDashboardErrorMessage } from "../components/states/state-copy";
import { Panel } from "../components/ui";
import { DashboardToolbar } from "../features/dashboard/dashboard-toolbar";
import { EvidenceView } from "../features/evidence/evidence-view";
import { OpportunityList } from "../features/opportunities/opportunity-list";
import { RankingView } from "../features/rankings/ranking-view";
import { dashboardEvidenceFixtures, dashboardOpportunityFixtures, dashboardRankingFixtures } from "../testing";

export default function DashboardHomePage() {
  const currentRanking = dashboardRankingFixtures[0];

  return (
    <AppShell
      title="Opportunity dashboard"
      subtitle="Scan ranked opportunities, inspect evidence, and follow provenance from one operational surface."
    >
      <DashboardToolbar />
      <section className="dashboard-grid" aria-label="Dashboard summary">
        <Panel title="Opportunity List">
          <OpportunityList opportunities={dashboardOpportunityFixtures} />
        </Panel>
        {currentRanking ? (
          <RankingView ranking={currentRanking} opportunities={dashboardOpportunityFixtures} />
        ) : (
          <EmptyState title="No ranking available" message="Run ranking from the API before reviewing ranked output." />
        )}
        <EvidenceView evidence={dashboardEvidenceFixtures} />
        <Panel title="State Components">
          <div className="state-stack">
            <LoadingState title="Loading opportunities" message="The dashboard is preparing this view." />
            <EmptyState title="No matching opportunities" message="Clear filters or broaden the search terms." />
            <ErrorState title="Unable to load view" message={safeDashboardErrorMessage} />
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
