import { dashboardEvidenceFixtures, dashboardOpportunityFixtures, type DashboardOpportunityFixture } from "../../testing";

export function getOpportunityById(opportunityId: string): DashboardOpportunityFixture | undefined {
  return dashboardOpportunityFixtures.find((opportunity) => opportunity.opportunityId === opportunityId);
}

export function getEvidenceForOpportunity(opportunity: DashboardOpportunityFixture) {
  const evidenceIds = new Set(opportunity.evidenceIds);
  return dashboardEvidenceFixtures.filter((evidence) => evidenceIds.has(evidence.evidenceId));
}

export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}
