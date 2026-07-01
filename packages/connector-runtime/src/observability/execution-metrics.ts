import type { ConnectorLimitMetadata } from "@opportunity-os/connectors";

export type ConnectorRuntimeCountMetrics = {
  readonly processed: number;
  readonly succeeded: number;
  readonly failed: number;
  readonly skipped?: number;
};

export type ConnectorRuntimeDurationMetrics = {
  readonly totalMs: number;
  readonly stageDurationsMs?: Readonly<Record<string, number>>;
};

export type ConnectorRuntimeAttemptMetrics = {
  readonly attempts: number;
  readonly maxAttempts?: number;
  readonly retryableFailures?: number;
};

export type ConnectorRuntimeRecordMetrics = {
  readonly recordsRead?: number;
  readonly recordsWritten?: number;
  readonly recordsSkipped?: number;
};

export type ConnectorRuntimeFailureMetrics = {
  readonly failureCount: number;
  readonly issueCodes: readonly string[];
};

export type ConnectorRuntimeExecutionMetrics = {
  readonly counts: ConnectorRuntimeCountMetrics;
  readonly durations: ConnectorRuntimeDurationMetrics;
  readonly attempts: ConnectorRuntimeAttemptMetrics;
  readonly records?: ConnectorRuntimeRecordMetrics;
  readonly failures?: ConnectorRuntimeFailureMetrics;
  readonly limits?: ConnectorLimitMetadata;
};
