export const CONNECTOR_RUNTIME_EXECUTION_STATES = [
  "created",
  "ready",
  "running",
  "paused",
  "succeeded",
  "failed",
  "cancelled",
  "timed-out"
] as const;

export const CONNECTOR_RUNTIME_TRANSITION_KINDS = [
  "start",
  "pause",
  "resume",
  "succeed",
  "fail",
  "cancel",
  "time-out"
] as const;

export type ConnectorRuntimeExecutionState =
  (typeof CONNECTOR_RUNTIME_EXECUTION_STATES)[number];

export type ConnectorRuntimeTransitionKind =
  (typeof CONNECTOR_RUNTIME_TRANSITION_KINDS)[number];

export type ConnectorRuntimeStateTransition = {
  readonly kind: ConnectorRuntimeTransitionKind;
  readonly from: ConnectorRuntimeExecutionState;
  readonly to: ConnectorRuntimeExecutionState;
};

export type ConnectorRuntimeInvalidTransition = {
  readonly code: "transition-not-allowed";
  readonly from: ConnectorRuntimeExecutionState;
  readonly to: ConnectorRuntimeExecutionState;
  readonly safeMessage: string;
};
