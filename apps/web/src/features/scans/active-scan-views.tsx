"use client";

import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { EmptyState, ErrorState, LoadingState } from "../../components/states";
import { Panel } from "../../components/ui";
import { EvidenceView } from "../evidence/evidence-view";
import { OpportunityDetail } from "../opportunities/opportunity-detail";
import { OpportunityList } from "../opportunities/opportunity-list";
import { PaginationControls } from "../pagination/pagination-controls";
import { RankingView } from "../rankings/ranking-view";
import { useActiveScan } from "./active-scan-context";
import { mapScanEvidence, mapScanOpportunities, mapScanRanking } from "./scan-view-model";

function NoActiveScan() {
  return (
    <EmptyState
      title="No persisted scan available"
      message="Run a scan from Overview, then return here to review its opportunities, ranking, evidence, and provenance."
    />
  );
}

function ActiveScanState({ children }: Readonly<{ children: (scan: NonNullable<ReturnType<typeof useActiveScan>["scan"]>) => ReactNode }>) {
  const { scan, status } = useActiveScan();
  if (status === "loading") return <LoadingState title="Loading scan" message="Restoring your latest persisted scan." />;
  if (status === "error") return <ErrorState title="Scan unavailable" message="The latest scan could not be restored. Check the API session, then run a new scan." />;
  if (!scan) return <NoActiveScan />;
  return children(scan);
}

export function ActiveOpportunityList() {
  return (
    <ActiveScanState>
      {(scan) => (
        <Panel title={`Opportunity List · ${scan.source.attribution}`}>
          <OpportunityList opportunities={mapScanOpportunities(scan)} />
          <PaginationControls currentPage={1} totalPages={1} />
        </Panel>
      )}
    </ActiveScanState>
  );
}

export function ActiveTopOpportunityList() {
  return (
    <ActiveScanState>
      {(scan) => (
        <Panel title={`Opportunity List · ${scan.source.attribution}`} className="table-panel">
          <OpportunityList opportunities={mapScanOpportunities(scan)} />
        </Panel>
      )}
    </ActiveScanState>
  );
}

export function ActiveOpportunityDetail() {
  const params = useParams<{ opportunityId: string }>();
  return (
    <ActiveScanState>
      {(scan) => {
        const opportunity = mapScanOpportunities(scan).find((item) => item.opportunityId === params.opportunityId);
        if (!opportunity) {
          return <EmptyState title="Opportunity not found in active scan" message="Choose an opportunity from the active scan list." />;
        }
        const evidenceIds = new Set(opportunity.evidenceIds);
        const evidence = mapScanEvidence(scan).filter((item) => evidenceIds.has(item.evidenceId));
        return <OpportunityDetail opportunity={opportunity} evidence={evidence} />;
      }}
    </ActiveScanState>
  );
}

export function ActiveRankingView() {
  return (
    <ActiveScanState>
      {(scan) => <RankingView ranking={mapScanRanking(scan)} opportunities={mapScanOpportunities(scan)} />}
    </ActiveScanState>
  );
}

export function ActiveEvidenceView() {
  return (
    <ActiveScanState>
      {(scan) => <EvidenceView evidence={mapScanEvidence(scan)} />}
    </ActiveScanState>
  );
}
