import { describe, expect, it } from "vitest";
import {
  CONNECTOR_HOST_RUNNER_RESULT_STATUSES,
  type ConnectorHostRunnerFailure
} from "../index.js";

describe("connector host runner contracts", () => {
  it("defines runner result statuses", () => {
    expect(CONNECTOR_HOST_RUNNER_RESULT_STATUSES).toEqual([
      "accepted",
      "rejected"
    ]);
  });

  it("models safe runner failures", () => {
    const failure: ConnectorHostRunnerFailure = {
      ok: false,
      code: "host-runner-rejected",
      safeMessage: "Runner contract rejected the request.",
      correlationId: "correlation-1",
      requestId: "request-1"
    };

    expect(failure.safeMessage).toContain("rejected");
  });
});
