import type { InfrastructureModuleId } from "../modules/index.js";

export const INFRASTRUCTURE_LIFECYCLE_PHASES = [
  "register",
  "validate",
  "compose",
  "start",
  "ready",
  "shutdown"
] as const;

export type InfrastructureLifecyclePhase =
  (typeof INFRASTRUCTURE_LIFECYCLE_PHASES)[number];

export type InfrastructureLifecycleParticipantId = string;

export type InfrastructureLifecycleParticipant = {
  readonly id: InfrastructureLifecycleParticipantId;
  readonly moduleId: InfrastructureModuleId;
  readonly phase: InfrastructureLifecyclePhase;
  readonly order: number;
  readonly timeoutMs?: number;
  readonly dependencies?: readonly InfrastructureLifecycleParticipantId[];
};

export type InfrastructureLifecycleOrder = {
  readonly startup: readonly InfrastructureLifecycleParticipantId[];
  readonly shutdown: readonly InfrastructureLifecycleParticipantId[];
};
