import type { ApiRankingExplanationDto } from "./ranking-explanation-dto.js";

export interface ApiRankedOpportunityDto {
  readonly opportunityId: string;
  readonly position: number;
  readonly score: number;
  readonly explanation: ApiRankingExplanationDto;
}

export interface ApiRankingDto {
  readonly rankingId: string;
  readonly status: "ranked";
  readonly rankedOpportunities: readonly ApiRankedOpportunityDto[];
  readonly generatedAt: string;
}
