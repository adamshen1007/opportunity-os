import type { InfrastructureModuleId } from "../modules/index.js";

export const GRACEFUL_SHUTDOWN_RESULT_STATUSES = [
  "completed",
  "failed",
  "timed-out"
] as const;

export type GracefulShutdownResultStatus =
  (typeof GRACEFUL_SHUTDOWN_RESULT_STATUSES)[number];

export type GracefulShutdownParticipant = {
  readonly id: string;
  readonly moduleId: InfrastructureModuleId;
  readonly order: number;
  readonly timeoutMs?: number;
  readonly optional?: boolean;
};

export type GracefulShutdownFailure = {
  readonly participantId: string;
  readonly code: "shutdown-failed" | "shutdown-timed-out";
  readonly safeMessage: string;
};

export type GracefulShutdownResult =
  | {
      readonly status: "completed";
      readonly participants: readonly GracefulShutdownParticipant[];
      readonly failures: readonly [];
    }
  | {
      readonly status: "failed" | "timed-out";
      readonly participants: readonly GracefulShutdownParticipant[];
      readonly failures: readonly GracefulShutdownFailure[];
    };
