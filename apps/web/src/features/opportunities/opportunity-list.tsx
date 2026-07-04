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
          key: "status",
          header: "Status",
          render: (row) => <Badge tone={row.status === "ranked" ? "success" : "neutral"}>{row.status}</Badge>
        },
        {
          key: "confidence",
          header: "Confidence",
          render: (row) => formatConfidence(row.confidence)
        },
        {
          key: "rank",
          header: "Rank",
          render: (row) => `#${row.rank.position} / ${row.rank.score}`
        }
      ]}
    />
  );
}
