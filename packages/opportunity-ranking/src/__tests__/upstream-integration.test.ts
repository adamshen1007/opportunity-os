import { describe, expect, it } from "vitest";
import {
  OPPORTUNITY_RANKING_RESULT_STATUSES,
  SYNTHETIC_OPPORTUNITY_RANKING_INPUT,
  SYNTHETIC_OPPORTUNITY_RANKING_OPTIONS,
  rankOpportunities
} from "../index.js";

describe("Opportunity Ranking upstream integration", () => {
  it("references upstream package outputs through safe structural references", () => {
    expect(SYNTHETIC_OPPORTUNITY_RANKING_INPUT.generatedOpportunities[0]?.packageName).toBe(
      "@opportunity-os/opportunity-generation"
    );
    expect(SYNTHETIC_OPPORTUNITY_RANKING_INPUT.candidates[0]?.packageName).toBe(
      "@opportunity-os/opportunity-candidates"
    );
    expect(SYNTHETIC_OPPORTUNITY_RANKING_INPUT.generationOutputs[0]?.entityKind).toBe("generation-output");
  });

  it("preserves upstream references in ranked output", () => {
    const result = rankOpportunities(SYNTHETIC_OPPORTUNITY_RANKING_INPUT, SYNTHETIC_OPPORTUNITY_RANKING_OPTIONS);

    expect(result.status).toBe(OPPORTUNITY_RANKING_RESULT_STATUSES.success);
    if (result.status !== OPPORTUNITY_RANKING_RESULT_STATUSES.success) {
      throw new Error("Expected ranking success.");
    }

    expect(result.output.rankedOpportunities.map((entry) => entry.opportunity.entityId)).toEqual([
      "generated-opportunity-a",
      "generated-opportunity-b"
    ]);
    expect(result.output.rankedOpportunities.every((entry) => entry.opportunity.version === "generation-v1")).toBe(
      true
    );
  });
});
