import { createDashboardApiClient } from "./client";
import { listOpportunities } from "./opportunities";
import type { DashboardApiOpportunityDto } from "./types";
import { dashboardOpportunityFixtures, type DashboardOpportunityFixture } from "../testing";

export const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL ?? "http://127.0.0.1:4000";

export interface DashboardLocalData {
  readonly opportunities: readonly DashboardOpportunityFixture[];
  readonly source: "local-api" | "fixtures";
}

export async function loadDashboardLocalData(): Promise<DashboardLocalData> {
  try {
    const client = createDashboardApiClient({
      baseUrl: LOCAL_API_BASE_URL,
      fetch: globalThis.fetch,
      correlationId: "dashboard-local-runtime"
    });
    const result = await listOpportunities(client, { limit: 25 });

    if (result.ok) {
      return {
        opportunities: result.data.opportunities.map(mapApiOpportunityToDashboardOpportunity),
        source: "local-api"
      };
    }
  } catch {
    // Local runtime pages remain demoable when the API terminal is not running.
  }

  return {
    opportunities: dashboardOpportunityFixtures,
    source: "fixtures"
  };
}

export function mapApiOpportunityToDashboardOpportunity(
  opportunity: DashboardApiOpportunityDto
): DashboardOpportunityFixture {
  return {
    opportunityId: opportunity.opportunityId,
    title: opportunity.title,
    summary: opportunity.summary,
    status: opportunity.status,
    confidence: opportunity.confidence,
    rank: {
      position: opportunity.rank?.position ?? 0,
      score: opportunity.rank?.score ?? 0
    },
    explanation: {
      summary: "Loaded from the local Opportunity OS API runtime.",
      factors: opportunity.evidence.map((evidence) => evidence.summary)
    },
    provenance: {
      sourceName: opportunity.source.sourceType,
      generatedAt: "local-api-runtime"
    },
    evidenceIds: opportunity.evidence.map((evidence) => evidence.evidenceId)
  };
}
