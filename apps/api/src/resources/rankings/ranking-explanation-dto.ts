export interface ApiRankingFactorExplanationDto {
  readonly factorId: string;
  readonly label: string;
  readonly weight: number;
  readonly contribution: number;
  readonly message: string;
}

export interface ApiRankingExplanationDto {
  readonly summary: string;
  readonly factors: readonly ApiRankingFactorExplanationDto[];
}
