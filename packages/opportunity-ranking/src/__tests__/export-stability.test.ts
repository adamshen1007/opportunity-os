import { describe, expect, it } from "vitest";
import * as publicExports from "../index.js";

describe("Opportunity Ranking export stability", () => {
  it("keeps approved public exports available from the package root", () => {
    expect(publicExports.OPPORTUNITY_RANKING_PACKAGE_NAME).toBe("@opportunity-os/opportunity-ranking");
    expect(publicExports.OPPORTUNITY_RANKING_FOUNDATION_PHASE).toBe("phase-3-milestone-25");
    expect(publicExports.OPPORTUNITY_RANKING_RESULT_STATUSES.success).toBe("success");
    expect(publicExports.OPPORTUNITY_RANKING_EVENT_NAMES.rankingCompleted).toBe("opportunity-ranking.completed");
    expect(publicExports.OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES.missingWeights).toBe("missing-weights");
    expect(publicExports.DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET.weights).toHaveLength(4);
    expect(publicExports.SYNTHETIC_OPPORTUNITY_RANKING_INPUT.generatedOpportunities).toHaveLength(2);
    expect(typeof publicExports.rankOpportunities).toBe("function");
    expect(typeof publicExports.calculateOpportunityRankingScore).toBe("function");
    expect(typeof publicExports.createSyntheticOpportunityRankingInput).toBe("function");
  });
});
