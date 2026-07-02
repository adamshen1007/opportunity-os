import { describe, expect, it } from "vitest";
import {
  OPPORTUNITY_ENGINE_ERROR_CATEGORIES,
  OPPORTUNITY_ENGINE_ERROR_CODES,
  OpportunityEngineError,
  opportunityFixtureCompletedEvent,
  opportunityFixtureError,
  opportunityFixtureResult,
  opportunityFixtureValidationFailure
} from "../index.js";

const UNSAFE_PATTERN =
  /(api[_-]?key|authorization|bearer|password|client_secret|access_token|refresh_token|provider payload|raw response|prompt|stack trace)/iu;

describe("opportunity engine security", () => {
  it("keeps fixtures synthetic and free of unsafe material", () => {
    const serialized = JSON.stringify({
      opportunityFixtureCompletedEvent,
      opportunityFixtureError,
      opportunityFixtureResult,
      opportunityFixtureValidationFailure
    });

    expect(serialized).not.toMatch(UNSAFE_PATTERN);
  });

  it("serializes errors without causes or stacks", () => {
    const error = new OpportunityEngineError({
      code: OPPORTUNITY_ENGINE_ERROR_CODES.internalFailure,
      category: OPPORTUNITY_ENGINE_ERROR_CATEGORIES.internal,
      message: "Opportunity engine failed safely.",
      correlationId: "correlation-fixture-1",
      cause: new Error("access_token=unsafe")
    });

    const serialized = JSON.stringify(error);

    expect(serialized).toContain("Opportunity engine failed safely.");
    expect(serialized).not.toContain("access_token=unsafe");
    expect(serialized).not.toContain("stack");
    expect(serialized).not.toContain("cause");
  });
});
