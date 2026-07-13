import type { DashboardApiScanOpportunityDto, DashboardApiScanResultDto } from "../../api";
import type {
  DashboardEvidenceFixture,
  DashboardOpportunityFixture,
  DashboardRankingFixture
} from "../../testing";

function sourceLabel(scan: DashboardApiScanResultDto): string {
  return `${scan.source.attribution} ${scan.mode === "live" ? "live" : "fixture"} scan`;
}

export function mapScanOpportunity(
  scan: DashboardApiScanResultDto,
  opportunity: DashboardApiScanOpportunityDto
): DashboardOpportunityFixture {
  return {
    opportunityId: opportunity.opportunityId,
    title: opportunity.title,
    summary: opportunity.summary,
    status: "ranked",
    confidence: opportunity.confidence,
    rank: opportunity.rank,
    explanation: {
      summary: opportunity.rank.explanation,
      factors: opportunity.evidence.map((evidence) => evidence.summary)
    },
    provenance: {
      sourceName: sourceLabel(scan),
      generatedAt: scan.scanId
    },
    evidenceIds: opportunity.evidence.map((evidence) => evidence.evidenceId)
  };
}

export function mapScanOpportunities(scan: DashboardApiScanResultDto): readonly DashboardOpportunityFixture[] {
  return scan.opportunities.map((opportunity) => mapScanOpportunity(scan, opportunity));
}

export function mapScanEvidence(scan: DashboardApiScanResultDto): readonly DashboardEvidenceFixture[] {
  return scan.opportunities.flatMap((opportunity) =>
    opportunity.evidence.map((evidence) => ({
      evidenceId: evidence.evidenceId,
      sourceType: evidence.sourceType,
      summary: evidence.summary,
      confidence: evidence.confidence,
      permalink: evidence.permalink,
      provenance: {
        sourceName: `${scan.source.attribution} · ${scan.source.community}`,
        collectedAt: `Source item ${evidence.provenance.sourceId}`,
        transformedAt: `Normalized as ${evidence.provenance.normalizedContentId}`
      }
    }))
  );
}

export function mapScanRanking(scan: DashboardApiScanResultDto): DashboardRankingFixture {
  return {
    rankingId: scan.opportunities[0]?.provenance.rankingRunId ?? `ranking-${scan.scanId}`,
    generatedAt: scan.scanId,
    rankedOpportunityIds: [...scan.opportunities]
      .sort((left, right) => left.rank.position - right.rank.position)
      .map((opportunity) => opportunity.opportunityId),
    explanation: `${scan.source.attribution} opportunities ranked with persisted evidence and explainable factors.`
  };
}
