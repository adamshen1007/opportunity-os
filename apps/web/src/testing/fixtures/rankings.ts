export interface DashboardRankingFixture {
  readonly rankingId: string;
  readonly generatedAt: string;
  readonly rankedOpportunityIds: readonly string[];
  readonly explanation: string;
}

export const dashboardRankingFixtures = [
  {
    rankingId: "synthetic-ranking-001",
    generatedAt: "2026-07-03T00:00:00.000Z",
    rankedOpportunityIds: ["synthetic-opportunity-001", "synthetic-opportunity-002"],
    explanation: "Synthetic ranking sorted by explicit score, confidence, and evidence completeness."
  }
] as const satisfies readonly DashboardRankingFixture[];
