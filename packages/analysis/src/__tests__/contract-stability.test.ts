import { describe, expect, it } from "vitest";
import {
  STRUCTURED_ANALYSIS_CONFIDENCE_LEVELS,
  STRUCTURED_ANALYSIS_ERROR_CATEGORIES,
  STRUCTURED_ANALYSIS_ERROR_CODES,
  STRUCTURED_ANALYSIS_EVENT_NAMES,
  STRUCTURED_ANALYSIS_EVIDENCE_KINDS,
  STRUCTURED_ANALYSIS_NORMALIZATION_STAGES,
  STRUCTURED_ANALYSIS_OUTPUT_STATUSES,
  STRUCTURED_ANALYSIS_PARSE_STATUSES,
  STRUCTURED_ANALYSIS_PROVENANCE_BOUNDARIES,
  STRUCTURED_ANALYSIS_RESULT_STATUSES,
  STRUCTURED_ANALYSIS_SCHEMA_VALIDATION_MODES,
  STRUCTURED_ANALYSIS_VALIDATION_ISSUE_CODES,
  STRUCTURED_ANALYSIS_VALUE_KINDS,
  structuredAnalysisFixtureCompletedEvent,
  structuredAnalysisFixtureOutput,
  structuredAnalysisFixtureResult
} from "../index.js";

describe("structured analysis contract stability", () => {
  it("locks public vocabulary constants", () => {
    expect(STRUCTURED_ANALYSIS_VALUE_KINDS).toEqual({
      string: "string",
      number: "number",
      boolean: "boolean",
      object: "object",
      array: "array",
      null: "null"
    });
    expect(STRUCTURED_ANALYSIS_OUTPUT_STATUSES).toEqual({
      accepted: "accepted",
      rejected: "rejected",
      normalized: "normalized"
    });
    expect(STRUCTURED_ANALYSIS_PARSE_STATUSES).toEqual({
      parsed: "parsed",
      invalid: "invalid"
    });
    expect(STRUCTURED_ANALYSIS_SCHEMA_VALIDATION_MODES).toEqual({
      strict: "strict",
      passthrough: "passthrough"
    });
    expect(STRUCTURED_ANALYSIS_NORMALIZATION_STAGES).toEqual({
      fieldSelection: "field-selection",
      valueCoercion: "value-coercion",
      metadataPreservation: "metadata-preservation"
    });
    expect(STRUCTURED_ANALYSIS_EVIDENCE_KINDS).toEqual({
      sourceExcerpt: "source-excerpt",
      normalizedSegment: "normalized-segment",
      embeddingReference: "embedding-reference",
      structuredField: "structured-field"
    });
    expect(STRUCTURED_ANALYSIS_CONFIDENCE_LEVELS).toEqual({
      low: "low",
      medium: "medium",
      high: "high",
      unknown: "unknown"
    });
    expect(STRUCTURED_ANALYSIS_PROVENANCE_BOUNDARIES).toEqual({
      llmOutput: "llm-output",
      structuredAnalysisContract: "structured-analysis-contract",
      normalizedStructuredOutput: "normalized-structured-output"
    });
    expect(STRUCTURED_ANALYSIS_VALIDATION_ISSUE_CODES).toEqual({
      missingRequiredField: "structured-analysis.missing_required_field",
      invalidFieldKind: "structured-analysis.invalid_field_kind",
      schemaMismatch: "structured-analysis.schema_mismatch",
      unsafeMetadata: "structured-analysis.unsafe_metadata",
      invalidEvidence: "structured-analysis.invalid_evidence",
      invalidConfidence: "structured-analysis.invalid_confidence"
    });
    expect(STRUCTURED_ANALYSIS_RESULT_STATUSES).toEqual({
      success: "success",
      validationFailure: "validation-failure",
      unsafeOutput: "unsafe-output",
      failed: "failed"
    });
    expect(STRUCTURED_ANALYSIS_ERROR_CODES).toEqual({
      validationFailed: "structured-analysis.validation_failed",
      unsafeStructuredOutput: "structured-analysis.unsafe_structured_output",
      schemaMismatch: "structured-analysis.schema_mismatch",
      internalFailure: "structured-analysis.internal_failure"
    });
    expect(STRUCTURED_ANALYSIS_ERROR_CATEGORIES).toEqual({
      validation: "validation",
      safety: "safety",
      infrastructure: "infrastructure",
      internal: "internal"
    });
    expect(STRUCTURED_ANALYSIS_EVENT_NAMES).toEqual({
      validated: "structured-analysis.validated",
      normalized: "structured-analysis.normalized",
      completed: "structured-analysis.completed",
      failed: "structured-analysis.failed"
    });
  });

  it("locks representative output, result, and event shapes", () => {
    expect(Object.keys(structuredAnalysisFixtureOutput).sort()).toEqual([
      "analysisId",
      "metadata",
      "status",
      "values",
      "version"
    ]);
    expect(Object.keys(structuredAnalysisFixtureResult).sort()).toEqual([
      "confidence",
      "evidence",
      "output",
      "provenance",
      "status"
    ]);
    expect(Object.keys(structuredAnalysisFixtureCompletedEvent.metadata).sort()).toEqual([
      "category",
      "correlationId",
      "eventId",
      "eventName",
      "source",
      "timestamp",
      "version"
    ]);
  });
});

