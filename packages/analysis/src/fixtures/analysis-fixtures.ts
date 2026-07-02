import type { StructuredOutputContract } from "@opportunity-os/llm-analysis";
import type { NormalizationOutput } from "@opportunity-os/normalization";
import type { RawContentProvenance } from "@opportunity-os/raw-content";
import {
  STRUCTURED_ANALYSIS_NORMALIZATION_STAGES,
  STRUCTURED_ANALYSIS_OUTPUT_STATUSES,
  STRUCTURED_ANALYSIS_SCHEMA_VALIDATION_MODES,
  STRUCTURED_ANALYSIS_VALUE_KINDS,
  type StructuredAnalysisFieldPath,
  type StructuredAnalysisId,
  type StructuredAnalysisInput,
  type StructuredAnalysisNormalizationInput,
  type StructuredAnalysisNormalizationResult,
  type StructuredAnalysisOutput,
  type StructuredAnalysisSchemaContract,
  type StructuredAnalysisSchemaId,
  type StructuredAnalysisTimestamp,
  type StructuredAnalysisVersion
} from "../analysis/index.js";
import {
  STRUCTURED_ANALYSIS_CONFIDENCE_LEVELS,
  type StructuredAnalysisConfidenceScore,
  type StructuredAnalysisConfidenceSummary
} from "../confidence/index.js";
import {
  STRUCTURED_ANALYSIS_EVENT_NAMES,
  type StructuredAnalysisEventEnvelope
} from "../events/index.js";
import {
  STRUCTURED_ANALYSIS_EVIDENCE_KINDS,
  type StructuredAnalysisEvidenceId,
  type StructuredAnalysisEvidenceReference
} from "../evidence/index.js";
import {
  STRUCTURED_ANALYSIS_PROVENANCE_BOUNDARIES,
  type StructuredAnalysisProvenance
} from "../provenance/index.js";
import {
  STRUCTURED_ANALYSIS_RESULT_STATUSES,
  type StructuredAnalysisResult
} from "../results/index.js";
import {
  STRUCTURED_ANALYSIS_VALIDATION_ISSUE_CODES,
  type StructuredAnalysisValidationResult
} from "../validation/index.js";

export const STRUCTURED_ANALYSIS_FIXTURE_TIMESTAMP =
  "2026-01-01T00:00:00.000Z" as StructuredAnalysisTimestamp;

export const STRUCTURED_ANALYSIS_FIXTURE_IDS = {
  analysisId: "analysis-fixture-1" as StructuredAnalysisId,
  schemaId: "structured-analysis-schema.fixture" as StructuredAnalysisSchemaId,
  evidenceId: "evidence-fixture-1" as StructuredAnalysisEvidenceId
} as const;

export const structuredAnalysisFixtureSourceContract: StructuredOutputContract = {
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

export const structuredAnalysisFixtureSchema: StructuredAnalysisSchemaContract = {
  id: STRUCTURED_ANALYSIS_FIXTURE_IDS.schemaId,
  name: "Synthetic Structured Analysis",
  version: "1.0.0" as StructuredAnalysisVersion,
  sourceContract: structuredAnalysisFixtureSourceContract,
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

export const structuredAnalysisFixtureRawProvenance = {
  source: {
    platform: "reddit",
    objectKind: "post",
    objectId: "synthetic-source-1",
    collectedAt: STRUCTURED_ANALYSIS_FIXTURE_TIMESTAMP,
    safeProviderMetadata: {
      kind: "safe-provider-metadata",
      redacted: true,
      source: "reddit"
    }
  },
  ingestion: {
    ingestionId: "synthetic-ingestion-1",
    collectedAt: STRUCTURED_ANALYSIS_FIXTURE_TIMESTAMP,
    correlationId: "correlation-fixture-1",
    connector: {
      connectorId: "synthetic-connector",
      connectorName: "Synthetic Connector",
      connectorVersion: "1.0.0"
    }
  },
  providerReference: {
    platform: "reddit",
    objectId: "synthetic-source-1"
  },
  collectedThrough: "reddit-provider-transport",
  transformBoundary: "raw-content-contract",
  recordedAt: STRUCTURED_ANALYSIS_FIXTURE_TIMESTAMP,
  safeMetadata: {
    fixture: true
  }
} as const satisfies RawContentProvenance;

export const structuredAnalysisFixtureNormalizedOutput = {
  canonicalText: {
    text: "Synthetic normalized content.",
    language: "en",
    segments: []
  },
  provenance: structuredAnalysisFixtureRawProvenance,
  stages: [],
  sourceEnvelope: {
    kind: "raw-content-envelope"
  },
  safeMetadata: {
    fixture: true
  }
} as unknown as NormalizationOutput;

export const structuredAnalysisFixtureInput: StructuredAnalysisInput = {
  analysisId: STRUCTURED_ANALYSIS_FIXTURE_IDS.analysisId,
  version: "1.0.0" as StructuredAnalysisVersion,
  source: {
    normalizedContent: structuredAnalysisFixtureNormalizedOutput,
    embeddingReferences: [],
    provenance: structuredAnalysisFixtureRawProvenance,
    safeMetadata: {
      fixture: true
    }
  },
  targetSchema: structuredAnalysisFixtureSourceContract,
  values: {
    summary: "Synthetic structured analysis."
  }
};

export const structuredAnalysisFixtureOutput: StructuredAnalysisOutput = {
  analysisId: STRUCTURED_ANALYSIS_FIXTURE_IDS.analysisId,
  version: "1.0.0" as StructuredAnalysisVersion,
  status: STRUCTURED_ANALYSIS_OUTPUT_STATUSES.accepted,
  values: structuredAnalysisFixtureInput.values,
  metadata: {
    schema: structuredAnalysisFixtureSchema,
    producedAt: STRUCTURED_ANALYSIS_FIXTURE_TIMESTAMP,
    warnings: []
  }
};

export const structuredAnalysisFixtureConfidence: StructuredAnalysisConfidenceSummary = {
  overall: {
    level: STRUCTURED_ANALYSIS_CONFIDENCE_LEVELS.high,
    score: 0.93 as StructuredAnalysisConfidenceScore
  },
  fields: [
    {
      level: STRUCTURED_ANALYSIS_CONFIDENCE_LEVELS.high,
      fieldPath: "summary" as StructuredAnalysisFieldPath,
      rationale: "Synthetic field is present."
    }
  ]
};

export const structuredAnalysisFixtureEvidence: StructuredAnalysisEvidenceReference = {
  evidenceId: STRUCTURED_ANALYSIS_FIXTURE_IDS.evidenceId,
  analysisId: STRUCTURED_ANALYSIS_FIXTURE_IDS.analysisId,
  kind: STRUCTURED_ANALYSIS_EVIDENCE_KINDS.structuredField,
  fieldPath: "summary" as StructuredAnalysisFieldPath,
  value: "Synthetic structured analysis.",
  confidence: structuredAnalysisFixtureConfidence.fields[0],
  provenance: structuredAnalysisFixtureRawProvenance,
  safeMetadata: {
    fixture: true
  }
};

export const structuredAnalysisFixtureProvenance: StructuredAnalysisProvenance = {
  analysisId: STRUCTURED_ANALYSIS_FIXTURE_IDS.analysisId,
  source: structuredAnalysisFixtureRawProvenance,
  boundary: STRUCTURED_ANALYSIS_PROVENANCE_BOUNDARIES.structuredAnalysisContract,
  evidence: [structuredAnalysisFixtureEvidence],
  recordedAt: STRUCTURED_ANALYSIS_FIXTURE_TIMESTAMP,
  safeMetadata: {
    fixture: true
  }
};

export const structuredAnalysisFixtureValidationSuccess: StructuredAnalysisValidationResult = {
  valid: true,
  issues: []
};

export const structuredAnalysisFixtureValidationFailure: StructuredAnalysisValidationResult = {
  valid: false,
  issues: [
    {
      code: STRUCTURED_ANALYSIS_VALIDATION_ISSUE_CODES.missingRequiredField,
      message: "Required field is missing.",
      path: "summary" as StructuredAnalysisFieldPath
    }
  ]
};

export const structuredAnalysisFixtureResult: StructuredAnalysisResult = {
  status: STRUCTURED_ANALYSIS_RESULT_STATUSES.success,
  output: structuredAnalysisFixtureOutput,
  evidence: [structuredAnalysisFixtureEvidence],
  confidence: structuredAnalysisFixtureConfidence,
  provenance: structuredAnalysisFixtureProvenance
};

export const structuredAnalysisFixtureNormalizationInput: StructuredAnalysisNormalizationInput = {
  input: structuredAnalysisFixtureInput,
  schema: structuredAnalysisFixtureSchema,
  candidateValues: structuredAnalysisFixtureInput.values
};

export const structuredAnalysisFixtureNormalizationResult: StructuredAnalysisNormalizationResult = {
  output: structuredAnalysisFixtureOutput,
  appliedRules: [
    {
      fieldPath: "summary" as StructuredAnalysisFieldPath,
      stage: STRUCTURED_ANALYSIS_NORMALIZATION_STAGES.fieldSelection,
      description: "Select approved schema field."
    }
  ]
};

export const structuredAnalysisFixtureCompletedEvent: StructuredAnalysisEventEnvelope = {
  metadata: {
    eventId: "event-fixture-1",
    eventName: STRUCTURED_ANALYSIS_EVENT_NAMES.completed,
    category: "infrastructure",
    version: "v1",
    timestamp: STRUCTURED_ANALYSIS_FIXTURE_TIMESTAMP,
    source: "@opportunity-os/analysis",
    correlationId: "correlation-fixture-1"
  },
  payload: {
    analysisId: STRUCTURED_ANALYSIS_FIXTURE_IDS.analysisId,
    status: STRUCTURED_ANALYSIS_RESULT_STATUSES.success,
    safeMetadata: {
      fixture: true
    }
  }
};

