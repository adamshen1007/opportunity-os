import type { DashboardApiScanResultDto } from "../../api";
import type { DashboardOpportunityFixture } from "../../testing";

export function getScanOpportunityAnchorId(opportunityId: string): string {
  return `scan-opportunity-${encodeURIComponent(opportunityId)}`;
}

export function mapScanResultToDashboardOpportunities(
  result: DashboardApiScanResultDto
): readonly DashboardOpportunityFixture[] {
  return result.opportunities.map((opportunity) => ({
    opportunityId: opportunity.opportunityId,
    detailHref: `#${getScanOpportunityAnchorId(opportunity.opportunityId)}`,
    title: opportunity.title,
    summary: opportunity.summary,
    status: "ranked",
    confidence: opportunity.confidence,
    rank: {
      position: opportunity.rank.position,
      score: opportunity.rank.score
    },
    explanation: {
      summary: opportunity.rank.explanation,
      factors: opportunity.evidence.map((evidence) => evidence.summary)
    },
    provenance: {
      sourceName: `${result.source.attribution} ${result.mode} scan`,
      generatedAt: result.scanId
    },
    evidenceIds: opportunity.evidence.map((evidence) => evidence.evidenceId)
  }));
}
