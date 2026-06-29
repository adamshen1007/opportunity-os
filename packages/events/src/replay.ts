import type { EventId } from "./event-metadata.js";
import type { EventVersion } from "./event-version.js";

export type ReplayMetadata = {
  readonly replayId: string;
  readonly startedAt: string;
  readonly reason?: string;
  readonly requestedBy?: string;
};

export type ReplayCheckpoint = {
  readonly checkpointId: string;
  readonly eventId: EventId;
  readonly eventVersion: EventVersion;
  readonly position: string;
  readonly recordedAt: string;
};

export type ReplayEligibility = {
  readonly eligible: boolean;
  readonly reason?: string;
};
