import { AppShell } from "../components/layout";
import { EmptyState, ErrorState, LoadingState } from "../components/states";
import { safeDashboardErrorMessage } from "../components/states/state-copy";
import { Panel } from "../components/ui";
import { BetaAccessPanel, BugReportPanel } from "../features/beta";
import { DashboardToolbar } from "../features/dashboard/dashboard-toolbar";
import { MvpTrialGuide } from "../features/dashboard/mvp-trial-guide";
import { EvidenceView } from "../features/evidence/evidence-view";
import { ValidationSessionSummary } from "../features/feedback";
import { OpportunityList } from "../features/opportunities/opportunity-list";
import { RankingView } from "../features/rankings/ranking-view";
import { RedditScanWorkbench } from "../features/scans";
import { loadDashboardLocalData } from "../api";
import {
  dashboardEvidenceFixtures,
  dashboardBetaInviteWorkflowFixture,
  dashboardBetaSessionFixture,
  dashboardFeedbackFixtures,
  dashboardOpportunityFixtures,
  dashboardRankingFixtures
} from "../testing";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  const dashboardData = await loadDashboardLocalData();
  const currentRanking = dashboardRankingFixtures[0];
  const opportunities = dashboardData.opportunities;

  return (
    <AppShell
      title="Opportunity dashboard"
      subtitle="Review evidence-backed opportunities, understand why they are ranked, and capture validation feedback."
    >
      <DashboardToolbar />
      <RedditScanWorkbench />
      <section className="dashboard-grid" aria-label="Dashboard summary">
        <MvpTrialGuide />
        <BetaAccessPanel session={dashboardBetaSessionFixture} invite={dashboardBetaInviteWorkflowFixture} />
        <ValidationSessionSummary opportunities={opportunities} feedback={dashboardFeedbackFixtures} />
        <Panel title="Opportunity List">
          <OpportunityList opportunities={opportunities} />
        </Panel>
        {currentRanking ? (
          <RankingView ranking={currentRanking} opportunities={opportunities} />
        ) : (
          <EmptyState title="No ranking available" message="Run ranking from the API before reviewing ranked output." />
        )}
        <BugReportPanel sessionId={dashboardBetaSessionFixture.sessionId} />
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
