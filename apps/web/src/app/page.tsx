import { AppShell } from "../components/layout";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { InfoHint } from "../components/ui";
import { BetaAccessPanel, BugReportPanel } from "../features/beta";
import { ValidationSessionSummary } from "../features/feedback";
import { ActiveTopOpportunityList, RedditScanWorkbench } from "../features/scans";
import { loadDashboardLocalData } from "../api";
import {
  dashboardBetaInviteWorkflowFixture,
  dashboardBetaSessionFixture,
  dashboardFeedbackFixtures
} from "../testing";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  const dashboardData = await loadDashboardLocalData();
  const opportunities = dashboardData.opportunities;

  return (
    <AppShell
      title="Opportunity dashboard"
      subtitle="Review evidence-backed opportunities, understand why they are ranked, and capture validation feedback."
    >
      <div id="run-scan"><RedditScanWorkbench /></div>
      <section className="opportunity-section" aria-label="Top opportunities">
        <div className="section-heading">
          <div><h3>Top opportunities</h3><p>Ranked by Opportunity OS confidence score <InfoHint label="About confidence scores">Confidence combines evidence quality, recurrence, clarity, and ranking factors. Review source evidence before acting.</InfoHint></p></div>
          <Link href="/rankings">View full rankings <ChevronRight aria-hidden="true" size={16} /></Link>
        </div>
        <ActiveTopOpportunityList />
      </section>
      <details className="beta-tools" id="beta-tools">
        <summary>Beta session and support tools</summary>
        <div className="beta-tools-grid">
          <BetaAccessPanel session={dashboardBetaSessionFixture} invite={dashboardBetaInviteWorkflowFixture} />
          <ValidationSessionSummary opportunities={opportunities} feedback={dashboardFeedbackFixtures} />
          <BugReportPanel />
        </div>
      </details>
    </AppShell>
  );
}
