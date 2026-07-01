import type { ConnectorRuntimeContext } from "../context/index.js";

export const CONNECTOR_RUNTIME_CANCELLATION_STATES = [
  "not-requested",
  "requested",
  "cancelled"
] as const;

export const CONNECTOR_RUNTIME_CANCELLATION_REASON_CODES = [
  "user-requested",
  "superseded",
  "policy-requested",
  "runtime-shutdown"
] as const;

export type ConnectorRuntimeCancellationState =
  (typeof CONNECTOR_RUNTIME_CANCELLATION_STATES)[number];

export type ConnectorRuntimeCancellationReasonCode =
  (typeof CONNECTOR_RUNTIME_CANCELLATION_REASON_CODES)[number];

export type ConnectorRuntimeCancellationContextMetadata = {
  readonly correlationId: ConnectorRuntimeContext["correlationId"];
  readonly requestId?: ConnectorRuntimeContext["requestId"];
  readonly connectorId: string;
  readonly requestedAt?: string;
  readonly cancelledAt?: string;
};

export type ConnectorRuntimeCancellationRequest = {
  readonly state: "requested";
  readonly reasonCode: ConnectorRuntimeCancellationReasonCode;
  readonly safeMessage: string;
  readonly metadata: ConnectorRuntimeCancellationContextMetadata;
};

export type ConnectorRuntimeCancellationResult = {
  readonly state: ConnectorRuntimeCancellationState;
  readonly reasonCode?: ConnectorRuntimeCancellationReasonCode;
  readonly safeMessage?: string;
  readonly metadata?: ConnectorRuntimeCancellationContextMetadata;
};
