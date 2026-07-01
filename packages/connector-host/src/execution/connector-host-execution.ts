import type {
  Connector,
  ConnectorValidationIssue
} from "@opportunity-os/connectors";
import type {
  ConnectorRuntimeExecutionMetrics,
  ConnectorRuntimeExecutionPipeline,
  ConnectorRuntimeExecutionState,
  ConnectorRuntimeRateLimitPolicy,
  ConnectorRuntimeRetryPolicy,
  ConnectorRuntimeTelemetryContract,
  ConnectorRuntimeTimeoutPolicy
} from "@opportunity-os/connector-runtime";
import type { CorrelationId, RequestId } from "@opportunity-os/shared";
import type { ConnectorHostBindings } from "../bindings/index.js";
import type { SafeConnectorHostErrorDetails } from "../errors/index.js";
import type { ConnectorHostResult } from "../results/index.js";

export const CONNECTOR_HOST_EXECUTION_ORCHESTRATION_STATUSES = [
  "accepted",
  "rejected"
] as const;

export type ConnectorHostExecutionOrchestrationStatus =
  (typeof CONNECTOR_HOST_EXECUTION_ORCHESTRATION_STATUSES)[number];

export type ConnectorHostExecutionPolicyInput = {
  readonly retry?: ConnectorRuntimeRetryPolicy;
  readonly timeout?: ConnectorRuntimeTimeoutPolicy;
  readonly rateLimit?: ConnectorRuntimeRateLimitPolicy;
};

export type ConnectorHostExecutionRequest<TInput = unknown> = {
  readonly hostId: string;
  readonly connector: Connector<TInput, unknown>;
  readonly input?: TInput;
  readonly correlationId: CorrelationId;
  readonly requestId?: RequestId;
  readonly policies?: ConnectorHostExecutionPolicyInput;
};

export type ConnectorHostExecutionOrchestrationContext<TInput = unknown> = {
  readonly request: ConnectorHostExecutionRequest<TInput>;
  readonly bindings: ConnectorHostBindings;
  readonly pipeline: ConnectorRuntimeExecutionPipeline<TInput, unknown>;
  readonly state: ConnectorRuntimeExecutionState;
  readonly telemetry?: ConnectorRuntimeTelemetryContract;
  readonly metrics?: ConnectorRuntimeExecutionMetrics;
};

export type ConnectorHostExecutionSafeFailure = {
  readonly ok: false;
  readonly code: string;
  readonly safeMessage: string;
  readonly correlationId: CorrelationId;
  readonly requestId?: RequestId;
  readonly validationIssues?: readonly ConnectorValidationIssue[];
  readonly errors?: readonly SafeConnectorHostErrorDetails[];
};

export type ConnectorHostExecutionSuccess = {
  readonly ok: true;
  readonly status: "accepted";
  readonly result: ConnectorHostResult;
};

export type ConnectorHostExecutionResult =
  | ConnectorHostExecutionSuccess
  | ConnectorHostExecutionSafeFailure;

export type ConnectorHostExecutionOrchestrationContract<TInput = unknown> = {
  readonly context: ConnectorHostExecutionOrchestrationContext<TInput>;
  readonly result?: ConnectorHostExecutionResult;
};
