export const CONNECTOR_RUNTIME_BACKOFF_KINDS = [
  "fixed",
  "linear",
  "exponential"
] as const;

export const CONNECTOR_RUNTIME_RETRY_DECISIONS = [
  "retry",
  "do-not-retry"
] as const;

export type ConnectorRuntimeBackoffKind =
  (typeof CONNECTOR_RUNTIME_BACKOFF_KINDS)[number];

export type ConnectorRuntimeRetryDecisionKind =
  (typeof CONNECTOR_RUNTIME_RETRY_DECISIONS)[number];

export type ConnectorRuntimeBackoffMetadata = {
  readonly kind: ConnectorRuntimeBackoffKind;
  readonly delayMs: number;
  readonly maxDelayMs?: number;
  readonly multiplier?: number;
};

export type ConnectorRuntimeRetryPolicy = {
  readonly maxAttempts: number;
  readonly backoff: ConnectorRuntimeBackoffMetadata;
  readonly retryableIssueCodes: readonly string[];
};

export type ConnectorRuntimeRetryDecision = {
  readonly decision: ConnectorRuntimeRetryDecisionKind;
  readonly attempt: number;
  readonly maxAttempts: number;
  readonly nextDelayMs?: number;
  readonly safeMessage: string;
};
