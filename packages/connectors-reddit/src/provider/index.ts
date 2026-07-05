export {
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
  REDDIT_PROVIDER_FIXTURE_TRANSPORT_RESPONSE
} from "./fixtures.js";
export {
  createRedditFakeTransport
} from "./fake-transport.js";
export type {
  RedditFakeTransport,
  RedditFakeTransportInput
} from "./fake-transport.js";
export {
  REDDIT_PROVIDER_BINDING_CONTRACT,
  REDDIT_PROVIDER_API_CLIENT_TOKEN,
  REDDIT_PROVIDER_TRANSPORT_TOKEN
} from "./container-bindings.js";
export type {
  RedditProviderBindingContract,
  RedditProviderBindingToken,
  RedditProviderModuleRegistration
} from "./container-bindings.js";
export {
  REDDIT_PROVIDER_AUTH_LIFECYCLE_STATES,
  createRedditProviderAuthLifecycleSnapshot
} from "./auth-lifecycle.js";
export type {
  RedditProviderAuthLifecycleSnapshot,
  RedditProviderAuthLifecycleState
} from "./auth-lifecycle.js";
export {
  REDDIT_PROVIDER_ERROR_CODES,
  RedditProviderError,
  createRedditProviderError
} from "./provider-error.js";
export type {
  RedditProviderErrorCode,
  RedditProviderErrorOptions,
  SafeRedditProviderErrorDetails
} from "./provider-error.js";
export {
  REDDIT_PROVIDER_TELEMETRY_EVENT_NAMES
} from "./telemetry.js";
export type {
  RedditProviderTelemetryContract,
  RedditProviderTelemetryEvent,
  RedditProviderTelemetryEventName,
  RedditProviderTelemetryPayload
} from "./telemetry.js";
export {
  mapRedditCancellationToRuntimeResult,
  mapRedditTimeoutMetadataToRuntimeResult,
  mapRedditTransportFailureToRetryDecision
} from "./runtime-compatibility.js";
export type {
  RedditProviderCancellationCompatibilityInput,
  RedditProviderRetryCompatibilityInput,
  RedditProviderTimeoutCompatibilityInput
} from "./runtime-compatibility.js";
export {
  createRedditProviderCursor,
  createRedditProviderNextPageRequest,
  createRedditProviderPaginationMetadata
} from "./pagination-transport.js";
export type {
  RedditProviderCursorInput,
  RedditProviderCursorOutput,
  RedditProviderNextPageRequest,
  RedditProviderPaginationInput as RedditProviderPaginationTransportInput
} from "./pagination-transport.js";
export {
  REDDIT_PROVIDER_RATE_LIMIT_HEADER_KEYS,
  parseRedditProviderRateLimitMetadata
} from "./rate-limit-parser.js";
export type {
  RedditProviderRateLimitHeaderKey,
  RedditProviderRateLimitInput
} from "./rate-limit-parser.js";
export {
  parseRedditProviderResponse
} from "./response-parser.js";
export type {
  RedditProviderParseIssue,
  RedditProviderParseIssueCode,
  RedditProviderParseResult,
  RedditProviderResponseInput,
  RedditProviderSafeAuthor,
  RedditProviderSafeComment,
  RedditProviderSafePost,
  RedditProviderSafeSubreddit
} from "./response-parser.js";
export {
  REDDIT_AUTH_SENSITIVE_FIELD_KEYS
} from "./auth.js";
export type {
  RedditAuthRefreshRequest,
  RedditAuthRefreshResult,
  RedditAuthSensitiveFieldKey,
  RedditAuthState,
  RedditAuthStateStatus,
  RedditOAuthCredentials,
  RedditOAuthExpiration,
  RedditOAuthToken,
  RedditSensitiveAuthValue
} from "./auth.js";
export type {
  RedditApiClient,
  RedditApiClientContext,
  RedditApiClientRequest,
  RedditApiClientResult
} from "./api-client.js";
export {
  REDDIT_LIVE_PROVIDER_ENV_KEYS,
  createRedditLiveProviderConfigFromEnv
} from "./live-config.js";
export type {
  RedditLiveProviderConfig,
  RedditLiveProviderConfigResult,
  RedditLiveProviderEnvKey
} from "./live-config.js";
export {
  exchangeRedditOAuthToken
} from "./oauth-client.js";
export type {
  RedditOAuthGrantType,
  RedditOAuthTokenExchangeInput,
  RedditOAuthTokenExchangeResult
} from "./oauth-client.js";
export {
  createRedditLiveHttpTransport
} from "./live-http-transport.js";
export type {
  RedditFetchLike,
  RedditLiveHttpTransport,
  RedditLiveHttpTransportInput
} from "./live-http-transport.js";
export {
  mapRedditLiveListingResponse
} from "./live-response-mapper.js";
export type {
  RedditLiveListingKind,
  RedditLiveResponseMapInput,
  RedditLiveResponseMapResult
} from "./live-response-mapper.js";
export {
  createRedditLiveApiClient
} from "./live-api-client.js";
export type {
  RedditLiveApiClientInput
} from "./live-api-client.js";
export {
  fetchRedditLivePublicPosts
} from "./live-execution.js";
export type {
  RedditLiveRuntimeContext,
  RedditLivePublicPostsInput,
  RedditLivePublicPostsResult
} from "./live-execution.js";
export {
  REDDIT_PROVIDER_ENDPOINTS,
  REDDIT_PROVIDER_REDACTED_HEADER_VALUE,
  createRedditProviderRequestDescription
} from "./request-builder.js";
export type {
  RedditProviderAuthHeaderInput,
  RedditProviderEndpoint,
  RedditProviderPaginationInput,
  RedditProviderRequestBuilderInput,
  RedditProviderRequestDescription
} from "./request-builder.js";
export {
  REDDIT_HTTP_METHODS
} from "./transport.js";
export type {
  RedditHttpMethod,
  RedditHttpTransport,
  RedditTransportCancellationSignal,
  RedditTransportFailure,
  RedditTransportHeader,
  RedditTransportRequest,
  RedditTransportResponse,
  RedditTransportResponseMetadata,
  RedditTransportResult
} from "./transport.js";

export const REDDIT_PROVIDER_TRANSPORT_SCOPE = {
  packageName: "@opportunity-os/connectors-reddit",
  milestone: "phase-2-milestone-15",
  moduleName: "provider",
  scope: "reddit-provider-transport-architecture"
} as const;

export type RedditProviderTransportScope = typeof REDDIT_PROVIDER_TRANSPORT_SCOPE;
