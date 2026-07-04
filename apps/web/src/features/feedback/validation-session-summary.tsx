import { Panel } from "../../components/ui";
import type { DashboardFeedbackFixture, DashboardOpportunityFixture } from "../../testing";

export interface ValidationSessionSummaryProps {
  readonly opportunities: readonly DashboardOpportunityFixture[];
  readonly feedback: readonly DashboardFeedbackFixture[];
}

export function ValidationSessionSummary({ opportunities, feedback }: ValidationSessionSummaryProps) {
  const savedCount = feedback.filter((item) => item.status === "saved").length;
  const ratedCount = feedback.filter((item) => item.ratings.length > 0).length;
  const pendingCount = Math.max(opportunities.length - feedback.length, 0);

  return (
    <Panel title="Validation Session">
      <div className="validation-session">
        <p className="muted-copy">
          Synthetic demo state for design-partner review. Feedback stays local and deterministic.
        </p>
        <dl className="validation-session-grid">
          <div>
            <dt>Opportunities</dt>
            <dd>{opportunities.length}</dd>
          </div>
          <div>
            <dt>Saved</dt>
            <dd>{savedCount}</dd>
          </div>
          <div>
            <dt>Rated</dt>
            <dd>{ratedCount}</dd>
          </div>
          <div>
            <dt>Pending</dt>
            <dd>{pendingCount}</dd>
          </div>
        </dl>
      </div>
    </Panel>
  );
}
