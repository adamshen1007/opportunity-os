import type {
  ConnectorLifecycle,
  ConnectorLifecyclePhase,
  ConnectorLifecycleState,
  ConnectorLifecycleTransition
} from "@opportunity-os/connectors";

export const CONNECTOR_HOST_LIFECYCLE_PHASES = [
  "configure",
  "validate",
  "initialize",
  "health-check",
  "execute-ready",
  "shutdown"
] as const satisfies readonly ConnectorLifecyclePhase[];

export type ConnectorHostLifecyclePhase =
  (typeof CONNECTOR_HOST_LIFECYCLE_PHASES)[number];

export type ConnectorHostLifecycleOrchestrationInput = {
  readonly lifecycle: ConnectorLifecycle;
  readonly requiredPhases: readonly ConnectorHostLifecyclePhase[];
};

export type ConnectorHostLifecycleOrchestrationOutput = {
  readonly states: readonly ConnectorLifecycleState[];
  readonly transitions?: readonly ConnectorLifecycleTransition[];
  readonly safeMessage?: string;
};

export type ConnectorHostLifecycleOrchestrationContract = {
  readonly input: ConnectorHostLifecycleOrchestrationInput;
  readonly output?: ConnectorHostLifecycleOrchestrationOutput;
};
