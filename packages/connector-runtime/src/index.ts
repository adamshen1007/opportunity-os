/**
 * Connector Runtime Foundation public export boundary.
 *
 * Phase 2 Milestone 11 defines generic connector runtime contracts.
 */
export {
  CONNECTOR_RUNTIME_PIPELINE_STAGE_KINDS
} from "./pipeline/index.js";
export type {
  ConnectorRuntimeExecutionPipeline,
  ConnectorRuntimePipelineFailure,
  ConnectorRuntimePipelineInput,
  ConnectorRuntimePipelineOutput,
  ConnectorRuntimePipelineResult,
  ConnectorRuntimePipelineStage,
  ConnectorRuntimePipelineStageKind,
  ConnectorRuntimePipelineSuccess
} from "./pipeline/index.js";
export {
  CONNECTOR_RUNTIME_EXECUTION_STATES,
  CONNECTOR_RUNTIME_TRANSITION_KINDS
} from "./state/index.js";
export type {
  ConnectorRuntimeExecutionState,
  ConnectorRuntimeInvalidTransition,
  ConnectorRuntimeStateTransition,
  ConnectorRuntimeTransitionKind
} from "./state/index.js";
export type {
  ConnectorRuntimeConnectorReference,
  ConnectorRuntimeContext,
  ConnectorRuntimeInfrastructureMetadata
} from "./context/index.js";
export {
  CONNECTOR_RUNTIME_BACKOFF_KINDS,
  CONNECTOR_RUNTIME_RATE_LIMIT_DECISIONS,
  CONNECTOR_RUNTIME_RETRY_DECISIONS,
  CONNECTOR_RUNTIME_TIMEOUT_RESULT_STATUSES,
  CONNECTOR_RUNTIME_TIMEOUT_SCOPES
} from "./policies/index.js";
export type {
  ConnectorRuntimeBackoffKind,
  ConnectorRuntimeBackoffMetadata,
  ConnectorRuntimeRateLimitDecision,
  ConnectorRuntimeRateLimitDecisionKind,
  ConnectorRuntimeRateLimitPolicy,
  ConnectorRuntimeRetryDecision,
  ConnectorRuntimeRetryDecisionKind,
  ConnectorRuntimeRetryPolicy,
  ConnectorRuntimeTimeoutDuration,
  ConnectorRuntimeTimeoutPolicy,
  ConnectorRuntimeTimeoutResult,
  ConnectorRuntimeTimeoutResultStatus,
  ConnectorRuntimeTimeoutScope
} from "./policies/index.js";
export {
  CONNECTOR_RUNTIME_CANCELLATION_REASON_CODES,
  CONNECTOR_RUNTIME_CANCELLATION_STATES
} from "./cancellation/index.js";
export type {
  ConnectorRuntimeCancellationContextMetadata,
  ConnectorRuntimeCancellationReasonCode,
  ConnectorRuntimeCancellationRequest,
  ConnectorRuntimeCancellationResult,
  ConnectorRuntimeCancellationState
} from "./cancellation/index.js";
export type {
  ConnectorRuntimeCheckpoint,
  ConnectorRuntimeCheckpointCursor,
  ConnectorRuntimeCheckpointId,
  ConnectorRuntimeReplayReadiness,
  ConnectorRuntimeStateSnapshotMetadata
} from "./checkpoint/index.js";
export {
  CONNECTOR_RUNTIME_TELEMETRY_EVENT_KINDS
} from "./observability/index.js";
export type {
  ConnectorRuntimeAttemptMetrics,
  ConnectorRuntimeCountMetrics,
  ConnectorRuntimeDurationMetrics,
  ConnectorRuntimeExecutionMetrics,
  ConnectorRuntimeFailureMetrics,
  ConnectorRuntimeRecordMetrics,
  ConnectorRuntimeTelemetryContract,
  ConnectorRuntimeTelemetryEvent,
  ConnectorRuntimeTelemetryEventKind,
  ConnectorRuntimeTelemetryPayload
} from "./observability/index.js";
export {
  CONNECTOR_RUNTIME_AGGREGATE_RESULT_STATUSES
} from "./results/index.js";
export type {
  ConnectorRuntimeAggregatedConnectorResult,
  ConnectorRuntimeAggregateResultStatus,
  ConnectorRuntimeExecutionResultAggregation
} from "./results/index.js";
export {
  ConnectorRuntimeError,
  createConnectorRuntimeError,
  sanitizeConnectorRuntimeErrorMessage
} from "./runtime-errors/index.js";
export type {
  ConnectorRuntimeErrorOptions,
  SafeConnectorRuntimeErrorDetails
} from "./runtime-errors/index.js";
export type {
  ConnectorRuntimeAssertionHelper,
  ConnectorRuntimeFakeClock,
  ConnectorRuntimeFakeConnectorFixture,
  ConnectorRuntimePipelineFixture,
  ConnectorRuntimeTestHarnessContract
} from "./testing/index.js";
