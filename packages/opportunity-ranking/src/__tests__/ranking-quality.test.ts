import { describe, expect, it } from "vitest";
import {
  OPPORTUNITY_RANKING_RESULT_STATUSES,
  SYNTHETIC_OPPORTUNITY_RANKING_INPUT,
  SYNTHETIC_OPPORTUNITY_RANKING_OPTIONS,
  calculateOpportunityRankingScore,
  rankOpportunities
} from "../index.js";

describe("Opportunity Ranking deterministic quality", () => {
  it("produces the same output for the same explicit input", () => {
    const first = rankOpportunities(SYNTHETIC_OPPORTUNITY_RANKING_INPUT, SYNTHETIC_OPPORTUNITY_RANKING_OPTIONS);
    const second = rankOpportunities(SYNTHETIC_OPPORTUNITY_RANKING_INPUT, SYNTHETIC_OPPORTUNITY_RANKING_OPTIONS);

    expect(first).toEqual(second);
  });

  it("requires every ranked opportunity to include explanations and traceable factors", () => {
    const result = rankOpportunities(SYNTHETIC_OPPORTUNITY_RANKING_INPUT, SYNTHETIC_OPPORTUNITY_RANKING_OPTIONS);

    expect(result.status).toBe(OPPORTUNITY_RANKING_RESULT_STATUSES.success);
    if (result.status !== OPPORTUNITY_RANKING_RESULT_STATUSES.success) {
      throw new Error("Expected ranking success.");
    }

    for (const ranked of result.output.rankedOpportunities) {
      expect(ranked.explanation.summary).toContain("weighted sum");
      expect(ranked.signals.length).toBeGreaterThan(0);
      expect(ranked.factors.every((factor) => factor.explanation.length > 0)).toBe(true);
      expect(ranked.score).toBeGreaterThan(0);
    }
  });

  it("keeps score calculation stable for synthetic fixtures", () => {
    const calculation = calculateOpportunityRankingScore(
      SYNTHETIC_OPPORTUNITY_RANKING_INPUT.factors.factors,
      SYNTHETIC_OPPORTUNITY_RANKING_INPUT.weights
    );

    expect(calculation.score).toBe(0.785);
    expect(calculation.contributions.map((entry) => entry.contribution)).toEqual([0.315, 0.24, 0.14, 0.09]);
  });
});
