import { Badge, Panel } from "../../components/ui";

export function MvpTrialGuide() {
  return (
    <Panel title="MVP Trial Guide">
      <div className="mvp-trial-guide">
        <p className="muted-copy">
          Opportunity OS turns evidence into ranked opportunity candidates so operators can decide what is worth
          validating next.
        </p>
        <ol>
          <li>Scan the ranked opportunity list.</li>
          <li>Open one opportunity and inspect the explanation, confidence, provenance, and evidence.</li>
          <li>Save or dismiss it, then rate usefulness, evidence quality, and ranking quality.</li>
        </ol>
        <div className="trust-note" role="note" aria-label="MVP trust boundary">
          <Badge tone="success">Local demo</Badge>
          <p>
            This trial uses deterministic demo data unless you intentionally run the gated live Reddit provider command.
            Recommendations are explainable signals, not market guarantees.
          </p>
        </div>
      </div>
    </Panel>
  );
}
