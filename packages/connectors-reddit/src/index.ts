/**
 * Reddit Connector Foundation public export boundary.
 *
 * Phase 2 Milestone 13 defines Reddit connector contracts.
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
  readonly milestone: "phase-2-milestone-13";
  readonly scope: "reddit-connector-contracts";
};
