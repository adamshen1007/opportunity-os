import { describe, expect, it } from "vitest";
import {
  CANDIDATE_CONFIDENCE_AGGREGATION_STATUSES,
  CANDIDATE_ERROR_CATEGORIES,
  CANDIDATE_ERROR_CODES,
  CANDIDATE_EVENT_NAMES,
  CANDIDATE_EVIDENCE_COMPLETENESS_STATUSES,
  CANDIDATE_EVIDENCE_REQUIREMENT_KINDS,
  CANDIDATE_OPPORTUNITY_LIFECYCLE_STATES,
  CANDIDATE_OPPORTUNITY_PROVENANCE_BOUNDARIES,
  CANDIDATE_OPPORTUNITY_STATUSES,
  CANDIDATE_RESULT_STATUSES,
  CANDIDATE_VALIDATION_ISSUE_CODES,
  candidateFixtureEvent,
  candidateFixtureResult
} from "../index.js";

describe("candidate opportunity contract stability", () => {
  it("locks stable vocabulary values", () => {
    expect(CANDIDATE_OPPORTUNITY_STATUSES).toEqual({
      draft: "draft",
      validationReady: "validation-ready",
      evidenceReview: "evidence-review",
      accepted: "accepted",
      rejected: "rejected",
      archived: "archived",
      superseded: "superseded"
    });
    expect(CANDIDATE_OPPORTUNITY_LIFECYCLE_STATES.validationReady).toBe("validation-ready");
    expect(CANDIDATE_OPPORTUNITY_PROVENANCE_BOUNDARIES.opportunityPipeline).toBe("opportunity-pipeline");
    expect(CANDIDATE_EVIDENCE_COMPLETENESS_STATUSES.unknown).toBe("unknown");
    expect(CANDIDATE_EVIDENCE_REQUIREMENT_KINDS.supportingAnalysis).toBe("supporting-analysis");
    expect(CANDIDATE_CONFIDENCE_AGGREGATION_STATUSES.reviewRequired).toBe("review-required");
    expect(CANDIDATE_VALIDATION_ISSUE_CODES.confidenceReviewRequired).toBe("candidate.confidence_review_required");
    expect(CANDIDATE_RESULT_STATUSES.evidenceIncomplete).toBe("evidence-incomplete");
    expect(CANDIDATE_ERROR_CATEGORIES.safety).toBe("safety");
    expect(CANDIDATE_ERROR_CODES.internalFailure).toBe("candidate.internal_failure");
    expect(CANDIDATE_EVENT_NAMES.rejected).toBe("candidate.rejected");
  });

  it("locks result and event shapes", () => {
    expect(Object.keys(candidateFixtureResult).sort()).toEqual([
      "candidate",
      "confidenceAggregation",
      "evidenceCompleteness",
      "status"
    ]);
    expect(Object.keys(candidateFixtureEvent).sort()).toEqual([
      "eventName",
      "payload"
    ]);
    expect(Object.keys(candidateFixtureEvent.payload).sort()).toEqual([
      "candidateId",
      "safeMetadata",
      "status"
    ]);
  });
});
