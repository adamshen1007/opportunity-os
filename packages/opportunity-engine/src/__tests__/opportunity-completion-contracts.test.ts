import { describe, expect, it } from "vitest";
import {
  OPPORTUNITY_CONFIDENCE_LEVELS,
  OPPORTUNITY_ENGINE_ERROR_CATEGORIES,
  OPPORTUNITY_ENGINE_ERROR_CODES,
  OPPORTUNITY_EVENT_NAMES,
  OPPORTUNITY_RANKING_STATUSES,
  OPPORTUNITY_RESULT_STATUSES,
  OPPORTUNITY_SCORE_DIMENSIONS,
  OPPORTUNITY_VALIDATION_ISSUE_CODES,
  OpportunityEngineError,
  type OpportunityId,
  type OpportunityRankPosition,
  type OpportunityResult,
  type OpportunityScoreValue
} from "../index.js";

const opportunityId = "opportunity_test_001" as OpportunityId;

describe("opportunity completion contracts", () => {
  it("exports stable score, confidence, and ordering vocabularies", () => {
    expect(OPPORTUNITY_SCORE_DIMENSIONS.evidenceStrength).toBe("evidence-strength");
    expect(OPPORTUNITY_CONFIDENCE_LEVELS.high).toBe("high");
    expect(OPPORTUNITY_RANKING_STATUSES.included).toBe("included");
  });

  it("exports stable validation, result, and event vocabularies", () => {
    expect(OPPORTUNITY_VALIDATION_ISSUE_CODES.missingEvidence).toBe("opportunity.missing_evidence");
    expect(OPPORTUNITY_RESULT_STATUSES.validationFailure).toBe("validation-failure");
    expect(OPPORTUNITY_EVENT_NAMES.completed).toBe("opportunity.completed");
  });

  it("models result failures without unsafe details", () => {
    const result = {
      status: OPPORTUNITY_RESULT_STATUSES.validationFailure,
      issues: [
        {
          code: OPPORTUNITY_VALIDATION_ISSUE_CODES.missingEvidence,
          message: "Evidence is required."
        }
      ]
    } satisfies OpportunityResult;

    expect(result.issues[0]?.message).toBe("Evidence is required.");
  });

  it("serializes errors to safe details only", () => {
    const error = new OpportunityEngineError({
      code: OPPORTUNITY_ENGINE_ERROR_CODES.validationFailed,
      category: OPPORTUNITY_ENGINE_ERROR_CATEGORIES.validation,
      message: "Opportunity validation failed.",
      correlationId: "corr_test",
      cause: new Error("stack-bearing internal cause")
    });

    const serialized = JSON.stringify(error);
    expect(serialized).toContain("opportunity.validation_failed");
    expect(serialized).not.toContain("stack-bearing internal cause");
    expect(serialized).not.toContain("stack");
  });

  it("models score and rank metadata as explicit contract fields", () => {
    const scoreValue = 0.8 as OpportunityScoreValue;
    const position = 1 as OpportunityRankPosition;

    expect(scoreValue).toBe(0.8);
    expect(position).toBe(1);
    expect(opportunityId).toBe("opportunity_test_001");
  });
});
