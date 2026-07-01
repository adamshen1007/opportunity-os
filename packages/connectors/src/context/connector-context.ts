import type { StructuredLogger } from "@opportunity-os/shared";
import type { ConnectorConfig } from "../configuration/index.js";
import type { ConnectorId } from "../metadata/index.js";

export type ConnectorContextExecutionMetadata = {
  readonly connectorId: ConnectorId;
  readonly operationName?: string;
  readonly startedAt?: string;
  readonly attempt?: number;
};

export type ConnectorContext = {
  readonly correlationId: string;
  readonly requestId?: string;
  readonly logger: StructuredLogger;
  readonly config: ConnectorConfig;
  readonly execution: ConnectorContextExecutionMetadata;
};
