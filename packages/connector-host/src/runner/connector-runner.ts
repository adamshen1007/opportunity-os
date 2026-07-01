import type { Connector } from "@opportunity-os/connectors";
import type {
  ConnectorRuntimeContext,
  ConnectorRuntimeExecutionResultAggregation
} from "@opportunity-os/connector-runtime";
import type { CorrelationId, RequestId } from "@opportunity-os/shared";

export const CONNECTOR_HOST_RUNNER_RESULT_STATUSES = [
  "accepted",
  "rejected"
] as const;

export type ConnectorHostRunnerResultStatus =
  (typeof CONNECTOR_HOST_RUNNER_RESULT_STATUSES)[number];

export type ConnectorHostRunnerContext = {
  readonly connector: Connector;
  readonly runtime: ConnectorRuntimeContext;
  readonly correlationId: CorrelationId;
  readonly requestId?: RequestId;
};

export type ConnectorHostRunnerInput<TInput = unknown> = {
  readonly context: ConnectorHostRunnerContext;
  readonly input?: TInput;
};

export type ConnectorHostRunnerOutput = {
  readonly status: ConnectorHostRunnerResultStatus;
  readonly aggregation?: ConnectorRuntimeExecutionResultAggregation;
  readonly safeMessage?: string;
};

export type ConnectorHostRunnerFailure = {
  readonly ok: false;
  readonly code: string;
  readonly safeMessage: string;
  readonly correlationId: CorrelationId;
  readonly requestId?: RequestId;
};

export type ConnectorHostRunnerSuccess = {
  readonly ok: true;
  readonly value: ConnectorHostRunnerOutput;
};

export type ConnectorHostRunnerResult =
  | ConnectorHostRunnerSuccess
  | ConnectorHostRunnerFailure;

export type ConnectorHostRunnerContract<TInput = unknown> = {
  readonly input: ConnectorHostRunnerInput<TInput>;
  readonly result?: ConnectorHostRunnerResult;
};
