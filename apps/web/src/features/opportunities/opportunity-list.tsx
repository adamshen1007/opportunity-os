import { FileText } from "lucide-react";
import { Badge, Table } from "../../components/ui";
import type { DashboardOpportunityFixture } from "../../testing";
import { formatConfidence } from "./opportunity-utils";

export interface OpportunityListProps {
  readonly opportunities: readonly DashboardOpportunityFixture[];
}

export function OpportunityList({ opportunities }: OpportunityListProps) {
  return (
    <Table
      rows={opportunities}
      getRowKey={(row) => row.opportunityId}
      columns={[
        {
          key: "rank-position",
          header: "#",
          render: (row) => row.rank.position
        },
        {
          key: "title",
          header: "Opportunity",
          render: (row) => (
            <div className="table-title">
              <a href={`/opportunities/${row.opportunityId}`}>{row.title}</a>
              <span>{row.summary}</span>
            </div>
          )
        },
        {
          key: "confidence",
          header: "Confidence",
          render: (row) => (
            <div className="confidence-cell">
              <strong>{formatConfidence(row.confidence)}</strong>
              <progress max="1" value={row.confidence} aria-label={`${row.title} confidence`} />
            </div>
          )
        },
        {
          key: "evidence",
          header: "Key evidence",
          render: (row) => (
            <div className="evidence-preview">
              <FileText aria-hidden="true" size={17} />
              <span>{row.explanation.summary}</span>
            </div>
          )
        },
        {
          key: "provenance",
          header: "Provenance",
          render: (row) => <div className="provenance-preview"><strong>{row.provenance.sourceName}</strong><span>{row.evidenceIds.length} evidence records</span></div>
        },
        {
          key: "status",
          header: "Status",
          render: (row) => <Badge tone={row.status === "ranked" ? "success" : "neutral"}>{row.status}</Badge>
        }
      ]}
    />
  );
}
