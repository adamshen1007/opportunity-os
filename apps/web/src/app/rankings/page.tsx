import { AppShell } from "../../components/layout";
import { loadDashboardLocalData } from "../../api/local-data";
import { EmptyState } from "../../components/states";
import { RankingView } from "../../features/rankings/ranking-view";
import { dashboardRankingFixtures } from "../../testing";

export const dynamic = "force-dynamic";

export default async function RankingPage() {
  const dashboardData = await loadDashboardLocalData();
  const ranking = dashboardRankingFixtures[0];

  return (
    <AppShell title="Ranking View" subtitle="Review explainable ranking output from deterministic opportunity signals.">
      {ranking ? (
        <RankingView ranking={ranking} opportunities={dashboardData.opportunities} />
      ) : (
        <EmptyState title="No ranking available" message="Run ranking from the API before reviewing ranked output." />
      )}
    </AppShell>
  );
}
