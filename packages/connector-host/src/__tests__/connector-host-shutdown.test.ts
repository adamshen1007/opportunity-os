import { describe, expect, it } from "vitest";
import {
  CONNECTOR_HOST_SHUTDOWN_RESULT_STATUSES,
  type ConnectorHostShutdownResult
} from "../index.js";

describe("connector host shutdown contracts", () => {
  it("defines shutdown result statuses", () => {
    expect(CONNECTOR_HOST_SHUTDOWN_RESULT_STATUSES).toEqual([
      "completed",
      "failed",
      "timed-out"
    ]);
  });

  it("models ordered participants, timeout metadata, and safe failures", () => {
    const result: ConnectorHostShutdownResult = {
      status: "timed-out",
      plan: {
        participants: [
          {
            id: "runtime",
            moduleId: "connector-host",
            order: 10,
            timeoutMs: 1000,
            connectorHostRole: "runtime"
          }
        ],
        timeout: {
          timeoutMs: 1000,
          participantId: "runtime",
          safeMessage: "Runtime boundary did not finish within its timeout."
        }
      },
      failures: [
        {
          participantId: "runtime",
          code: "shutdown-timed-out",
          safeMessage: "Runtime boundary timed out.",
          correlationId: "correlation-1"
        }
      ]
    };

    expect(result.status).toBe("timed-out");
    expect(result.failures[0]?.safeMessage).not.toContain("password");
  });
});
