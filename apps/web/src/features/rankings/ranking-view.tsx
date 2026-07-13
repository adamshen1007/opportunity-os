import Link from "next/link";
import { Badge, Panel } from "../../components/ui";
import type { DashboardOpportunityFixture, DashboardRankingFixture } from "../../testing";
import { formatConfidence } from "../opportunities/opportunity-utils";

export interface RankingViewProps {
  readonly ranking: DashboardRankingFixture;
  readonly opportunities: readonly DashboardOpportunityFixture[];
}

export function RankingView({ ranking, opportunities }: RankingViewProps) {
  const opportunityById = new Map(opportunities.map((opportunity) => [opportunity.opportunityId, opportunity]));
  const rankedOpportunities = ranking.rankedOpportunityIds.flatMap((opportunityId) => {
    const opportunity = opportunityById.get(opportunityId);
    return opportunity ? [opportunity] : [];
  });

  return (
    <Panel title="Ranking View">
      <div className="ranking-summary">
        <div>
          <span>Ranking</span>
          <strong>{ranking.rankingId}</strong>
        </div>
        <div>
          <span>Generated</span>
          <strong>{ranking.generatedAt}</strong>
        </div>
      </div>
      <p className="muted-copy">{ranking.explanation}</p>
      <ol className="ranking-list">
        {rankedOpportunities.map((opportunity) => (
          <li key={opportunity.opportunityId}>
            <div>
              <Badge tone="success">{`#${opportunity.rank.position}`}</Badge>
              <Link href={`/opportunities/${opportunity.opportunityId}`}>{opportunity.title}</Link>
            </div>
            <span>
              Score {opportunity.rank.score} · Confidence {formatConfidence(opportunity.confidence)}
            </span>
            <p>{opportunity.explanation.summary}</p>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
