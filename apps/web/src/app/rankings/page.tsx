import { AppShell } from "../../components/layout";
import { EmptyState } from "../../components/states";
import { RankingView } from "../../features/rankings/ranking-view";
import { dashboardOpportunityFixtures, dashboardRankingFixtures } from "../../testing";

export default function RankingPage() {
  const ranking = dashboardRankingFixtures[0];

  return (
    <AppShell title="Ranking View" subtitle="Review explainable ranking output from deterministic opportunity signals.">
      {ranking ? (
        <RankingView ranking={ranking} opportunities={dashboardOpportunityFixtures} />
      ) : (
        <EmptyState title="No ranking available" message="Run ranking from the API before reviewing ranked output." />
      )}
    </AppShell>
  );
}
