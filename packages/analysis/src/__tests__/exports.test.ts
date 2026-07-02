import { describe, expect, it } from "vitest";
import {
  ANALYSIS_PACKAGE_NAME,
  STRUCTURED_ANALYSIS_FOUNDATION_PHASE,
  STRUCTURED_ANALYSIS_FIXTURE_IDS,
  STRUCTURED_ANALYSIS_CONFIDENCE_LEVELS,
  STRUCTURED_ANALYSIS_ERROR_CODES,
  STRUCTURED_ANALYSIS_EVENT_NAMES,
  STRUCTURED_ANALYSIS_EVIDENCE_KINDS,
  STRUCTURED_ANALYSIS_OUTPUT_STATUSES,
  STRUCTURED_ANALYSIS_PARSE_STATUSES,
  STRUCTURED_ANALYSIS_PROVENANCE_BOUNDARIES,
  STRUCTURED_ANALYSIS_RESULT_STATUSES,
  STRUCTURED_ANALYSIS_SCHEMA_VALIDATION_MODES,
  STRUCTURED_ANALYSIS_VALIDATION_ISSUE_CODES,
  STRUCTURED_ANALYSIS_VALUE_KINDS
} from "../index.js";

describe("analysis public exports", () => {
  it("routes approved structured analysis contracts through the package root", () => {
    expect(ANALYSIS_PACKAGE_NAME).toBe("@opportunity-os/analysis");
    expect(STRUCTURED_ANALYSIS_FOUNDATION_PHASE).toBe("phase-2-milestone-20");
    expect(STRUCTURED_ANALYSIS_FIXTURE_IDS.analysisId).toBe("analysis-fixture-1");
    expect(STRUCTURED_ANALYSIS_OUTPUT_STATUSES.accepted).toBe("accepted");
    expect(STRUCTURED_ANALYSIS_PARSE_STATUSES.parsed).toBe("parsed");
    expect(STRUCTURED_ANALYSIS_SCHEMA_VALIDATION_MODES.passthrough).toBe("passthrough");
    expect(STRUCTURED_ANALYSIS_VALUE_KINDS.object).toBe("object");
    expect(STRUCTURED_ANALYSIS_EVIDENCE_KINDS.structuredField).toBe("structured-field");
    expect(STRUCTURED_ANALYSIS_CONFIDENCE_LEVELS.high).toBe("high");
    expect(STRUCTURED_ANALYSIS_PROVENANCE_BOUNDARIES.structuredAnalysisContract).toBe("structured-analysis-contract");
    expect(STRUCTURED_ANALYSIS_VALIDATION_ISSUE_CODES.schemaMismatch).toBe("structured-analysis.schema_mismatch");
    expect(STRUCTURED_ANALYSIS_RESULT_STATUSES.success).toBe("success");
    expect(STRUCTURED_ANALYSIS_ERROR_CODES.validationFailed).toBe("structured-analysis.validation_failed");
    expect(STRUCTURED_ANALYSIS_EVENT_NAMES.completed).toBe("structured-analysis.completed");
  });
});
