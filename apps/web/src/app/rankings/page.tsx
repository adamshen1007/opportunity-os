import { AppShell } from "../../components/layout";
import { ActiveRankingView } from "../../features/scans";

export const dynamic = "force-dynamic";

export default function RankingPage() {
  return (
    <AppShell title="Ranking View" subtitle="Review the explainable ranking output from your latest persisted scan.">
      <ActiveRankingView />
    </AppShell>
  );
}
