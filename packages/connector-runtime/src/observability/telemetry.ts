import type { EventEnvelope } from "@opportunity-os/events";
import type { LogEntry } from "@opportunity-os/shared";

export const CONNECTOR_RUNTIME_TELEMETRY_EVENT_KINDS = [
  "pipeline.started",
  "pipeline.completed",
  "pipeline.failed",
  "policy.decision",
  "checkpoint.created"
] as const;

export type ConnectorRuntimeTelemetryEventKind =
  (typeof CONNECTOR_RUNTIME_TELEMETRY_EVENT_KINDS)[number];

export type ConnectorRuntimeTelemetryPayload = Readonly<
  Record<string, string | number | boolean | null>
>;

export type ConnectorRuntimeTelemetryEvent = {
  readonly kind: ConnectorRuntimeTelemetryEventKind;
  readonly timestamp: string;
  readonly correlationId: string;
  readonly requestId?: string;
  readonly eventName: string;
  readonly safeMessage: string;
  readonly payload?: ConnectorRuntimeTelemetryPayload;
  readonly logEntry?: Pick<
    LogEntry,
    "correlationId" | "eventName" | "message" | "requestId" | "severity"
  >;
  readonly eventEnvelope?: Pick<EventEnvelope, "metadata">;
};

export type ConnectorRuntimeTelemetryContract = {
  readonly events: readonly ConnectorRuntimeTelemetryEvent[];
};
