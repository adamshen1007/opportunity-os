import type {
  ConnectorResultMetadata,
  ConnectorValidationIssue
} from "@opportunity-os/connectors";
import type { ConnectorRuntimeCheckpoint } from "../checkpoint/index.js";
import type { ConnectorRuntimeExecutionMetrics } from "../observability/index.js";
import type { SafeConnectorRuntimeErrorDetails } from "../runtime-errors/index.js";

export const CONNECTOR_RUNTIME_AGGREGATE_RESULT_STATUSES = [
  "succeeded",
  "partially-succeeded",
  "failed",
  "cancelled"
] as const;

export type ConnectorRuntimeAggregateResultStatus =
  (typeof CONNECTOR_RUNTIME_AGGREGATE_RESULT_STATUSES)[number];

export type ConnectorRuntimeAggregatedConnectorResult = {
  readonly ok: boolean;
  readonly metadata?: ConnectorResultMetadata;
  readonly error?: SafeConnectorRuntimeErrorDetails;
};

export type ConnectorRuntimeExecutionResultAggregation = {
  readonly status: ConnectorRuntimeAggregateResultStatus;
  readonly connectorResults: readonly ConnectorRuntimeAggregatedConnectorResult[];
  readonly metrics: ConnectorRuntimeExecutionMetrics;
  readonly checkpoints: readonly ConnectorRuntimeCheckpoint[];
  readonly validationIssues: readonly ConnectorValidationIssue[];
  readonly errors: readonly SafeConnectorRuntimeErrorDetails[];
};
