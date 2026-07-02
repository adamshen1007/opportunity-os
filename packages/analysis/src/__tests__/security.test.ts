import { describe, expect, it } from "vitest";
import {
  STRUCTURED_ANALYSIS_ERROR_CATEGORIES,
  STRUCTURED_ANALYSIS_ERROR_CODES,
  StructuredAnalysisError,
  structuredAnalysisFixtureCompletedEvent,
  structuredAnalysisFixtureInput,
  structuredAnalysisFixtureResult
} from "../index.js";

const UNSAFE_PATTERN =
  /(api[_-]?key|authorization|bearer|password|client_secret|access_token|refresh_token|provider payload|raw response|stack trace)/iu;

describe("structured analysis security", () => {
  it("keeps fixtures synthetic and secret-free", () => {
    const serialized = JSON.stringify({
      structuredAnalysisFixtureInput,
      structuredAnalysisFixtureResult,
      structuredAnalysisFixtureCompletedEvent
    });

    expect(serialized).not.toMatch(UNSAFE_PATTERN);
  });

  it("serializes errors without causes or stacks", () => {
    const error = new StructuredAnalysisError({
      code: STRUCTURED_ANALYSIS_ERROR_CODES.internalFailure,
      category: STRUCTURED_ANALYSIS_ERROR_CATEGORIES.internal,
      message: "Structured analysis failed safely.",
      correlationId: "correlation-fixture-1",
      cause: new Error("access_token=unsafe")
    });

    const serialized = JSON.stringify(error);

    expect(serialized).toContain("Structured analysis failed safely.");
    expect(serialized).not.toContain("access_token=unsafe");
    expect(serialized).not.toContain("stack");
    expect(serialized).not.toContain("cause");
  });
});

