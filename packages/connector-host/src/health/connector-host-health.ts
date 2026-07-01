import type {
  ConnectorHealthResult,
  ConnectorHealthStatus
} from "@opportunity-os/connectors";
import type { ConnectorRuntimeExecutionMetrics } from "@opportunity-os/connector-runtime";
import type {
  HealthAggregateStatus,
  HealthAggregationResult,
  HealthMetadata,
  HealthStatus
} from "@opportunity-os/infrastructure";
import type { CorrelationId, RequestId } from "@opportunity-os/shared";

export const CONNECTOR_HOST_HEALTH_STATUSES = [
  "healthy",
  "degraded",
  "unhealthy",
  "unknown"
] as const;

export type ConnectorHostHealthStatus =
  (typeof CONNECTOR_HOST_HEALTH_STATUSES)[number];

export type ConnectorHostRuntimeHealth = {
  readonly status: HealthStatus;
  readonly checkedAt: string;
  readonly safeMessage?: string;
  readonly metrics?: ConnectorRuntimeExecutionMetrics;
  readonly metadata?: HealthMetadata;
};

export type ConnectorHostHealthMetadata = {
  readonly hostId: string;
  readonly status: ConnectorHostHealthStatus;
  readonly checkedAt: string;
  readonly correlationId: CorrelationId;
  readonly requestId?: RequestId;
  readonly safeMessage?: string;
  readonly details?: HealthMetadata;
};

export type ConnectorHostConnectorHealthSummary = {
  readonly status: ConnectorHealthStatus;
  readonly results: readonly ConnectorHealthResult[];
};

export type ConnectorHostHealthAggregate = {
  readonly host: ConnectorHostHealthMetadata;
  readonly runtime: ConnectorHostRuntimeHealth;
  readonly connectors: ConnectorHostConnectorHealthSummary;
  readonly infrastructure?: HealthAggregateStatus;
};

export type ConnectorHostHealthResult =
  | {
      readonly status: "healthy" | "degraded";
      readonly aggregate: ConnectorHostHealthAggregate;
      readonly failures: readonly [];
      readonly infrastructureResult?: HealthAggregationResult;
    }
  | {
      readonly status: "unhealthy" | "unknown";
      readonly aggregate: ConnectorHostHealthAggregate;
      readonly failures: readonly ConnectorHostHealthMetadata[];
      readonly infrastructureResult?: HealthAggregationResult;
    };
