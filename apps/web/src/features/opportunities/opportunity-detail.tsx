import { Badge, Panel } from "../../components/ui";
import { OpportunityFeedbackPanel } from "../feedback";
import type { DashboardApiCreateFeedbackRequestBody, DashboardApiFeedbackDto, DashboardApiResult } from "../../api";
import type { DashboardEvidenceFixture, DashboardFeedbackFixture, DashboardOpportunityFixture } from "../../testing";
import { EvidenceView } from "../evidence/evidence-view";
import { formatConfidence, formatDisplayDateTime } from "./opportunity-utils";

export interface OpportunityDetailProps {
  readonly opportunity: DashboardOpportunityFixture;
  readonly evidence: readonly DashboardEvidenceFixture[];
  readonly feedback?: DashboardFeedbackFixture;
  readonly submitFeedback?: (body: DashboardApiCreateFeedbackRequestBody) => Promise<DashboardApiResult<DashboardApiFeedbackDto>>;
}

export function OpportunityDetail({ opportunity, evidence, feedback, submitFeedback }: OpportunityDetailProps) {
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
            <dd>{formatDisplayDateTime(opportunity.provenance.generatedAt)}</dd>
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
        <div className="trust-note" role="note" aria-label="Opportunity trust boundary">
          <Badge tone="success">Explainable MVP</Badge>
          <p>
            Treat this as a prioritization aid. Confirm demand, source quality, and feasibility before acting on the
            recommendation.
          </p>
        </div>
      </Panel>
      <OpportunityFeedbackPanel
        opportunityId={opportunity.opportunityId}
        initialFeedback={feedback}
        submitFeedback={submitFeedback}
      />
      <EvidenceView evidence={evidence} />
    </div>
  );
}
