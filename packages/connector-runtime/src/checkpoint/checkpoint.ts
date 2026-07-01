import type { ConnectorRuntimeExecutionState } from "../state/index.js";

export type ConnectorRuntimeCheckpointId = string;

export type ConnectorRuntimeCheckpointCursor = {
  readonly value: string;
  readonly source?: string;
};

export type ConnectorRuntimeStateSnapshotMetadata = {
  readonly state: ConnectorRuntimeExecutionState;
  readonly stage?: string;
  readonly metadata?: Readonly<Record<string, string | number | boolean>>;
};

export type ConnectorRuntimeReplayReadiness = {
  readonly replayable: boolean;
  readonly resumable: boolean;
  readonly safeMessage?: string;
};

export type ConnectorRuntimeCheckpoint = {
  readonly id: ConnectorRuntimeCheckpointId;
  readonly cursor?: ConnectorRuntimeCheckpointCursor;
  readonly stateSnapshot: ConnectorRuntimeStateSnapshotMetadata;
  readonly createdAt: string;
  readonly readiness: ConnectorRuntimeReplayReadiness;
};
