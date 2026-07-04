import { Badge, Panel } from "../../components/ui";
import { formatConfidence } from "../opportunities/opportunity-utils";
import type { DashboardEvidenceFixture } from "../../testing";

export interface EvidenceViewProps {
  readonly evidence: readonly DashboardEvidenceFixture[];
}

export function EvidenceView({ evidence }: EvidenceViewProps) {
  return (
    <Panel title="Evidence View">
      <div className="evidence-list">
        {evidence.map((item) => (
          <article key={item.evidenceId} className="evidence-item">
            <div className="evidence-heading">
              <Badge>{item.sourceType}</Badge>
              <span>{formatConfidence(item.confidence)}</span>
            </div>
            <p>{item.summary}</p>
            <dl className="provenance-list">
              <div>
                <dt>Source</dt>
                <dd>{item.provenance.sourceName}</dd>
              </div>
              <div>
                <dt>Collected</dt>
                <dd>{item.provenance.collectedAt}</dd>
              </div>
              <div>
                <dt>Prepared</dt>
                <dd>{item.provenance.transformedAt}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </Panel>
  );
}
