import type { ConnectorId } from "../metadata/index.js";

export type ConnectorRateLimitWindow = {
  readonly limit: number;
  readonly remaining?: number;
  readonly resetAt?: string;
  readonly windowSeconds?: number;
};

export type ConnectorRateLimitMetadata = {
  readonly connectorId: ConnectorId;
  readonly operationName?: string;
  readonly requests?: ConnectorRateLimitWindow;
  readonly records?: ConnectorRateLimitWindow;
};

export type ConnectorQuotaWindow = {
  readonly limit: number;
  readonly used?: number;
  readonly resetsAt?: string;
  readonly unit: "requests" | "records" | "bytes" | "operations";
};

export type ConnectorQuotaMetadata = {
  readonly connectorId: ConnectorId;
  readonly daily?: ConnectorQuotaWindow;
  readonly monthly?: ConnectorQuotaWindow;
};

export type ConnectorLimitMetadata = {
  readonly rateLimit?: ConnectorRateLimitMetadata;
  readonly quota?: ConnectorQuotaMetadata;
};
