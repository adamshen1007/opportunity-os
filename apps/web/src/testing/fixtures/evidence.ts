export interface DashboardEvidenceFixture {
  readonly evidenceId: string;
  readonly sourceType: string;
  readonly summary: string;
  readonly confidence: number;
  readonly permalink?: string;
  readonly provenance: {
    readonly sourceName: string;
    readonly collectedAt: string;
    readonly transformedAt: string;
  };
}

export const dashboardEvidenceFixtures = [
  {
    evidenceId: "synthetic-evidence-001",
    sourceType: "reddit-post",
    summary: "Operators describe repeated manual review before deciding whether a lead is worth attention.",
    confidence: 0.82,
    provenance: {
      sourceName: "Synthetic Reddit contract fixture",
      collectedAt: "2026-07-03T00:00:00.000Z",
      transformedAt: "2026-07-03T00:05:00.000Z"
    }
  },
  {
    evidenceId: "synthetic-evidence-002",
    sourceType: "analysis",
    summary: "Synthetic analysis groups the repeated review pattern into a workflow-friction signal.",
    confidence: 0.76,
    provenance: {
      sourceName: "Synthetic analysis contract fixture",
      collectedAt: "2026-07-03T00:10:00.000Z",
      transformedAt: "2026-07-03T00:15:00.000Z"
    }
  }
] as const satisfies readonly DashboardEvidenceFixture[];
