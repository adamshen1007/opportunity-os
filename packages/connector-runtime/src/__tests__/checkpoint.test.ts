import { describe, expect, it } from "vitest";
import type { ConnectorRuntimeCheckpoint } from "../index.js";

describe("connector runtime checkpoint contracts", () => {
  it("models checkpoint identity, cursor, snapshot, timestamp, and readiness", () => {
    const checkpoint: ConnectorRuntimeCheckpoint = {
      id: "checkpoint-1",
      cursor: {
        value: "cursor-1",
        source: "generic-source"
      },
      stateSnapshot: {
        state: "paused",
        stage: "process",
        metadata: {
          recordsSeen: 10
        }
      },
      createdAt: "2026-07-01T00:00:00.000Z",
      readiness: {
        replayable: true,
        resumable: true,
        safeMessage: "Checkpoint is ready for continuation."
      }
    };

    expect(checkpoint.id).toBe("checkpoint-1");
    expect(checkpoint.readiness.resumable).toBe(true);
  });
});
