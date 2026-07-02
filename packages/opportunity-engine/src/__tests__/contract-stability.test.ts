import { describe, expect, it } from "vitest";
import {
  OPPORTUNITY_CONFIDENCE_LEVELS,
  OPPORTUNITY_ENGINE_ERROR_CATEGORIES,
  OPPORTUNITY_ENGINE_ERROR_CODES,
  OPPORTUNITY_EVENT_NAMES,
  OPPORTUNITY_EVIDENCE_KINDS,
  OPPORTUNITY_HYPOTHESIS_STATUSES,
  OPPORTUNITY_RANKING_STATUSES,
  OPPORTUNITY_RESULT_STATUSES,
  OPPORTUNITY_SCORE_DIMENSIONS,
  OPPORTUNITY_SOURCE_KINDS,
  OPPORTUNITY_STATUSES,
  OPPORTUNITY_VALIDATION_ISSUE_CODES,
  opportunityFixtureCompletedEvent,
  opportunityFixtureResult
} from "../index.js";

describe("opportunity engine contract stability", () => {
  it("locks stable vocabulary values", () => {
    expect(OPPORTUNITY_STATUSES).toEqual({
      draft: "draft",
      candidate: "candidate",
      validated: "validated",
      archived: "archived"
    });
    expect(OPPORTUNITY_SOURCE_KINDS).toEqual({
      rawContent: "raw-content",
      normalizedContent: "normalized-content",
      embedding: "embedding",
      llmAnalysis: "llm-analysis",
      structuredAnalysis: "structured-analysis"
    });
    expect(OPPORTUNITY_EVIDENCE_KINDS.repeatedPattern).toBe("repeated-pattern");
    expect(OPPORTUNITY_HYPOTHESIS_STATUSES.needsReview).toBe("needs-review");
    expect(OPPORTUNITY_SCORE_DIMENSIONS.feasibilitySignal).toBe("feasibility-signal");
    expect(OPPORTUNITY_CONFIDENCE_LEVELS.unknown).toBe("unknown");
    expect(OPPORTUNITY_RANKING_STATUSES.excluded).toBe("excluded");
    expect(OPPORTUNITY_VALIDATION_ISSUE_CODES.unsafeMetadata).toBe("opportunity.unsafe_metadata");
    expect(OPPORTUNITY_RESULT_STATUSES.partial).toBe("partial");
    expect(OPPORTUNITY_ENGINE_ERROR_CATEGORIES.safety).toBe("safety");
    expect(OPPORTUNITY_ENGINE_ERROR_CODES.internalFailure).toBe("opportunity.internal_failure");
    expect(OPPORTUNITY_EVENT_NAMES.failed).toBe("opportunity.failed");
  });

  it("locks result and event envelope shapes", () => {
    expect(Object.keys(opportunityFixtureResult).sort()).toEqual([
      "confidence",
      "evidence",
      "hypothesis",
      "opportunityId",
      "ranking",
      "safeMetadata",
      "score",
      "status"
    ]);
    expect(Object.keys(opportunityFixtureCompletedEvent.metadata).sort()).toEqual([
      "category",
      "correlationId",
      "eventId",
      "eventName",
      "source",
      "timestamp",
      "version"
    ]);
    expect(Object.keys(opportunityFixtureCompletedEvent.payload).sort()).toEqual([
      "opportunityId",
      "safeMetadata",
      "status"
    ]);
  });
});
