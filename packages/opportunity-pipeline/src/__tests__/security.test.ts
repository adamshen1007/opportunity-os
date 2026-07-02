import { describe, expect, it } from "vitest";
import {
  OPPORTUNITY_PIPELINE_ERROR_CATEGORIES,
  OPPORTUNITY_PIPELINE_ERROR_CODES,
  OpportunityPipelineError,
  opportunityPipelineFixtureError,
  opportunityPipelineFixtureResult
} from "../index.js";

const forbiddenSecurityFragments = [
  "access_token",
  "refresh_token",
  "client_secret",
  "authorization",
  "bearer ",
  "provider_response",
  "raw_provider",
  "stack",
  "secret-token"
];

describe("Opportunity Pipeline security contracts", () => {
  it("does not serialize raw causes or stack traces from errors", () => {
    const error = new OpportunityPipelineError({
      code: OPPORTUNITY_PIPELINE_ERROR_CODES.unsafeInput,
      category: OPPORTUNITY_PIPELINE_ERROR_CATEGORIES.safety,
      message: "Unsafe input rejected.",
      correlationId: "correlation-fixture-1",
      cause: new Error("secret-token")
    });

    const serialized = JSON.stringify(error).toLowerCase();

    for (const fragment of forbiddenSecurityFragments) {
      expect(serialized).not.toContain(fragment);
    }
  });

  it("keeps fixture error and result output secret-safe", () => {
    const serialized = JSON.stringify({
      error: opportunityPipelineFixtureError,
      result: opportunityPipelineFixtureResult
    }).toLowerCase();

    for (const fragment of forbiddenSecurityFragments) {
      expect(serialized).not.toContain(fragment);
    }
  });
});
