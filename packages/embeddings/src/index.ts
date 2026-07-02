/**
 * Embedding Foundation public export boundary.
 *
 * Phase 2 Milestone 18 defines the embeddings package boundary only.
 */
export const EMBEDDINGS_PACKAGE_NAME = "@opportunity-os/embeddings" as const;

export const EMBEDDINGS_FOUNDATION_PHASE = "phase-2-milestone-18" as const;

export type EmbeddingsPackageBoundary = {
  readonly packageName: typeof EMBEDDINGS_PACKAGE_NAME;
  readonly phase: typeof EMBEDDINGS_FOUNDATION_PHASE;
  readonly ownership: "embedding-foundation";
};

export {
  EMBEDDING_CACHE_ENTRY_STATUSES,
  EMBEDDING_CACHE_LOOKUP_STATUSES
} from "./cache/index.js";
export type {
  EmbeddingCacheEntry,
  EmbeddingCacheEntryStatus,
  EmbeddingCacheKey,
  EmbeddingCacheKeyMetadata,
  EmbeddingCacheLookupResult,
  EmbeddingCacheLookupStatus,
  EmbeddingCachePort,
  EmbeddingCacheStoreResult
} from "./cache/index.js";
export {
  CHUNK_EMBEDDING_RESULT_STATUSES
} from "./chunk/index.js";
export type {
  ChunkEmbeddingBatch,
  ChunkEmbeddingContract,
  ChunkEmbeddingId,
  ChunkEmbeddingReference,
  ChunkEmbeddingRequest,
  ChunkEmbeddingResult,
  ChunkEmbeddingResultStatus
} from "./chunk/index.js";
export {
  EMBEDDING_VALUE_KINDS
} from "./embedding/index.js";
export type {
  EmbeddingContract,
  EmbeddingDimensionContract,
  EmbeddingDimensionCount,
  EmbeddingDimensionRange,
  EmbeddingId,
  EmbeddingModelId,
  EmbeddingProviderId,
  EmbeddingValueKind,
  EmbeddingVector,
  EmbeddingVectorContract,
  EmbeddingVectorValue
} from "./embedding/index.js";
export {
  EMBEDDING_ERROR_CODES,
  EmbeddingError,
  redactEmbeddingErrorValue
} from "./errors/index.js";
export type {
  EmbeddingErrorCategory,
  EmbeddingErrorCode,
  EmbeddingErrorOptions,
  EmbeddingErrorSafeDetails
} from "./errors/index.js";
export {
  EMBEDDING_EVENT_NAMES
} from "./events/index.js";
export type {
  EmbeddingCachedPayload,
  EmbeddingEventEnvelope,
  EmbeddingEventName,
  EmbeddingEventPayload,
  EmbeddingFailedPayload,
  EmbeddingGeneratedPayload,
  EmbeddingRequestedPayload,
  EmbeddingSkippedPayload,
  EmbeddingValidatedPayload
} from "./events/index.js";
export {
  EMBEDDING_FIXTURE_IDS,
  EMBEDDING_FIXTURE_TIMESTAMP,
  embeddingFixtureCacheEntry,
  embeddingFixtureChunkEmbedding,
  embeddingFixtureEmbedding,
  embeddingFixtureMetadata,
  embeddingFixtureProvider,
  embeddingFixtureRequestedEvent,
  embeddingFixtureRequest,
  embeddingFixtureResult,
  embeddingFixtureTextChunk,
  embeddingFixtureValidationSuccess,
  embeddingFixtureVector
} from "./fixtures/index.js";
export {
  EMBEDDING_PROVIDER_CAPABILITIES,
  EMBEDDING_PROVIDER_STABILITY_STATUSES
} from "./provider/index.js";
export type {
  EmbeddingProviderCapability,
  EmbeddingProviderContract,
  EmbeddingProviderMetadata,
  EmbeddingProviderModel,
  EmbeddingProviderStabilityStatus
} from "./provider/index.js";
export type {
  EmbeddingMetadata,
  EmbeddingModelMetadata,
  EmbeddingProvenance,
  EmbeddingProvenanceBoundary,
  EmbeddingProvenanceRecord,
  EmbeddingSourceReference
} from "./metadata/index.js";
export type {
  EmbeddingInput,
  EmbeddingInputId,
  EmbeddingInputSourceReference,
  EmbeddingRequest,
  EmbeddingRequestContext,
  EmbeddingRequestOptions
} from "./request/index.js";
export {
  EMBEDDING_RESPONSE_STATUSES
} from "./response/index.js";
export type {
  EmbeddingResponse,
  EmbeddingResponseFailure,
  EmbeddingResponseStatus,
  EmbeddingResponseWarning,
  EmbeddingUsageMetadata
} from "./response/index.js";
export {
  EMBEDDING_RESULT_STATUSES
} from "./results/index.js";
export type {
  BatchEmbeddingResult,
  EmbeddingResult,
  EmbeddingResultFailure,
  EmbeddingResultStatus,
  EmbeddingResultSuccess
} from "./results/index.js";
export {
  EMBEDDING_VALIDATION_ISSUE_CODES
} from "./validation/index.js";
export type {
  EmbeddingValidationContract,
  EmbeddingValidationFailure,
  EmbeddingValidationIssue,
  EmbeddingValidationIssueCode,
  EmbeddingValidationResult,
  EmbeddingValidationSuccess
} from "./validation/index.js";
