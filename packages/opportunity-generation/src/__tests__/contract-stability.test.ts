import { describe, expect, it } from "vitest";
import {
  GENERATION_CONFIDENCE_AGGREGATION_STATUSES,
  GENERATION_ERROR_CATEGORIES,
  GENERATION_ERROR_CODES,
  GENERATION_EVENT_NAMES,
  GENERATION_EVIDENCE_ASSEMBLY_STATUSES,
  GENERATION_RESULT_STATUSES,
  GENERATION_VALIDATION_ISSUE_CODES,
  OPPORTUNITY_GENERATION_MODES,
  OPPORTUNITY_GENERATION_OUTPUT_STATUSES,
  OPPORTUNITY_GENERATION_STAGES,
  opportunityGenerationFixtureEvent,
  opportunityGenerationFixtureResult
} from "../index.js";

describe("Opportunity Generation contract stability", () => {
  it("locks stable vocabulary values", () => {
    expect(OPPORTUNITY_GENERATION_MODES).toEqual({
      deterministic: "deterministic",
      dryRun: "dry-run"
    });
    expect(OPPORTUNITY_GENERATION_STAGES.outputPrepared).toBe("output-prepared");
    expect(OPPORTUNITY_GENERATION_OUTPUT_STATUSES.confidenceUnavailable).toBe("confidence-unavailable");
    expect(GENERATION_EVIDENCE_ASSEMBLY_STATUSES.incomplete).toBe("incomplete");
    expect(GENERATION_VALIDATION_ISSUE_CODES.unsupportedProvenance).toBe("generation.unsupported_provenance");
    expect(GENERATION_CONFIDENCE_AGGREGATION_STATUSES.reviewRequired).toBe("review-required");
    expect(GENERATION_RESULT_STATUSES.evidenceIncomplete).toBe("evidence-incomplete");
    expect(GENERATION_ERROR_CATEGORIES.safety).toBe("safety");
    expect(GENERATION_ERROR_CODES.internalFailure).toBe("generation.internal_failure");
    expect(GENERATION_EVENT_NAMES.failed).toBe("generation.failed");
  });

  it("locks result and event shapes", () => {
    expect(Object.keys(opportunityGenerationFixtureResult).sort()).toEqual([
      "generatedOpportunity",
      "output",
      "status"
    ]);
    expect(Object.keys(opportunityGenerationFixtureEvent).sort()).toEqual([
      "eventName",
      "payload"
    ]);
    expect(Object.keys(opportunityGenerationFixtureEvent.payload).sort()).toEqual([
      "candidateId",
      "opportunityId",
      "outputId",
      "runId",
      "safeMetadata",
      "status"
    ]);
  });
});
