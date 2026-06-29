import { describe, expect, expectTypeOf, it } from "vitest";

import {
  type ReplayCheckpoint,
  type ReplayEligibility,
  type ReplayMetadata
} from "../index.js";

describe("replay contracts", () => {
  it("defines replay metadata without implementing replay execution", () => {
    const metadata = {
      replayId: "replay-1",
      startedAt: "2026-06-29T00:00:00.000Z",
      reason: "verification",
      requestedBy: "test"
    } satisfies ReplayMetadata;

    expect(metadata).toEqual({
      replayId: "replay-1",
      startedAt: "2026-06-29T00:00:00.000Z",
      reason: "verification",
      requestedBy: "test"
    });
  });

  it("defines replay checkpoints for future event stores", () => {
    const checkpoint = {
      checkpointId: "checkpoint-1",
      eventId: "event-1",
      eventVersion: "v1",
      position: "1",
      recordedAt: "2026-06-29T00:00:00.000Z"
    } satisfies ReplayCheckpoint;

    expect(checkpoint).toEqual({
      checkpointId: "checkpoint-1",
      eventId: "event-1",
      eventVersion: "v1",
      position: "1",
      recordedAt: "2026-06-29T00:00:00.000Z"
    });
  });

  it("keeps replay eligibility generic", () => {
    expectTypeOf<ReplayEligibility>().toMatchTypeOf<{
      readonly eligible: boolean;
      readonly reason?: string;
    }>();
  });
});
