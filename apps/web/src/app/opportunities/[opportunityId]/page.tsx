import { notFound } from "next/navigation";
import { AppShell } from "../../../components/layout";
import { OpportunityDetail } from "../../../features/opportunities/opportunity-detail";
import { getEvidenceForOpportunity, getOpportunityById } from "../../../features/opportunities/opportunity-utils";

export interface OpportunityDetailPageProps {
  readonly params: Promise<{
    readonly opportunityId: string;
  }>;
}

export default async function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const { opportunityId } = await params;
  const opportunity = getOpportunityById(opportunityId);

  if (!opportunity) {
    notFound();
  }

  return (
    <AppShell title="Opportunity detail" subtitle="Inspect confidence, ranking explanation, provenance, and evidence.">
      <OpportunityDetail opportunity={opportunity} evidence={getEvidenceForOpportunity(opportunity)} />
    </AppShell>
  );
}
