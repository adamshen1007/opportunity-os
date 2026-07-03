import { describe, expect, it } from "vitest";
import {
  OPPORTUNITY_RANKING_ERROR_CODES,
  OpportunityRankingError,
  SYNTHETIC_OPPORTUNITY_RANKING_INPUT,
  SYNTHETIC_OPPORTUNITY_RANKING_OPTIONS,
  rankOpportunities
} from "../index.js";
import type { OpportunityRankingRequestId } from "../index.js";

const unsafeValues = [
  "secret-value",
  "access-token-value",
  "authorization-header-value",
  "raw-provider-body",
  "prompt-body",
  "credential-value"
] as const;

describe("Opportunity Ranking security", () => {
  it("keeps synthetic fixtures free from unsafe values", () => {
    const serialized = JSON.stringify(SYNTHETIC_OPPORTUNITY_RANKING_INPUT);

    for (const value of unsafeValues) {
      expect(serialized).not.toContain(value);
    }
  });

  it("does not include unsafe values in successful ranking output", () => {
    const result = rankOpportunities(SYNTHETIC_OPPORTUNITY_RANKING_INPUT, SYNTHETIC_OPPORTUNITY_RANKING_OPTIONS);
    const serialized = JSON.stringify(result);

    for (const value of unsafeValues) {
      expect(serialized).not.toContain(value);
    }
    expect(serialized).not.toContain("Error:");
  });

  it("serializes ranking errors as safe data only", () => {
    const error = new OpportunityRankingError({
      code: OPPORTUNITY_RANKING_ERROR_CODES.rankingFailed,
      message: "Ranking failed safely.",
      requestId: "ranking-request-security" as OpportunityRankingRequestId,
      safeMetadata: {
        redaction: "applied"
      }
    });
    const serialized = JSON.stringify(error.toSafeObject());

    for (const value of unsafeValues) {
      expect(serialized).not.toContain(value);
    }
    expect(serialized).not.toContain("stack");
    expect(serialized).not.toContain("cause");
  });
});
