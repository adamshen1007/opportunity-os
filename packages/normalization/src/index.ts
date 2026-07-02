/**
 * Normalization Pipeline Foundation public export boundary.
 *
 * Phase 2 Milestone 17 defines the normalization package boundary only.
 */
export const NORMALIZATION_PACKAGE_NAME = "@opportunity-os/normalization" as const;

export const NORMALIZATION_FOUNDATION_PHASE = "phase-2-milestone-17" as const;

export type NormalizationPackageBoundary = {
  readonly packageName: typeof NORMALIZATION_PACKAGE_NAME;
  readonly phase: typeof NORMALIZATION_FOUNDATION_PHASE;
  readonly ownership: "normalization-pipeline-foundation";
};

export {
  TEXT_CHUNK_STRATEGIES
} from "./chunking/index.js";
export type {
  TextChunk,
  TextChunkId,
  TextChunkStrategy,
  TextChunkingContract,
  TextChunkingOptions
} from "./chunking/index.js";
export {
  HTML_CLEANING_RULES,
  MARKDOWN_CLEANING_RULES,
  UNICODE_NORMALIZATION_FORMS,
  URL_NORMALIZATION_RULES,
  WHITESPACE_NORMALIZATION_RULES
} from "./cleaning/index.js";
export type {
  CleaningContractInput,
  CleaningContractOutput,
  CleaningIssue,
  CleaningIssueSeverity,
  DeterministicCleaningContract,
  HtmlCleaningContract,
  HtmlCleaningOptions,
  HtmlCleaningRule,
  MarkdownCleaningContract,
  MarkdownCleaningOptions,
  MarkdownCleaningRule,
  UnicodeNormalizationContract,
  UnicodeNormalizationForm,
  UnicodeNormalizationOptions,
  UrlNormalizationContract,
  UrlNormalizationOptions,
  UrlNormalizationRule,
  WhitespaceNormalizationContract,
  WhitespaceNormalizationOptions,
  WhitespaceNormalizationRule
} from "./cleaning/index.js";
export {
  NORMALIZATION_EVENT_NAMES
} from "./events/index.js";
export type {
  NormalizationCompletedPayload,
  NormalizationEventEnvelope,
  NormalizationEventName,
  NormalizationEventPayload,
  NormalizationRejectedPayload,
  NormalizationRequestedPayload
} from "./events/index.js";
export {
  NORMALIZATION_FIXTURE_IDS,
  NORMALIZATION_FIXTURE_TIMESTAMP,
  normalizationFixtureCanonicalText,
  normalizationFixtureChunking,
  normalizationFixtureInput,
  normalizationFixtureLanguageDetection,
  normalizationFixtureMetadataPreservation,
  normalizationFixtureOutput,
  normalizationFixtureProvenancePreservation,
  normalizationFixtureRequestedEvent,
  normalizationFixtureResult
} from "./fixtures/index.js";
export {
  LANGUAGE_CONFIDENCE_LEVELS,
  LANGUAGE_DETECTION_METHODS
} from "./language/index.js";
export type {
  DetectedLanguage,
  LanguageConfidenceLevel,
  LanguageDetectionContract,
  LanguageDetectionMethod,
  LanguageTag
} from "./language/index.js";
export {
  NORMALIZATION_STAGES
} from "./pipeline/index.js";
export type {
  NormalizationInput,
  NormalizationOperationContract,
  NormalizationOperationName,
  NormalizationOutput,
  NormalizationStage,
  NormalizationStageRecord,
  NormalizationStageStatus
} from "./pipeline/index.js";
export {
  METADATA_PRESERVATION_POLICIES,
  PROVENANCE_PRESERVATION_POLICIES
} from "./preservation/index.js";
export type {
  MetadataPreservationContract,
  MetadataPreservationPolicy,
  MetadataPreservationRecord,
  NormalizationProvenance,
  ProvenancePreservationContract,
  ProvenancePreservationPolicy,
  ProvenancePreservationRecord
} from "./preservation/index.js";
export {
  NORMALIZATION_RESULT_STATUSES
} from "./results/index.js";
export type {
  NormalizationFailure,
  NormalizationFailureResult,
  NormalizationResult,
  NormalizationResultStatus,
  NormalizationSuccess
} from "./results/index.js";
export {
  CANONICAL_TEXT_VERSION
} from "./text/index.js";
export type {
  CanonicalText,
  CanonicalTextFormat,
  CanonicalTextId,
  TextCharacterRange,
  TextSegment,
  TextSegmentId
} from "./text/index.js";
export {
  NORMALIZATION_VALIDATION_ISSUE_CODES
} from "./validation/index.js";
export type {
  NormalizationValidationContract,
  NormalizationValidationFailure,
  NormalizationValidationIssue,
  NormalizationValidationIssueCode,
  NormalizationValidationResult,
  NormalizationValidationSuccess
} from "./validation/index.js";
