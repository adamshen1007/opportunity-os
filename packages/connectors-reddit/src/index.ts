/**
 * Reddit Connector Foundation public export boundary.
 *
 * Phase 2 Milestones 13-15 define Reddit connector contracts,
 * deterministic runtime support, and provider transport architecture.
 */
export {
  REDDIT_CONNECTOR_CAPABILITIES,
  REDDIT_READ_CONTRACT_AREAS
} from "./capabilities/index.js";
export type {
  RedditConnectorCapability,
  RedditConnectorCapabilitySet,
  RedditReadContractArea
} from "./capabilities/index.js";
export {
  REDDIT_CONFIG_FIELD_KEYS,
  REDDIT_OAUTH_CONFIG_FIELD_KEYS,
  REDDIT_REQUIRED_CONFIG_FIELD_KEYS,
  REDDIT_SENSITIVE_CONFIG_FIELD_KEYS
} from "./configuration/index.js";
export type {
  RedditConfigFieldKey,
  RedditConnectorConfig,
  RedditConnectorConfigField,
  RedditConnectorConfigInput,
  RedditOAuthConfigFieldKey,
  RedditRequiredConfigFieldKey,
  RedditSensitiveConfigFieldKey
} from "./configuration/index.js";
export type {
  RedditAuthor,
  RedditAuthorAccountAgeMetadata,
  RedditAuthorReference,
  RedditComment,
  RedditCommentReference,
  RedditCursorMetadata,
  RedditCursorValue,
  RedditDataEnvelope,
  RedditDataEnvelopeKind,
  RedditDataEnvelopeMetadata,
  RedditLimitMetadata,
  RedditPageResultMetadata,
  RedditPaginationDirection,
  RedditPaginationMetadata,
  RedditPost,
  RedditPostReference,
  RedditPostScoreMetadata,
  RedditRateLimitMetadata,
  RedditRateLimitWindowMetadata,
  RedditSafePublicMetadata,
  RedditSafeRawMetadataPlaceholder,
  RedditStableId,
  RedditSubreddit,
  RedditSubredditDescriptionMetadata,
  RedditSubredditPublicStatusMetadata,
  RedditSubredditReference,
  RedditSubredditSubscriberCountMetadata,
  RedditTimestamp
} from "./data/index.js";
export {
  REDDIT_CONNECTOR_ERROR_CODES,
  RedditConnectorError,
  createRedditConnectorError,
  sanitizeRedditConnectorErrorMessage
} from "./errors/index.js";
export type {
  RedditConnectorErrorCode,
  RedditConnectorErrorOptions,
  SafeRedditConnectorErrorDetails
} from "./errors/index.js";
export type {
  RedditConnectorFactory,
  RedditConnectorFactoryInput,
  RedditConnectorFactoryResult,
  RedditConnectorFactoryShape
} from "./factory/index.js";
export type {
  RedditHostExecutionContract,
  RedditHostIntegrationContract,
  RedditHostResultContract,
  RedditHostValidationContract
} from "./host/index.js";
export {
  REDDIT_LIFECYCLE_READINESS_STATES
} from "./lifecycle/index.js";
export type {
  RedditLifecycleReadiness,
  RedditLifecycleState,
  RedditLifecycleStateName
} from "./lifecycle/index.js";
export {
  REDDIT_CONNECTOR_METADATA
} from "./metadata/index.js";
export type {
  RedditConnectorMetadata,
  RedditConnectorProvider,
  RedditConnectorTag
} from "./metadata/index.js";
export {
  REDDIT_OPERATION_NAMES
} from "./operations/index.js";
export type {
  RedditOperationContract,
  RedditOperationInput,
  RedditOperationName,
  RedditOperationOutput,
  RedditReadOperationFilters
} from "./operations/index.js";
export {
  REDDIT_AUTH_SENSITIVE_FIELD_KEYS,
  REDDIT_HTTP_METHODS,
  REDDIT_PROVIDER_API_CLIENT_TOKEN,
  REDDIT_PROVIDER_AUTH_LIFECYCLE_STATES,
  REDDIT_PROVIDER_BINDING_CONTRACT,
  REDDIT_PROVIDER_ENDPOINTS,
  REDDIT_PROVIDER_ERROR_CODES,
  REDDIT_PROVIDER_FIXTURE_AUTHOR_RESPONSE,
  REDDIT_PROVIDER_FIXTURE_AUTH_LIFECYCLE,
  REDDIT_PROVIDER_FIXTURE_AUTH_STATE,
  REDDIT_PROVIDER_FIXTURE_COMMENT_RESPONSE,
  REDDIT_PROVIDER_FIXTURE_PAGINATION,
  REDDIT_PROVIDER_FIXTURE_POST_RESPONSE,
  REDDIT_PROVIDER_FIXTURE_RATE_LIMIT,
  REDDIT_PROVIDER_FIXTURE_REQUEST,
  REDDIT_PROVIDER_FIXTURE_SAFE_ERROR,
  REDDIT_PROVIDER_FIXTURE_SUBREDDIT_RESPONSE,
  REDDIT_PROVIDER_FIXTURE_TRANSPORT_RESPONSE,
  REDDIT_PROVIDER_RATE_LIMIT_HEADER_KEYS,
  REDDIT_PROVIDER_REDACTED_HEADER_VALUE,
  REDDIT_PROVIDER_TELEMETRY_EVENT_NAMES,
  REDDIT_PROVIDER_TRANSPORT_SCOPE,
  REDDIT_PROVIDER_TRANSPORT_TOKEN,
  RedditProviderError,
  createRedditFakeTransport,
  createRedditProviderAuthLifecycleSnapshot,
  createRedditProviderCursor,
  createRedditProviderError,
  createRedditProviderNextPageRequest,
  createRedditProviderPaginationMetadata,
  mapRedditCancellationToRuntimeResult,
  mapRedditTimeoutMetadataToRuntimeResult,
  mapRedditTransportFailureToRetryDecision,
  parseRedditProviderRateLimitMetadata,
  parseRedditProviderResponse
} from "./provider/index.js";
export type {
  RedditApiClient,
  RedditApiClientContext,
  RedditApiClientRequest,
  RedditApiClientResult,
  RedditAuthRefreshRequest,
  RedditAuthRefreshResult,
  RedditAuthSensitiveFieldKey,
  RedditAuthState,
  RedditAuthStateStatus,
  RedditFakeTransport,
  RedditFakeTransportInput,
  RedditHttpMethod,
  RedditHttpTransport,
  RedditOAuthCredentials,
  RedditOAuthExpiration,
  RedditOAuthToken,
  RedditProviderAuthHeaderInput,
  RedditProviderAuthLifecycleSnapshot,
  RedditProviderAuthLifecycleState,
  RedditProviderBindingContract,
  RedditProviderBindingToken,
  RedditProviderCancellationCompatibilityInput,
  RedditProviderCursorInput,
  RedditProviderCursorOutput,
  RedditProviderEndpoint,
  RedditProviderErrorCode,
  RedditProviderErrorOptions,
  RedditProviderModuleRegistration,
  RedditProviderNextPageRequest,
  RedditProviderPaginationInput,
  RedditProviderPaginationTransportInput,
  RedditProviderParseIssue,
  RedditProviderParseIssueCode,
  RedditProviderParseResult,
  RedditProviderRateLimitHeaderKey,
  RedditProviderRateLimitInput,
  RedditProviderRetryCompatibilityInput,
  RedditProviderRequestBuilderInput,
  RedditProviderRequestDescription,
  RedditProviderResponseInput,
  RedditProviderSafeAuthor,
  RedditProviderSafeComment,
  RedditProviderSafePost,
  RedditProviderSafeSubreddit,
  RedditProviderTelemetryContract,
  RedditProviderTelemetryEvent,
  RedditProviderTelemetryEventName,
  RedditProviderTelemetryPayload,
  RedditProviderTimeoutCompatibilityInput,
  RedditProviderTransportScope,
  RedditSensitiveAuthValue,
  SafeRedditProviderErrorDetails,
  RedditTransportCancellationSignal,
  RedditTransportFailure,
  RedditTransportHeader,
  RedditTransportRequest,
  RedditTransportResponse,
  RedditTransportResponseMetadata,
  RedditTransportResult
} from "./provider/index.js";
export {
  createRedditProviderRequestDescription
} from "./provider/index.js";
export {
  REDDIT_FIXTURE_ENVELOPE_METADATA,
  REDDIT_FIXTURE_PROVIDER_SNAPSHOT,
  REDDIT_RUNTIME_FAKE_CLOCK,
  RedditRuntimeError,
  createRedditFakeProvider,
  createRedditFixtureProvider,
  createRedditLifecycleReadiness,
  createRedditRuntimeConnector,
  createRedditRuntimeError,
  createRedditRuntimeHarness,
  mapRedditRuntimeFailure,
  mapRedditRuntimeSuccess,
  readRedditFixtureAuthors,
  readRedditFixtureComments,
  readRedditFixtureOperation,
  readRedditFixturePosts,
  readRedditFixtureSubreddits,
  validateRedditRuntimeConfig
} from "./runtime/index.js";
export type {
  RedditFakeProvider,
  RedditFakeProviderSnapshot,
  RedditRuntimeConnector,
  RedditRuntimeConnectorInput,
  RedditRuntimeErrorOptions,
  RedditRuntimeFakeClock,
  RedditRuntimeFakeContext,
  RedditRuntimeHarness,
  RedditRuntimeReadResult,
  RedditRuntimeResultMetadataInput,
  SafeRedditRuntimeErrorDetails
} from "./runtime/index.js";
export {
  REDDIT_FAKE_AUTHOR,
  REDDIT_FAKE_COMMENT,
  REDDIT_FAKE_CONFIG,
  REDDIT_FAKE_HOST_CONTEXT,
  REDDIT_FAKE_PAGINATION,
  REDDIT_FAKE_POST,
  REDDIT_FAKE_RATE_LIMIT,
  REDDIT_FAKE_SUBREDDIT
} from "./testing/index.js";
export type {
  RedditAssertionHelper,
  RedditFakeConfig,
  RedditFakeHostContext,
  RedditFixtureSet
} from "./testing/index.js";
export {
  REDDIT_VALIDATION_ISSUE_CODES,
  REDDIT_VALIDATION_TARGETS
} from "./validation/index.js";
export type {
  RedditValidationFailure,
  RedditValidationIssue,
  RedditValidationIssueCode,
  RedditValidationResult,
  RedditValidationSuccess,
  RedditValidationTarget
} from "./validation/index.js";

export type RedditConnectorBoundary = {
  readonly packageName: "@opportunity-os/connectors-reddit";
  readonly milestone: "phase-2-milestone-15";
  readonly scope: "reddit-provider-transport-architecture";
};
