/**
 * Raw Content Pipeline Foundation public export boundary.
 *
 * Phase 2 Milestone 16 defines Raw Content contracts only.
 */
export const RAW_CONTENT_PACKAGE_NAME = "@opportunity-os/raw-content" as const;

export const RAW_CONTENT_FOUNDATION_PHASE = "phase-2-milestone-16" as const;

export type RawContentPackageBoundary = {
  readonly packageName: typeof RAW_CONTENT_PACKAGE_NAME;
  readonly phase: typeof RAW_CONTENT_FOUNDATION_PHASE;
  readonly ownership: "raw-content-contracts";
};

export {
  RAW_CONTENT_DEDUPLICATION_STATUSES,
  RAW_CONTENT_FINGERPRINT_ALGORITHMS
} from "./deduplication/index.js";
export type {
  RawContentDeduplicationDecision,
  RawContentDeduplicationStatus,
  RawContentDuplicateCandidate,
  RawContentFingerprint,
  RawContentFingerprintAlgorithm,
  RawContentFingerprintInput,
  RawContentFingerprintValue
} from "./deduplication/index.js";
export {
  RAW_CONTENT_ENVELOPE_VERSION,
  RAW_CONTENT_KINDS
} from "./content/index.js";
export type {
  RawContentAuthor,
  RawContentAuthorId,
  RawContentAuthorReference,
  RawContentComment,
  RawContentCommentId,
  RawContentCommentReference,
  RawContentCommunity,
  RawContentCommunityId,
  RawContentCommunityReference,
  RawContentCommunityVisibility,
  RawContentEnvelope,
  RawContentItem,
  RawContentKind,
  RawContentPost,
  RawContentPostId,
  RawContentPostReference,
  RawContentSourceMetrics
} from "./content/index.js";
export {
  RAW_CONTENT_EVENT_NAMES
} from "./events/index.js";
export type {
  RawContentDeduplicationDecidedPayload,
  RawContentEventEnvelope,
  RawContentEventName,
  RawContentEventPayload,
  RawContentReceivedPayload,
  RawContentRejectedPayload,
  RawContentValidatedPayload
} from "./events/index.js";
export {
  RAW_CONTENT_ERROR_CODES,
  RawContentError,
  redactRawContentErrorValue
} from "./errors/index.js";
export type {
  RawContentErrorCategory,
  RawContentErrorCode,
  RawContentErrorOptions,
  RawContentSafeErrorDetails
} from "./errors/index.js";
export {
  RAW_CONTENT_FIXTURE_IDS,
  RAW_CONTENT_FIXTURE_TIMESTAMP,
  rawContentFixtureAuthor,
  rawContentFixtureAuthorSource,
  rawContentFixtureComment,
  rawContentFixtureCommentSource,
  rawContentFixtureCommunity,
  rawContentFixtureCommunitySource,
  rawContentFixtureDeduplicationDecision,
  rawContentFixtureFingerprint,
  rawContentFixtureIngestion,
  rawContentFixturePost,
  rawContentFixturePostEnvelope,
  rawContentFixturePostSource,
  rawContentFixtureProvenance,
  rawContentFixtureValidationSuccess
} from "./fixtures/index.js";
export type {
  RawContentConnectorMetadata,
  RawContentIngestionId,
  RawContentIngestionMetadata
} from "./ingestion/index.js";
export {
  REDDIT_RAW_CONTENT_MAPPING_TARGETS
} from "./mapping/index.js";
export type {
  RedditRawContentMappedItem,
  RedditRawContentMappingContext,
  RedditRawContentMappingContract,
  RedditRawContentMappingInput,
  RedditRawContentMappingResult,
  RedditRawContentMappingTarget,
  RedditRawContentSourceInput
} from "./mapping/index.js";
export {
  RAW_CONTENT_NORMALIZATION_BOUNDARY_STAGES
} from "./normalization/index.js";
export type {
  RawContentNormalizationBoundary,
  RawContentNormalizationBoundaryStage,
  RawContentNormalizationInput,
  RawContentNormalizationOutput
} from "./normalization/index.js";
export type {
  RawContentProviderReference,
  RawContentProvenance,
  RawContentProvenanceTransformBoundary
} from "./provenance/index.js";
export {
  RAW_CONTENT_SOURCE_PLATFORMS
} from "./source/index.js";
export type {
  RawContentSafeMetadata,
  RawContentSafeProviderMetadata,
  RawContentSourceMetadata,
  RawContentSourceObjectId,
  RawContentSourceObjectKind,
  RawContentSourcePlatform,
  RawContentSourceUrl,
  RawContentTimestamp
} from "./source/index.js";
export type {
  RawContentStorageLookup,
  RawContentStoragePort,
  RawContentStoragePortResult,
  RawContentStorageRecord
} from "./storage/index.js";
export {
  RAW_CONTENT_VALIDATION_ISSUE_CODES
} from "./validation/index.js";
export type {
  RawContentValidationContract,
  RawContentValidationFailure,
  RawContentValidationIssue,
  RawContentValidationIssueCode,
  RawContentValidationResult,
  RawContentValidationSuccess
} from "./validation/index.js";
