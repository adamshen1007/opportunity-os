import type {
  ConnectorRuntimeExecutionMetrics,
  ConnectorRuntimeExecutionPipeline,
  ConnectorRuntimeExecutionResultAggregation,
  ConnectorRuntimeExecutionState,
  ConnectorRuntimeRateLimitPolicy,
  ConnectorRuntimeRetryPolicy,
  ConnectorRuntimeTelemetryContract,
  ConnectorRuntimeTimeoutPolicy
} from "@opportunity-os/connector-runtime";

export const CONNECTOR_HOST_RUNTIME_ORCHESTRATION_STATUSES = [
  "planned",
  "accepted",
  "rejected"
] as const;

export type ConnectorHostRuntimeOrchestrationStatus =
  (typeof CONNECTOR_HOST_RUNTIME_ORCHESTRATION_STATUSES)[number];

export type ConnectorHostRuntimePolicySet = {
  readonly retry?: ConnectorRuntimeRetryPolicy;
  readonly timeout?: ConnectorRuntimeTimeoutPolicy;
  readonly rateLimit?: ConnectorRuntimeRateLimitPolicy;
};

export type ConnectorHostRuntimeOrchestrationInput = {
  readonly pipeline: ConnectorRuntimeExecutionPipeline;
  readonly state: ConnectorRuntimeExecutionState;
  readonly policies?: ConnectorHostRuntimePolicySet;
  readonly metrics?: ConnectorRuntimeExecutionMetrics;
  readonly telemetry?: ConnectorRuntimeTelemetryContract;
};

export type ConnectorHostRuntimeOrchestrationOutput = {
  readonly status: ConnectorHostRuntimeOrchestrationStatus;
  readonly state: ConnectorRuntimeExecutionState;
  readonly aggregation?: ConnectorRuntimeExecutionResultAggregation;
  readonly safeMessage?: string;
};

export type ConnectorHostRuntimeOrchestrationContract = {
  readonly input: ConnectorHostRuntimeOrchestrationInput;
  readonly output?: ConnectorHostRuntimeOrchestrationOutput;
};
