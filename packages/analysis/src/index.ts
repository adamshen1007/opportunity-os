/**
 * Structured Analysis Foundation public export boundary.
 *
 * Phase 2 Milestone 20 defines the Structured Analysis package boundary only.
 */
export const ANALYSIS_PACKAGE_NAME = "@opportunity-os/analysis" as const;

export const STRUCTURED_ANALYSIS_FOUNDATION_PHASE = "phase-2-milestone-20" as const;

export type AnalysisPackageBoundary = {
  readonly packageName: typeof ANALYSIS_PACKAGE_NAME;
  readonly phase: typeof STRUCTURED_ANALYSIS_FOUNDATION_PHASE;
  readonly ownership: "structured-analysis-foundation";
};

export {
  STRUCTURED_ANALYSIS_NORMALIZATION_STAGES,
  STRUCTURED_ANALYSIS_OUTPUT_STATUSES,
  STRUCTURED_ANALYSIS_PARSE_STATUSES,
  STRUCTURED_ANALYSIS_SCHEMA_VALIDATION_MODES,
  STRUCTURED_ANALYSIS_VALUE_KINDS
} from "./analysis/index.js";
export type {
  StructuredAnalysisFieldPath,
  StructuredAnalysisId,
  StructuredAnalysisInput,
  StructuredAnalysisInputSource,
  StructuredAnalysisNormalizationInput,
  StructuredAnalysisNormalizationResult,
  StructuredAnalysisNormalizationRule,
  StructuredAnalysisNormalizationStage,
  StructuredAnalysisOutput,
  StructuredAnalysisOutputMetadata,
  StructuredAnalysisOutputStatus,
  StructuredAnalysisParseInput,
  StructuredAnalysisParseIssue,
  StructuredAnalysisParseResult,
  StructuredAnalysisParseStatus,
  StructuredAnalysisParserContract,
  StructuredAnalysisParserId,
  StructuredAnalysisPrimitiveValue,
  StructuredAnalysisSchemaContract,
  StructuredAnalysisSchemaField,
  StructuredAnalysisSchemaId,
  StructuredAnalysisSchemaValidationMode,
  StructuredAnalysisTimestamp,
  StructuredAnalysisValueKind,
  StructuredAnalysisVersion
} from "./analysis/index.js";
export {
  STRUCTURED_ANALYSIS_CONFIDENCE_LEVELS
} from "./confidence/index.js";
export type {
  StructuredAnalysisConfidence,
  StructuredAnalysisConfidenceLevel,
  StructuredAnalysisConfidenceScore,
  StructuredAnalysisConfidenceSummary
} from "./confidence/index.js";
export {
  STRUCTURED_ANALYSIS_ERROR_CATEGORIES,
  STRUCTURED_ANALYSIS_ERROR_CODES,
  StructuredAnalysisError
} from "./errors/index.js";
export type {
  StructuredAnalysisErrorCategory,
  StructuredAnalysisErrorCode,
  StructuredAnalysisErrorOptions,
  StructuredAnalysisErrorSafeDetails
} from "./errors/index.js";
export {
  STRUCTURED_ANALYSIS_EVENT_NAMES
} from "./events/index.js";
export type {
  StructuredAnalysisEventEnvelope,
  StructuredAnalysisEventName,
  StructuredAnalysisEventPayload
} from "./events/index.js";
export {
  STRUCTURED_ANALYSIS_FIXTURE_IDS,
  STRUCTURED_ANALYSIS_FIXTURE_TIMESTAMP,
  structuredAnalysisFixtureCompletedEvent,
  structuredAnalysisFixtureConfidence,
  structuredAnalysisFixtureEvidence,
  structuredAnalysisFixtureInput,
  structuredAnalysisFixtureNormalizationInput,
  structuredAnalysisFixtureNormalizationResult,
  structuredAnalysisFixtureNormalizedOutput,
  structuredAnalysisFixtureOutput,
  structuredAnalysisFixtureProvenance,
  structuredAnalysisFixtureRawProvenance,
  structuredAnalysisFixtureResult,
  structuredAnalysisFixtureSchema,
  structuredAnalysisFixtureSourceContract,
  structuredAnalysisFixtureValidationFailure,
  structuredAnalysisFixtureValidationSuccess
} from "./fixtures/index.js";
export {
  STRUCTURED_ANALYSIS_EVIDENCE_KINDS
} from "./evidence/index.js";
export type {
  StructuredAnalysisEvidenceId,
  StructuredAnalysisEvidenceKind,
  StructuredAnalysisEvidenceReference
} from "./evidence/index.js";
export {
  STRUCTURED_ANALYSIS_PROVENANCE_BOUNDARIES
} from "./provenance/index.js";
export type {
  StructuredAnalysisProvenance,
  StructuredAnalysisProvenanceBoundary
} from "./provenance/index.js";
export {
  STRUCTURED_ANALYSIS_RESULT_STATUSES
} from "./results/index.js";
export type {
  StructuredAnalysisResult,
  StructuredAnalysisResultFailure,
  StructuredAnalysisResultStatus,
  StructuredAnalysisResultSuccess
} from "./results/index.js";
export {
  STRUCTURED_ANALYSIS_VALIDATION_ISSUE_CODES
} from "./validation/index.js";
export type {
  StructuredAnalysisValidationFailure,
  StructuredAnalysisValidationIssue,
  StructuredAnalysisValidationIssueCode,
  StructuredAnalysisValidationResult,
  StructuredAnalysisValidationSuccess
} from "./validation/index.js";
