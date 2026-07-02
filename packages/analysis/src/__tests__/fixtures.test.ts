import { describe, expect, it } from "vitest";
import {
  STRUCTURED_ANALYSIS_FIXTURE_IDS,
  structuredAnalysisFixtureCompletedEvent,
  structuredAnalysisFixtureEvidence,
  structuredAnalysisFixtureInput,
  structuredAnalysisFixtureNormalizationResult,
  structuredAnalysisFixtureOutput,
  structuredAnalysisFixtureResult,
  structuredAnalysisFixtureValidationFailure,
  structuredAnalysisFixtureValidationSuccess
} from "../index.js";

describe("structured analysis fixtures", () => {
  it("provides deterministic synthetic fixtures", () => {
    expect(STRUCTURED_ANALYSIS_FIXTURE_IDS.analysisId).toBe("analysis-fixture-1");
    expect(structuredAnalysisFixtureInput.values.summary).toBe("Synthetic structured analysis.");
    expect(structuredAnalysisFixtureOutput.metadata.warnings).toEqual([]);
    expect(structuredAnalysisFixtureEvidence.safeMetadata).toEqual({ fixture: true });
    expect(structuredAnalysisFixtureNormalizationResult.appliedRules).toHaveLength(1);
    expect(structuredAnalysisFixtureCompletedEvent.metadata.timestamp).toBe("2026-01-01T00:00:00.000Z");
  });

  it("provides success and failure shapes without unsafe fixture values", () => {
    expect(structuredAnalysisFixtureResult.status).toBe("success");
    expect(structuredAnalysisFixtureValidationSuccess).toEqual({
      valid: true,
      issues: []
    });
    expect(structuredAnalysisFixtureValidationFailure.valid).toBe(false);

    const serialized = JSON.stringify({
      structuredAnalysisFixtureInput,
      structuredAnalysisFixtureResult,
      structuredAnalysisFixtureValidationFailure
    });

    expect(serialized).not.toMatch(/api[_-]?key|token|authorization|password|secret/iu);
  });
});

