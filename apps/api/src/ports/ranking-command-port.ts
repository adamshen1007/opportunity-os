import type { ApiRankingDto } from "../resources/index.js";

export interface ApiRankingRequestInput {
  readonly opportunityIds: readonly string[];
  readonly correlationId: string;
  readonly requestId?: string;
}

export interface ApiRankingGetInput {
  readonly rankingId: string;
  readonly correlationId: string;
  readonly requestId?: string;
}

export interface ApiRankingCommandPort {
  rankOpportunities(input: ApiRankingRequestInput): Promise<ApiRankingDto>;
  getRanking(input: ApiRankingGetInput): Promise<ApiRankingDto | undefined>;
}
