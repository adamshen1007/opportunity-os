import { AppShell } from "../../../components/layout";
import { ActiveOpportunityDetail } from "../../../features/scans";

export interface OpportunityDetailPageProps {
  readonly params: Promise<{
    readonly opportunityId: string;
  }>;
}

export const dynamic = "force-dynamic";

export default function OpportunityDetailPage(_props: OpportunityDetailPageProps) {
  return (
    <AppShell
      title="Opportunity detail"
      subtitle="Decide whether this evidence-backed opportunity is worth saving for validation."
    >
      <ActiveOpportunityDetail />
    </AppShell>
  );
}
