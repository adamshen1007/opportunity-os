import { notFound } from "next/navigation";
import { loadDashboardLocalData } from "../../../api/local-data";
import { AppShell } from "../../../components/layout";
import { OpportunityDetail } from "../../../features/opportunities/opportunity-detail";
import { getEvidenceForOpportunity } from "../../../features/opportunities/opportunity-utils";
import { dashboardFeedbackFixtures } from "../../../testing";

export interface OpportunityDetailPageProps {
  readonly params: Promise<{
    readonly opportunityId: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const { opportunityId } = await params;
  const dashboardData = await loadDashboardLocalData();
  const opportunity = dashboardData.opportunities.find((item) => item.opportunityId === opportunityId);

  if (!opportunity) {
    notFound();
  }

  return (
    <AppShell
      title="Opportunity detail"
      subtitle="Decide whether this evidence-backed opportunity is worth saving for validation."
    >
      <OpportunityDetail
        opportunity={opportunity}
        evidence={getEvidenceForOpportunity(opportunity)}
        feedback={dashboardFeedbackFixtures.find((item) => item.opportunityId === opportunity.opportunityId)}
      />
    </AppShell>
  );
}
