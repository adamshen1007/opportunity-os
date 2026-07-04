import { Badge, Panel } from "../../components/ui";
import type { DashboardEvidenceFixture, DashboardOpportunityFixture } from "../../testing";
import { EvidenceView } from "../evidence/evidence-view";
import { formatConfidence } from "./opportunity-utils";

export interface OpportunityDetailProps {
  readonly opportunity: DashboardOpportunityFixture;
  readonly evidence: readonly DashboardEvidenceFixture[];
}

export function OpportunityDetail({ opportunity, evidence }: OpportunityDetailProps) {
  return (
    <div className="detail-layout">
      <Panel title="Opportunity Detail">
        <div className="detail-header">
          <Badge tone={opportunity.status === "ranked" ? "success" : "neutral"}>{opportunity.status}</Badge>
          <h3>{opportunity.title}</h3>
          <p>{opportunity.summary}</p>
        </div>
        <dl className="metadata-grid">
          <div>
            <dt>Rank</dt>
            <dd>#{opportunity.rank.position}</dd>
          </div>
          <div>
            <dt>Score</dt>
            <dd>{opportunity.rank.score}</dd>
          </div>
          <div>
            <dt>Confidence</dt>
            <dd>{formatConfidence(opportunity.confidence)}</dd>
          </div>
          <div>
            <dt>Generated</dt>
            <dd>{opportunity.provenance.generatedAt}</dd>
          </div>
        </dl>
        <div className="explanation-panel">
          <strong>Explanation</strong>
          <p>{opportunity.explanation.summary}</p>
          <ul>
            {opportunity.explanation.factors.map((factor) => (
              <li key={factor}>{factor}</li>
            ))}
          </ul>
        </div>
      </Panel>
      <EvidenceView evidence={evidence} />
    </div>
  );
}
