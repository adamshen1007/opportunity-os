/**
 * Connector Host Foundation public export boundary.
 *
 * Phase 2 Milestone 12 defines generic connector host contracts.
 */
export type ConnectorHostBoundary = {
  readonly packageName: "@opportunity-os/connector-host";
  readonly milestone: "phase-2-milestone-12";
};
export {
  CONNECTOR_HOST_BOOTSTRAP_STATUSES
} from "./bootstrap/index.js";
export type {
  ConnectorHostBootstrapContract,
  ConnectorHostBootstrapInfrastructure,
  ConnectorHostBootstrapInput,
  ConnectorHostBootstrapOutput,
  ConnectorHostBootstrapStatus
} from "./bootstrap/index.js";
export {
  CONNECTOR_HOST_RUNNER_RESULT_STATUSES
} from "./runner/index.js";
export type {
  ConnectorHostRunnerContext,
  ConnectorHostRunnerContract,
  ConnectorHostRunnerFailure,
  ConnectorHostRunnerInput,
  ConnectorHostRunnerOutput,
  ConnectorHostRunnerResult,
  ConnectorHostRunnerResultStatus,
  ConnectorHostRunnerSuccess
} from "./runner/index.js";
export {
  CONNECTOR_HOST_RUNTIME_ORCHESTRATION_STATUSES
} from "./orchestration/index.js";
export type {
  ConnectorHostRuntimeOrchestrationContract,
  ConnectorHostRuntimeOrchestrationInput,
  ConnectorHostRuntimeOrchestrationOutput,
  ConnectorHostRuntimeOrchestrationStatus,
  ConnectorHostRuntimePolicySet
} from "./orchestration/index.js";
export {
  CONNECTOR_HOST_LIFECYCLE_PHASES
} from "./lifecycle/index.js";
export type {
  ConnectorHostLifecycleOrchestrationContract,
  ConnectorHostLifecycleOrchestrationInput,
  ConnectorHostLifecycleOrchestrationOutput,
  ConnectorHostLifecyclePhase
} from "./lifecycle/index.js";
export type {
  ConnectorHostBindingContext,
  ConnectorHostBindings,
  ConnectorHostConfigBinding,
  ConnectorHostDependencyBindings,
  ConnectorHostEventPublisherBinding,
  ConnectorHostLoggerBinding
} from "./bindings/index.js";
export {
  CONNECTOR_HOST_STARTUP_CHECK_KINDS,
  CONNECTOR_HOST_STARTUP_ISSUE_CODES,
  CONNECTOR_HOST_STARTUP_RESULT_STATUSES
} from "./startup/index.js";
export type {
  ConnectorHostStartupCheckKind,
  ConnectorHostStartupIssueCode,
  ConnectorHostStartupResultStatus,
  ConnectorHostStartupValidationCheck,
  ConnectorHostStartupValidationFailure,
  ConnectorHostStartupValidationIssue,
  ConnectorHostStartupValidationResult,
  ConnectorHostStartupValidationSuccess
} from "./startup/index.js";
export {
  CONNECTOR_HOST_SHUTDOWN_RESULT_STATUSES
} from "./shutdown/index.js";
export type {
  ConnectorHostShutdownFailure,
  ConnectorHostShutdownParticipant,
  ConnectorHostShutdownPlan,
  ConnectorHostShutdownResult,
  ConnectorHostShutdownResultStatus,
  ConnectorHostShutdownTimeoutMetadata
} from "./shutdown/index.js";
export {
  CONNECTOR_HOST_HEALTH_STATUSES
} from "./health/index.js";
export type {
  ConnectorHostConnectorHealthSummary,
  ConnectorHostHealthAggregate,
  ConnectorHostHealthMetadata,
  ConnectorHostHealthResult,
  ConnectorHostHealthStatus,
  ConnectorHostRuntimeHealth
} from "./health/index.js";
export {
  CONNECTOR_HOST_EXECUTION_ORCHESTRATION_STATUSES
} from "./execution/index.js";
export type {
  ConnectorHostExecutionOrchestrationContext,
  ConnectorHostExecutionOrchestrationContract,
  ConnectorHostExecutionOrchestrationStatus,
  ConnectorHostExecutionPolicyInput,
  ConnectorHostExecutionRequest,
  ConnectorHostExecutionResult,
  ConnectorHostExecutionSafeFailure,
  ConnectorHostExecutionSuccess
} from "./execution/index.js";
export {
  CONNECTOR_HOST_RESULT_STATUSES
} from "./results/index.js";
export type {
  ConnectorHostResult,
  ConnectorHostResultFailure,
  ConnectorHostResultMetadata,
  ConnectorHostResultPartialSuccess,
  ConnectorHostResultStatus,
  ConnectorHostResultSuccess,
  ConnectorHostShutdownFailureResult,
  ConnectorHostValidationFailureResult
} from "./results/index.js";
export {
  ConnectorHostError,
  createConnectorHostError,
  sanitizeConnectorHostErrorMessage
} from "./errors/index.js";
export type {
  ConnectorHostErrorOptions,
  SafeConnectorHostErrorDetails
} from "./errors/index.js";
export type {
  ConnectorHostAssertionHelper,
  ConnectorHostFakeClock,
  ConnectorHostFakeConfig,
  ConnectorHostFakeConnectorFixture,
  ConnectorHostFakeEventPublisherBinding,
  ConnectorHostFakeLoggerBinding,
  ConnectorHostFakeRuntimeContext,
  ConnectorHostTestFixture,
  ConnectorHostTestHarnessContract
} from "./testing/index.js";
