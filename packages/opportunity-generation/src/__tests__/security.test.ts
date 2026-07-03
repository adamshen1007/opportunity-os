import { describe, expect, it } from "vitest";
import {
  GENERATION_ERROR_CATEGORIES,
  GENERATION_ERROR_CODES,
  GENERATION_VALIDATION_ISSUE_CODES,
  OpportunityGenerationError,
  opportunityGenerationFixtureError,
  opportunityGenerationFixtureEvent,
  opportunityGenerationFixtureInput,
  opportunityGenerationFixtureOutput,
  opportunityGenerationFixtureResult
} from "../index.js";

const SECRET_LIKE_VALUES = [
  "sk-test-secret",
  "Bearer token-value",
  "client-secret-value",
  "password-value",
  "raw-provider-payload",
  "prompt-template-value",
  "database-url-value"
];

describe("Opportunity Generation security", () => {
  it("keeps fixtures free of secret-like and unsafe source values", () => {
    const serializedFixtures = JSON.stringify({
      input: opportunityGenerationFixtureInput,
      output: opportunityGenerationFixtureOutput,
      result: opportunityGenerationFixtureResult,
      event: opportunityGenerationFixtureEvent,
      error: opportunityGenerationFixtureError
    });

    for (const value of SECRET_LIKE_VALUES) {
      expect(serializedFixtures).not.toContain(value);
    }
  });

  it("serializes errors without stack traces or raw causes", () => {
    const error = new OpportunityGenerationError({
      code: GENERATION_ERROR_CODES.unsafeInput,
      category: GENERATION_ERROR_CATEGORIES.safety,
      message: "Generation input failed safety review.",
      correlationId: "correlation-safe-1",
      issues: [
        {
          code: GENERATION_VALIDATION_ISSUE_CODES.unsafeMetadata,
          message: "Unsafe metadata was rejected."
        }
      ],
      cause: new Error("sk-test-secret raw-provider-payload stack detail")
    });
    const serialized = JSON.stringify(error);

    expect(serialized).toContain("generation.unsafe_input");
    expect(serialized).not.toContain("sk-test-secret");
    expect(serialized).not.toContain("raw-provider-payload");
    expect(serialized).not.toContain("stack");
  });
});
