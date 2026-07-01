import type { ConnectorCapabilityKind } from "../capabilities/index.js";
import type { ConnectorId } from "../metadata/index.js";

export const CONNECTOR_HEALTH_STATUSES = [
  "healthy",
  "degraded",
  "unhealthy",
  "unknown"
] as const;

export type ConnectorHealthStatus = (typeof CONNECTOR_HEALTH_STATUSES)[number];

export type ConnectorHealthMetadata = {
  readonly connectorId: ConnectorId;
  readonly status: ConnectorHealthStatus;
  readonly checkedAt: string;
  readonly safeMessage: string;
  readonly details?: Readonly<Record<string, string | number | boolean>>;
  readonly capabilities?: readonly ConnectorCapabilityKind[];
};

export type ConnectorHealthCheckContract = {
  readonly name: string;
  readonly capabilities?: readonly ConnectorCapabilityKind[];
};

export type ConnectorHealthResult = {
  readonly health: ConnectorHealthMetadata;
};
