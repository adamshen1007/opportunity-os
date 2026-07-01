import type {
  GracefulShutdownFailure,
  GracefulShutdownParticipant,
  GracefulShutdownResult
} from "@opportunity-os/infrastructure";
import type { CorrelationId, RequestId } from "@opportunity-os/shared";

export const CONNECTOR_HOST_SHUTDOWN_RESULT_STATUSES = [
  "completed",
  "failed",
  "timed-out"
] as const;

export type ConnectorHostShutdownResultStatus =
  (typeof CONNECTOR_HOST_SHUTDOWN_RESULT_STATUSES)[number];

export type ConnectorHostShutdownParticipant = GracefulShutdownParticipant & {
  readonly connectorHostRole?: "host" | "runtime" | "connector";
};

export type ConnectorHostShutdownTimeoutMetadata = {
  readonly timeoutMs: number;
  readonly participantId?: string;
  readonly safeMessage?: string;
};

export type ConnectorHostShutdownFailure = GracefulShutdownFailure & {
  readonly correlationId: CorrelationId;
  readonly requestId?: RequestId;
};

export type ConnectorHostShutdownPlan = {
  readonly participants: readonly ConnectorHostShutdownParticipant[];
  readonly timeout?: ConnectorHostShutdownTimeoutMetadata;
};

export type ConnectorHostShutdownResult =
  | {
      readonly status: "completed";
      readonly plan: ConnectorHostShutdownPlan;
      readonly failures: readonly [];
      readonly infrastructureResult?: GracefulShutdownResult;
    }
  | {
      readonly status: "failed" | "timed-out";
      readonly plan: ConnectorHostShutdownPlan;
      readonly failures: readonly ConnectorHostShutdownFailure[];
      readonly infrastructureResult?: GracefulShutdownResult;
    };
