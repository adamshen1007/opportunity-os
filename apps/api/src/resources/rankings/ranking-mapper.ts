import type { ApiRankingDto } from "./ranking-dto.js";

export interface ApiRankingSource {
  readonly rankingId: string;
  readonly rankedOpportunities: readonly {
    readonly opportunityId: string;
    readonly position: number;
    readonly score: number;
    readonly explanation: {
      readonly summary: string;
      readonly factors: readonly {
        readonly factorId: string;
        readonly label: string;
        readonly weight: number;
        readonly contribution: number;
        readonly message: string;
      }[];
    };
  }[];
  readonly generatedAt: string;
}

export function mapRankingToDto(source: ApiRankingSource): ApiRankingDto {
  return {
    rankingId: source.rankingId,
    status: "ranked",
    rankedOpportunities: source.rankedOpportunities.map((opportunity) => ({
      opportunityId: opportunity.opportunityId,
      position: opportunity.position,
      score: opportunity.score,
      explanation: {
        summary: opportunity.explanation.summary,
        factors: opportunity.explanation.factors.map((factor) => ({ ...factor }))
      }
    })),
    generatedAt: source.generatedAt
  };
}
