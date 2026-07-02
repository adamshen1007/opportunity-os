import { describe, expect, it } from "vitest";
import {
  STRUCTURED_ANALYSIS_NORMALIZATION_STAGES,
  STRUCTURED_ANALYSIS_OUTPUT_STATUSES,
  STRUCTURED_ANALYSIS_PARSE_STATUSES,
  STRUCTURED_ANALYSIS_SCHEMA_VALIDATION_MODES,
  STRUCTURED_ANALYSIS_VALUE_KINDS,
  type StructuredAnalysisFieldPath,
  type StructuredAnalysisId,
  type StructuredAnalysisInput,
  type StructuredAnalysisNormalizationInput,
  type StructuredAnalysisNormalizationResult,
  type StructuredAnalysisOutput,
  type StructuredAnalysisParserContract,
  type StructuredAnalysisParserId,
  type StructuredAnalysisSchemaContract,
  type StructuredAnalysisSchemaId,
  type StructuredAnalysisTimestamp,
  type StructuredAnalysisVersion
} from "../index.js";
import type { StructuredOutputContract } from "@opportunity-os/llm-analysis";
import type { NormalizationOutput } from "@opportunity-os/normalization";
import type { RawContentProvenance } from "@opportunity-os/raw-content";

const timestamp = "2026-01-01T00:00:00.000Z" as StructuredAnalysisTimestamp;

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
      source: "reddit",
      redacted: true
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

const normalizedContent = {
  canonicalText: {
    text: "Synthetic normalized content.",
    language: "en",
    segments: []
  },
  provenance,
  stages: [],
  sourceEnvelope: {
    kind: "raw-content-envelope"
  },
  safeMetadata: {
    fixture: true
  }
} as unknown as NormalizationOutput;

describe("structured analysis model contracts", () => {
  it("defines stable primitive vocabularies", () => {
    expect(STRUCTURED_ANALYSIS_VALUE_KINDS).toEqual({
      string: "string",
      number: "number",
      boolean: "boolean",
      object: "object",
      array: "array",
      null: "null"
    });
    expect(STRUCTURED_ANALYSIS_SCHEMA_VALIDATION_MODES.strict).toBe("strict");
  });

  it("defines analysis input and output contracts", () => {
    const input: StructuredAnalysisInput = {
      analysisId: "analysis-1" as StructuredAnalysisId,
      version: "1.0.0" as StructuredAnalysisVersion,
      source: {
        normalizedContent,
        embeddingReferences: [],
        provenance,
        safeMetadata: {
          fixture: true
        }
      },
      targetSchema: sourceContract,
      values: {
        summary: "Synthetic structured analysis."
      }
    };

    const output: StructuredAnalysisOutput = {
      analysisId: input.analysisId,
      version: input.version,
      status: STRUCTURED_ANALYSIS_OUTPUT_STATUSES.accepted,
      values: input.values,
      metadata: {
        schema,
        producedAt: timestamp,
        warnings: []
      }
    };

    expect(input.source.embeddingReferences).toEqual([]);
    expect(output.status).toBe("accepted");
    expect(output.metadata.schema.requiredFieldPaths).toEqual(["summary"]);
  });

  it("defines parser and normalization boundary contracts without runtime coupling", () => {
    const parser: StructuredAnalysisParserContract = {
      id: "parser.synthetic" as StructuredAnalysisParserId,
      version: "1.0.0" as StructuredAnalysisVersion,
      parse: () => ({
        status: STRUCTURED_ANALYSIS_PARSE_STATUSES.invalid,
        issues: [
          {
            path: "summary" as StructuredAnalysisFieldPath,
            code: "missing-required-field",
            message: "Required field is missing."
          }
        ]
      })
    };

    const normalizationInput: StructuredAnalysisNormalizationInput = {
      input: {
        analysisId: "analysis-1" as StructuredAnalysisId,
        version: "1.0.0" as StructuredAnalysisVersion,
        source: {
          normalizedContent,
          embeddingReferences: [],
          provenance
        },
        targetSchema: sourceContract,
        values: {
          summary: "Synthetic structured analysis."
        }
      },
      schema,
      candidateValues: {
        summary: "Synthetic structured analysis."
      }
    };

    const normalizationResult: StructuredAnalysisNormalizationResult = {
      output: {
        analysisId: normalizationInput.input.analysisId,
        version: normalizationInput.input.version,
        status: STRUCTURED_ANALYSIS_OUTPUT_STATUSES.normalized,
        values: normalizationInput.candidateValues,
        metadata: {
          schema,
          producedAt: timestamp,
          warnings: []
        }
      },
      appliedRules: [
        {
          fieldPath: "summary" as StructuredAnalysisFieldPath,
          stage: STRUCTURED_ANALYSIS_NORMALIZATION_STAGES.fieldSelection,
          description: "Select approved schema field."
        }
      ]
    };

    expect(parser.parse({ rawOutput: {}, schema: sourceContract }).status).toBe("invalid");
    expect(normalizationResult.appliedRules[0]?.stage).toBe("field-selection");
  });
});
