import type { ConnectorLimitMetadata } from "@opportunity-os/connectors";

export const CONNECTOR_RUNTIME_RATE_LIMIT_DECISIONS = [
  "allow",
  "defer",
  "reject"
] as const;

export type ConnectorRuntimeRateLimitDecisionKind =
  (typeof CONNECTOR_RUNTIME_RATE_LIMIT_DECISIONS)[number];

export type ConnectorRuntimeRateLimitPolicy = {
  readonly limits: ConnectorLimitMetadata;
  readonly operationName?: string;
};

export type ConnectorRuntimeRateLimitDecision = {
  readonly decision: ConnectorRuntimeRateLimitDecisionKind;
  readonly limits: ConnectorLimitMetadata;
  readonly deferUntil?: string;
  readonly safeMessage: string;
};
