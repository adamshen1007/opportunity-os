import { describe, expect, expectTypeOf, it } from "vitest";
import {
  GRACEFUL_SHUTDOWN_RESULT_STATUSES,
  type GracefulShutdownParticipant,
  type GracefulShutdownResult,
  type GracefulShutdownResultStatus
} from "../index.js";

describe("graceful shutdown contracts", () => {
  it("defines stable shutdown result statuses", () => {
    expect(GRACEFUL_SHUTDOWN_RESULT_STATUSES).toEqual([
      "completed",
      "failed",
      "timed-out"
    ]);
  });

  it("represents ordered shutdown participants and safe failures", () => {
    const participant: GracefulShutdownParticipant = {
      id: "events-stop",
      moduleId: "events",
      order: 10,
      timeoutMs: 2_000
    };
    const result: GracefulShutdownResult = {
      status: "timed-out",
      participants: [participant],
      failures: [
        {
          participantId: "events-stop",
          code: "shutdown-timed-out",
          safeMessage: "Shutdown participant exceeded its timeout."
        }
      ]
    };

    expect(result.failures[0]?.safeMessage).toBe(
      "Shutdown participant exceeded its timeout."
    );
  });

  it("exports status as a literal union", () => {
    expectTypeOf<GracefulShutdownResultStatus>().toEqualTypeOf<
      (typeof GRACEFUL_SHUTDOWN_RESULT_STATUSES)[number]
    >();
  });
});
