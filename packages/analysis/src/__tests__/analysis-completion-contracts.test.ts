import { describe, expect, it } from "vitest";
import {
  STRUCTURED_ANALYSIS_CONFIDENCE_LEVELS,
  STRUCTURED_ANALYSIS_ERROR_CATEGORIES,
  STRUCTURED_ANALYSIS_ERROR_CODES,
  STRUCTURED_ANALYSIS_EVENT_NAMES,
  STRUCTURED_ANALYSIS_EVIDENCE_KINDS,
  STRUCTURED_ANALYSIS_OUTPUT_STATUSES,
  STRUCTURED_ANALYSIS_PROVENANCE_BOUNDARIES,
  STRUCTURED_ANALYSIS_RESULT_STATUSES,
  STRUCTURED_ANALYSIS_SCHEMA_VALIDATION_MODES,
  STRUCTURED_ANALYSIS_VALIDATION_ISSUE_CODES,
  STRUCTURED_ANALYSIS_VALUE_KINDS,
  StructuredAnalysisError,
  type StructuredAnalysisConfidenceSummary,
  type StructuredAnalysisEventEnvelope,
  type StructuredAnalysisEvidenceId,
  type StructuredAnalysisEvidenceReference,
  type StructuredAnalysisFieldPath,
  type StructuredAnalysisId,
  type StructuredAnalysisOutput,
  type StructuredAnalysisProvenance,
  type StructuredAnalysisResult,
  type StructuredAnalysisSchemaContract,
  type StructuredAnalysisSchemaId,
  type StructuredAnalysisTimestamp,
  type StructuredAnalysisValidationResult,
  type StructuredAnalysisVersion
} from "../index.js";
import type { StructuredOutputContract } from "@opportunity-os/llm-analysis";
import type { RawContentProvenance } from "@opportunity-os/raw-content";

const timestamp = "2026-01-01T00:00:00.000Z" as StructuredAnalysisTimestamp;
const analysisId = "analysis-1" as StructuredAnalysisId;

const sourceContract: StructuredOutputContract = {
  schemaName: "SyntheticStructuredOutput",
  schemaVersion: "1.0.0",
  fields: [
    {
      name: "summary",
      kind: "string",
      required: true,
      validationMetadata: {}
    }
  ],
  requiredFields: ["summary"],
  optionalFields: [],
  validationMetadata: {
    allowAdditionalFields: false,
    issueCodes: []
  }
};

const schema: StructuredAnalysisSchemaContract = {
  id: "structured-analysis-schema.synthetic" as StructuredAnalysisSchemaId,
  name: "Synthetic Structured Analysis",
  version: "1.0.0" as StructuredAnalysisVersion,
  sourceContract,
  fields: [
    {
      name: "summary",
      kind: "string",
      required: true,
      validationMetadata: {},
      path: "summary",
      acceptedKinds: [STRUCTURED_ANALYSIS_VALUE_KINDS.string]
    }
  ],
  requiredFieldPaths: ["summary"],
  optionalFieldPaths: [],
  validationMode: STRUCTURED_ANALYSIS_SCHEMA_VALIDATION_MODES.strict
};

const provenance = {
  source: {
    platform: "reddit",
    objectKind: "post",
    objectId: "source-1",
    collectedAt: timestamp,
    safeProviderMetadata: {
      kind: "safe-provider-metadata",
      redacted: true,
      source: "reddit"
    }
  },
  ingestion: {
    ingestionId: "ingestion-1",
    collectedAt: timestamp,
    correlationId: "correlation-1",
    connector: {
      connectorId: "reddit",
      connectorName: "Reddit",
      connectorVersion: "1.0.0"
    }
  },
  providerReference: {
    platform: "reddit",
    objectId: "source-1"
  },
  collectedThrough: "reddit-provider-transport",
  transformBoundary: "raw-content-contract",
  recordedAt: timestamp
} as const satisfies RawContentProvenance;

const confidence: StructuredAnalysisConfidenceSummary = {
  overall: {
    level: STRUCTURED_ANALYSIS_CONFIDENCE_LEVELS.high,
    score: 0.93 as never
  },
  fields: [
    {
      level: STRUCTURED_ANALYSIS_CONFIDENCE_LEVELS.high,
      fieldPath: "summary" as StructuredAnalysisFieldPath,
      rationale: "Synthetic fixture value is present."
    }
  ]
};

const evidence: StructuredAnalysisEvidenceReference = {
  evidenceId: "evidence-1" as StructuredAnalysisEvidenceId,
  analysisId,
  kind: STRUCTURED_ANALYSIS_EVIDENCE_KINDS.structuredField,
  fieldPath: "summary" as StructuredAnalysisFieldPath,
  value: "Synthetic structured analysis.",
  confidence: confidence.fields[0],
  provenance,
  safeMetadata: {
    fixture: true
  }
};

const output: StructuredAnalysisOutput = {
  analysisId,
  version: "1.0.0" as StructuredAnalysisVersion,
  status: STRUCTURED_ANALYSIS_OUTPUT_STATUSES.accepted,
  values: {
    summary: "Synthetic structured analysis."
  },
  metadata: {
    schema,
    producedAt: timestamp,
    warnings: []
  }
};

describe("structured analysis completion contracts", () => {
  it("defines evidence, confidence, and provenance contracts", () => {
    const analysisProvenance: StructuredAnalysisProvenance = {
      analysisId,
      source: provenance,
      boundary: STRUCTURED_ANALYSIS_PROVENANCE_BOUNDARIES.structuredAnalysisContract,
      evidence: [evidence],
      recordedAt: timestamp,
      safeMetadata: {
        fixture: true
      }
    };

    expect(evidence.kind).toBe("structured-field");
    expect(confidence.overall.level).toBe("high");
    expect(analysisProvenance.evidence).toHaveLength(1);
  });

  it("defines validation and result contracts", () => {
    const validationFailure: StructuredAnalysisValidationResult = {
      valid: false,
      issues: [
        {
          code: STRUCTURED_ANALYSIS_VALIDATION_ISSUE_CODES.missingRequiredField,
          message: "Required field is missing.",
          path: "summary" as StructuredAnalysisFieldPath
        }
      ]
    };

    const result: StructuredAnalysisResult = {
      status: STRUCTURED_ANALYSIS_RESULT_STATUSES.validationFailure,
      issues: validationFailure.issues,
      error: {
        code: STRUCTURED_ANALYSIS_ERROR_CODES.validationFailed,
        category: STRUCTURED_ANALYSIS_ERROR_CATEGORIES.validation,
        message: "Structured analysis validation failed.",
        correlationId: "correlation-1",
        issues: validationFailure.issues
      }
    };

    expect(validationFailure.valid).toBe(false);
    expect(result.status).toBe("validation-failure");
  });

  it("defines successful results and event envelopes", () => {
    const analysisProvenance: StructuredAnalysisProvenance = {
      analysisId,
      source: provenance,
      boundary: STRUCTURED_ANALYSIS_PROVENANCE_BOUNDARIES.normalizedStructuredOutput,
      evidence: [evidence],
      recordedAt: timestamp
    };

    const result: StructuredAnalysisResult = {
      status: STRUCTURED_ANALYSIS_RESULT_STATUSES.success,
      output,
      evidence: [evidence],
      confidence,
      provenance: analysisProvenance
    };

    const event: StructuredAnalysisEventEnvelope = {
      metadata: {
        eventId: "event-1",
        eventName: STRUCTURED_ANALYSIS_EVENT_NAMES.completed,
        category: "infrastructure",
        version: "v1",
        timestamp,
        source: "@opportunity-os/analysis",
        correlationId: "correlation-1"
      },
      payload: {
        analysisId,
        status: result.status,
        safeMetadata: {
          fixture: true
        }
      }
    };

    expect(result.status).toBe("success");
    expect(event.payload.status).toBe("success");
  });

  it("serializes errors without unsafe implementation details", () => {
    const error = new StructuredAnalysisError({
      code: STRUCTURED_ANALYSIS_ERROR_CODES.unsafeStructuredOutput,
      category: STRUCTURED_ANALYSIS_ERROR_CATEGORIES.safety,
      message: "Structured analysis output is unsafe.",
      correlationId: "correlation-1",
      requestId: "request-1",
      cause: new Error("secret-token-should-not-appear"),
      safeMetadata: {
        redacted: true
      }
    });

    const serialized = JSON.stringify(error);

    expect(error.toSafeDetails()).toEqual({
      code: STRUCTURED_ANALYSIS_ERROR_CODES.unsafeStructuredOutput,
      category: STRUCTURED_ANALYSIS_ERROR_CATEGORIES.safety,
      message: "Structured analysis output is unsafe.",
      correlationId: "correlation-1",
      requestId: "request-1",
      safeMetadata: {
        redacted: true
      }
    });
    expect(serialized).not.toContain("secret-token-should-not-appear");
    expect(serialized).not.toContain("stack");
  });
});
