import { describe, expect, it } from "vitest";
import {
  CANDIDATE_FIXTURE_IDS,
  CANDIDATE_RESULT_STATUSES,
  candidateFixtureEvent,
  candidateFixtureEvidenceCompleteness,
  candidateFixtureOpportunity,
  candidateFixtureResult,
  candidateFixtureSafeMetadata,
  candidateFixtureValidationFailure,
  candidateFixtureValidationSuccess
} from "../index.js";

const UNSAFE_FIXTURE_PATTERN =
  /(api[_-]?key|authorization|bearer|password|client_secret|access_token|refresh_token|provider payload|raw provider|prompt|production business)/iu;

describe("candidate opportunity fixtures", () => {
  it("provides deterministic synthetic candidate fixtures", () => {
    expect(CANDIDATE_FIXTURE_IDS.candidateId).toBe("candidate-fixture-1");
    expect(candidateFixtureOpportunity.candidateId).toBe(CANDIDATE_FIXTURE_IDS.candidateId);
    expect(candidateFixtureResult.status).toBe(CANDIDATE_RESULT_STATUSES.success);
    expect(candidateFixtureEvent.payload.candidateId).toBe(CANDIDATE_FIXTURE_IDS.candidateId);
  });

  it("keeps fixtures synthetic and free of unsafe material", () => {
    const serialized = JSON.stringify({
      candidateFixtureEvent,
      candidateFixtureEvidenceCompleteness,
      candidateFixtureOpportunity,
      candidateFixtureResult,
      candidateFixtureSafeMetadata,
      candidateFixtureValidationFailure,
      candidateFixtureValidationSuccess
    });

    expect(serialized).not.toMatch(UNSAFE_FIXTURE_PATTERN);
  });
});
