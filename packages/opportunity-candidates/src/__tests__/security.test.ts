import { describe, expect, it } from "vitest";
import {
  CANDIDATE_ERROR_CATEGORIES,
  CANDIDATE_ERROR_CODES,
  CandidateOpportunityError,
  candidateFixtureError,
  candidateFixtureEvent,
  candidateFixtureEvidenceCompleteness,
  candidateFixtureResult,
  candidateFixtureValidationFailure
} from "../index.js";

const UNSAFE_PATTERN =
  /(api[_-]?key|authorization|bearer|password|client_secret|access_token|refresh_token|provider payload|raw provider|prompt|stack trace|production business)/iu;

describe("candidate opportunity security", () => {
  it("keeps safe outputs free of secrets, prompts, provider payloads, and production examples", () => {
    const serialized = JSON.stringify({
      candidateFixtureError,
      candidateFixtureEvent,
      candidateFixtureEvidenceCompleteness,
      candidateFixtureResult,
      candidateFixtureValidationFailure
    });

    expect(serialized).not.toMatch(UNSAFE_PATTERN);
  });

  it("serializes candidate errors without causes or stacks", () => {
    const error = new CandidateOpportunityError({
      code: CANDIDATE_ERROR_CODES.internalFailure,
      category: CANDIDATE_ERROR_CATEGORIES.internal,
      message: "Candidate engine failed safely.",
      correlationId: "correlation-fixture-1",
      cause: new Error("access_token=unsafe")
    });

    const serialized = JSON.stringify(error);

    expect(serialized).toContain("Candidate engine failed safely.");
    expect(serialized).not.toContain("access_token=unsafe");
    expect(serialized).not.toContain("stack");
    expect(serialized).not.toContain("cause");
  });
});
