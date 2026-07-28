import type { ApiOpportunityQueryPort, ApiRankingCommandPort } from "../ports/index.js";
import type { ApiScanOpportunityDto, ApiScanResultDto } from "../pipeline/index.js";
import type { ApiScanPersistenceStore } from "../persistence/index.js";
import type { ApiOpportunityDto, ApiRankingDto } from "../resources/index.js";
import type { ApiOwnershipScope } from "./ownership-scope.js";

export function createOwnerScopedOpportunityPort(
  persistence: ApiScanPersistenceStore,
  scope: ApiOwnershipScope
): ApiOpportunityQueryPort {
  return {
    async listOpportunities(input) {
      const scans = await persistence.listScanResults(scope, 25);
      const all = scans.flatMap((scan) => scan.opportunities.map((opportunity) => toOpportunityDto(opportunity, scan)));
      const filtered = all.filter((opportunity) => matchesFilters(opportunity, input.filters));
      const start = input.pagination.cursor ? Number.parseInt(input.pagination.cursor, 10) || 0 : 0;
      const opportunities = filtered.slice(start, start + input.pagination.limit);
      return {
        opportunities,
        pagination: {
          limit: input.pagination.limit,
          direction: input.pagination.direction,
          hasNextPage: start + opportunities.length < filtered.length,
          hasPreviousPage: start > 0
        },
        totalCount: filtered.length
      };
    },
    async getOpportunity(input) {
      const scans = await persistence.listScanResults(scope, 25);
      for (const scan of scans) {
        const opportunity = scan.opportunities.find((candidate) => candidate.opportunityId === input.opportunityId);
        if (opportunity) return toOpportunityDto(opportunity, scan);
      }
      return undefined;
    }
  };
}

export function createOwnerScopedRankingPort(
  persistence: ApiScanPersistenceStore,
  scope: ApiOwnershipScope
): ApiRankingCommandPort {
  return {
    async rankOpportunities(input) {
      const scans = await persistence.listScanResults(scope, 25);
      const owned = scans.flatMap((scan) => scan.opportunities.map((opportunity) => ({ scan, opportunity })));
      const selected = input.opportunityIds.map((opportunityId) =>
        owned.find((candidate) => candidate.opportunity.opportunityId === opportunityId)
      );
      if (selected.some((candidate) => candidate === undefined)) {
        return emptyRanking("ranking-not-found");
      }
      const first = selected[0];
      return first ? toRankingDto(first.scan, selected.flatMap((item) => item ? [item.opportunity] : [])) : emptyRanking("ranking-empty");
    },
    async getRanking(input) {
      const scans = await persistence.listScanResults(scope, 25);
      const scan = scans.find((candidate) => candidate.opportunities.some((item) => item.provenance.rankingRunId === input.rankingId));
      return scan ? toRankingDto(scan, scan.opportunities) : undefined;
    }
  };
}

function toOpportunityDto(opportunity: ApiScanOpportunityDto, scan: ApiScanResultDto): ApiOpportunityDto {
  return {
    opportunityId: opportunity.opportunityId,
    title: opportunity.title,
    summary: opportunity.summary,
    status: "ranked",
    confidence: opportunity.confidence,
    evidence: opportunity.evidence.map((evidence) => ({
      evidenceId: evidence.evidenceId,
      sourceType: evidence.sourceType,
      summary: evidence.summary,
      confidence: evidence.confidence
    })),
    source: { sourceId: opportunity.provenance.sourceItemId, sourceType: scan.source.provider },
    rank: { position: opportunity.rank.position, score: opportunity.rank.score },
    safeMetadata: { scanId: scan.scanId, mode: scan.mode }
  };
}

function toRankingDto(scan: ApiScanResultDto, opportunities: readonly ApiScanOpportunityDto[]): ApiRankingDto {
  const rankingId = opportunities[0]?.provenance.rankingRunId ?? `${scan.scanId}-ranking`;
  return {
    rankingId,
    status: "ranked",
    generatedAt: new Date(0).toISOString(),
    rankedOpportunities: [...opportunities]
      .sort((left, right) => left.rank.position - right.rank.position)
      .map((opportunity) => ({
        opportunityId: opportunity.opportunityId,
        position: opportunity.rank.position,
        score: opportunity.rank.score,
        explanation: {
          summary: opportunity.rank.explanation,
          factors: opportunity.trust.rankingFactors.map((factor, index) => ({
            factorId: `factor-${index + 1}`,
            label: factor.label,
            weight: 1,
            contribution: opportunity.rank.score,
            message: factor.contribution
          }))
        }
      }))
  };
}

function emptyRanking(rankingId: string): ApiRankingDto {
  return { rankingId, status: "ranked", generatedAt: new Date(0).toISOString(), rankedOpportunities: [] };
}

function matchesFilters(opportunity: ApiOpportunityDto, filters: Readonly<Record<string, string>>): boolean {
  const search = filters.search?.toLowerCase();
  if (search && !`${opportunity.title} ${opportunity.summary}`.toLowerCase().includes(search)) return false;
  return !filters.status || filters.status === opportunity.status;
}
