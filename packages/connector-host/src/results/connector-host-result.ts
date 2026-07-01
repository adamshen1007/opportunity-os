import type { ConnectorValidationIssue } from "@opportunity-os/connectors";
import type {
  ConnectorRuntimeExecutionResultAggregation,
  SafeConnectorRuntimeErrorDetails
} from "@opportunity-os/connector-runtime";
import type { CorrelationId, RequestId } from "@opportunity-os/shared";
import type { SafeConnectorHostErrorDetails } from "../errors/index.js";
import type { ConnectorHostShutdownResult } from "../shutdown/index.js";

export const CONNECTOR_HOST_RESULT_STATUSES = [
  "succeeded",
  "partially-succeeded",
  "failed",
  "validation-failed",
  "shutdown-failed"
] as const;

export type ConnectorHostResultStatus =
  (typeof CONNECTOR_HOST_RESULT_STATUSES)[number];

export type ConnectorHostResultMetadata = {
  readonly hostId: string;
  readonly correlationId: CorrelationId;
  readonly requestId?: RequestId;
};

export type ConnectorHostResultSuccess = {
  readonly status: "succeeded";
  readonly metadata: ConnectorHostResultMetadata;
  readonly aggregation: ConnectorRuntimeExecutionResultAggregation;
  readonly errors: readonly [];
};

export type ConnectorHostResultPartialSuccess = {
  readonly status: "partially-succeeded";
  readonly metadata: ConnectorHostResultMetadata;
  readonly aggregation: ConnectorRuntimeExecutionResultAggregation;
  readonly errors: readonly SafeConnectorHostErrorDetails[];
};

export type ConnectorHostResultFailure = {
  readonly status: "failed";
  readonly metadata: ConnectorHostResultMetadata;
  readonly aggregation?: ConnectorRuntimeExecutionResultAggregation;
  readonly errors: readonly (
    | SafeConnectorHostErrorDetails
    | SafeConnectorRuntimeErrorDetails
  )[];
};

export type ConnectorHostValidationFailureResult = {
  readonly status: "validation-failed";
  readonly metadata: ConnectorHostResultMetadata;
  readonly validationIssues: readonly ConnectorValidationIssue[];
  readonly errors: readonly SafeConnectorHostErrorDetails[];
};

export type ConnectorHostShutdownFailureResult = {
  readonly status: "shutdown-failed";
  readonly metadata: ConnectorHostResultMetadata;
  readonly shutdown: ConnectorHostShutdownResult;
  readonly errors: readonly SafeConnectorHostErrorDetails[];
};

export type ConnectorHostResult =
  | ConnectorHostResultSuccess
  | ConnectorHostResultPartialSuccess
  | ConnectorHostResultFailure
  | ConnectorHostValidationFailureResult
  | ConnectorHostShutdownFailureResult;
