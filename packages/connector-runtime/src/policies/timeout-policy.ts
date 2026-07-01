export const CONNECTOR_RUNTIME_TIMEOUT_SCOPES = [
  "pipeline",
  "stage",
  "operation"
] as const;

export const CONNECTOR_RUNTIME_TIMEOUT_RESULT_STATUSES = [
  "within-limit",
  "timed-out"
] as const;

export type ConnectorRuntimeTimeoutScope =
  (typeof CONNECTOR_RUNTIME_TIMEOUT_SCOPES)[number];

export type ConnectorRuntimeTimeoutResultStatus =
  (typeof CONNECTOR_RUNTIME_TIMEOUT_RESULT_STATUSES)[number];

export type ConnectorRuntimeTimeoutDuration = {
  readonly timeoutMs: number;
  readonly startedAt?: string;
  readonly deadlineAt?: string;
};

export type ConnectorRuntimeTimeoutPolicy = {
  readonly scope: ConnectorRuntimeTimeoutScope;
  readonly duration: ConnectorRuntimeTimeoutDuration;
};

export type ConnectorRuntimeTimeoutResult = {
  readonly status: ConnectorRuntimeTimeoutResultStatus;
  readonly scope: ConnectorRuntimeTimeoutScope;
  readonly duration: ConnectorRuntimeTimeoutDuration;
  readonly safeMessage?: string;
};
