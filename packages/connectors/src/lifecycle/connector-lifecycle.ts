export const CONNECTOR_LIFECYCLE_PHASES = [
  "configure",
  "validate",
  "initialize",
  "health-check",
  "execute-ready",
  "shutdown"
] as const;

export type ConnectorLifecyclePhase =
  (typeof CONNECTOR_LIFECYCLE_PHASES)[number];

export type ConnectorLifecycleState = {
  readonly phase: ConnectorLifecyclePhase;
  readonly ready: boolean;
  readonly safeMessage?: string;
};

export type ConnectorLifecycleTransition = {
  readonly from: ConnectorLifecyclePhase;
  readonly to: ConnectorLifecyclePhase;
};

export type ConnectorLifecycle = {
  readonly phases: readonly ConnectorLifecyclePhase[];
  readonly transitions?: readonly ConnectorLifecycleTransition[];
};
