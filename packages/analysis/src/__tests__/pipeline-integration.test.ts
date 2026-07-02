import { describe, expect, it } from "vitest";
import {
  STRUCTURED_ANALYSIS_EVENT_NAMES,
  STRUCTURED_ANALYSIS_NORMALIZATION_STAGES,
  STRUCTURED_ANALYSIS_RESULT_STATUSES,
  structuredAnalysisFixtureCompletedEvent,
  structuredAnalysisFixtureInput,
  structuredAnalysisFixtureNormalizationInput,
  structuredAnalysisFixtureNormalizationResult,
  structuredAnalysisFixtureOutput,
  structuredAnalysisFixtureResult
} from "../index.js";

describe("structured analysis pipeline integration contracts", () => {
  it("connects normalized input, structured output, result, and event contracts", () => {
    expect(structuredAnalysisFixtureInput.source.normalizedContent).toBeDefined();
    expect(structuredAnalysisFixtureNormalizationInput.input.analysisId).toBe(
      structuredAnalysisFixtureInput.analysisId
    );
    expect(structuredAnalysisFixtureNormalizationResult.output).toBe(
      structuredAnalysisFixtureOutput
    );
    expect(structuredAnalysisFixtureNormalizationResult.appliedRules[0]?.stage).toBe(
      STRUCTURED_ANALYSIS_NORMALIZATION_STAGES.fieldSelection
    );
    expect(structuredAnalysisFixtureResult.status).toBe(
      STRUCTURED_ANALYSIS_RESULT_STATUSES.success
    );
    expect(structuredAnalysisFixtureCompletedEvent.metadata.eventName).toBe(
      STRUCTURED_ANALYSIS_EVENT_NAMES.completed
    );
  });
});

