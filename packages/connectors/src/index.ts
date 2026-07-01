/**
 * Connector SDK Foundation public export boundary.
 *
 * Phase 2 Milestone 10 defines generic connector SDK contracts.
 */
export {
  CONNECTOR_CAPABILITY_KINDS
} from "./capabilities/index.js";
export type {
  ConnectorCapability,
  ConnectorCapabilityKind,
  ConnectorCapabilitySet
} from "./capabilities/index.js";
export type {
  ConnectorConfig,
  ConnectorConfigField,
  ConnectorConfigFieldKind,
  ConnectorConfigInput,
  ConnectorSensitiveConfigField
} from "./configuration/index.js";
export {
  ConnectorError,
  createConnectorError,
  sanitizeConnectorErrorMessage
} from "./errors/index.js";
export type {
  ConnectorErrorOptions,
  SafeConnectorErrorDetails
} from "./errors/index.js";
export type {
  ConnectorContext,
  ConnectorContextExecutionMetadata
} from "./context/index.js";
export type {
  Connector
} from "./connector/index.js";
export type {
  ConnectorFactory,
  ConnectorFactoryInput,
  ConnectorFactoryResult
} from "./factory/index.js";
export {
  CONNECTOR_HEALTH_STATUSES
} from "./health/index.js";
export type {
  ConnectorHealthCheckContract,
  ConnectorHealthMetadata,
  ConnectorHealthResult,
  ConnectorHealthStatus
} from "./health/index.js";
export type {
  ConnectorLimitMetadata,
  ConnectorQuotaMetadata,
  ConnectorQuotaWindow,
  ConnectorRateLimitMetadata,
  ConnectorRateLimitWindow
} from "./limits/index.js";
export {
  CONNECTOR_LIFECYCLE_PHASES
} from "./lifecycle/index.js";
export type {
  ConnectorLifecycle,
  ConnectorLifecyclePhase,
  ConnectorLifecycleState,
  ConnectorLifecycleTransition
} from "./lifecycle/index.js";
export {
  CONNECTOR_CATEGORIES,
  CONNECTOR_STABILITY_STATUSES
} from "./metadata/index.js";
export type {
  ConnectorCategory,
  ConnectorId,
  ConnectorMetadata,
  ConnectorProvider,
  ConnectorStabilityStatus,
  ConnectorVersion
} from "./metadata/index.js";
export type {
  ConnectorOperationContract,
  ConnectorOperationExecutionMetadata,
  ConnectorOperationInput,
  ConnectorOperationOutput,
  ConnectorPaginationMetadata
} from "./operations/index.js";
export type {
  ConnectorRegistry,
  ConnectorRegistryListResult,
  ConnectorRegistryLookupResult,
  ConnectorRegistryRegistrationResult
} from "./registry/index.js";
export {
  connectorFailure,
  connectorSuccess
} from "./results/index.js";
export type {
  ConnectorFailure,
  ConnectorResult,
  ConnectorResultMetadata,
  ConnectorSuccess
} from "./results/index.js";
export type {
  ConnectorAssertionContext,
  ConnectorAssertionHelper,
  FakeConnectorContext,
  FakeConnectorFixture,
  FakeConnectorMetadata
} from "./testing/index.js";
export {
  CONNECTOR_VALIDATION_ISSUE_CODES
} from "./validation/index.js";
export type {
  ConnectorValidationFailure,
  ConnectorValidationIssue,
  ConnectorValidationIssueCode,
  ConnectorValidationIssueTarget,
  ConnectorValidationResult,
  ConnectorValidationSuccess
} from "./validation/index.js";
