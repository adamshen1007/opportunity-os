import { dashboardEvidenceFixtures } from "./evidence";

export interface DashboardOpportunityFixture {
  readonly opportunityId: string;
  readonly detailHref?: string;
  readonly title: string;
  readonly summary: string;
  readonly status: "candidate" | "generated" | "ranked" | "validated";
  readonly confidence: number;
  readonly rank: {
    readonly position: number;
    readonly score: number;
  };
  readonly explanation: {
    readonly summary: string;
    readonly factors: readonly string[];
  };
  readonly provenance: {
    readonly sourceName: string;
    readonly generatedAt: string;
  };
  readonly evidenceIds: readonly string[];
}

export const dashboardOpportunityFixtures = [
  {
    opportunityId: "synthetic-opportunity-001",
    title: "Prioritize repeated manual review workflows",
    summary: "A synthetic opportunity showing how the dashboard will display ranked workflow friction.",
    status: "ranked",
    confidence: 0.81,
    rank: {
      position: 1,
      score: 87
    },
    explanation: {
      summary: "Ranked first because confidence, repeated evidence, and workflow urgency are all high.",
      factors: ["High confidence", "Repeated evidence", "Operational urgency"]
    },
    provenance: {
      sourceName: "Synthetic Opportunity Generation fixture",
      generatedAt: "2026-07-03T00:20:00.000Z"
    },
    evidenceIds: dashboardEvidenceFixtures.map((evidence) => evidence.evidenceId)
  },
  {
    opportunityId: "synthetic-opportunity-002",
    title: "Surface high-confidence evidence clusters",
    summary: "A synthetic opportunity for validating list, filter, and detail UI states.",
    status: "generated",
    confidence: 0.73,
    rank: {
      position: 2,
      score: 74
    },
    explanation: {
      summary: "Ranked second because evidence is strong but less complete than the leading opportunity.",
      factors: ["Strong evidence", "Moderate completeness", "Clear provenance"]
    },
    provenance: {
      sourceName: "Synthetic Opportunity Generation fixture",
      generatedAt: "2026-07-03T00:25:00.000Z"
    },
    evidenceIds: ["synthetic-evidence-002"]
  }
] as const satisfies readonly DashboardOpportunityFixture[];
