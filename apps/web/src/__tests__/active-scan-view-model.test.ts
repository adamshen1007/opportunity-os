import { describe, expect, it } from "vitest";
import { mapScanEvidence, mapScanOpportunities, mapScanRanking } from "../features/scans/scan-view-model";
import { dashboardStackExchangeScanFixture } from "../testing";

describe("active scan view models", () => {
  it("maps persisted scan opportunities without substituting synthetic dashboard records", () => {
    const opportunities = mapScanOpportunities(dashboardStackExchangeScanFixture);

    expect(opportunities.map((item) => item.opportunityId)).toEqual([
      "stack-exchange-opportunity-1",
      "stack-exchange-opportunity-2"
    ]);
    expect(opportunities[0]?.provenance.sourceName).toBe("Stack Exchange fixture scan");
    expect(JSON.stringify(opportunities)).not.toContain("Synthetic Opportunity Generation fixture");
  });

  it("preserves source evidence links and ranking order", () => {
    const evidence = mapScanEvidence(dashboardStackExchangeScanFixture);
    const ranking = mapScanRanking(dashboardStackExchangeScanFixture);

    expect(evidence[0]?.permalink).toContain("stackoverflow.com/questions/");
    expect(evidence[0]?.provenance.sourceName).toBe("Stack Exchange · stackoverflow · supporting");
    expect(evidence[0]?.provenance.transformedAt).toContain("Cluster cluster-fixture-001");
    expect(ranking.rankedOpportunityIds).toEqual([
      "stack-exchange-opportunity-1",
      "stack-exchange-opportunity-2"
    ]);
  });
});
