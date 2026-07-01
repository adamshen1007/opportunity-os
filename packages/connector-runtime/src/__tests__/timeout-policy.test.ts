import { describe, expect, it } from "vitest";
import {
  CONNECTOR_RUNTIME_TIMEOUT_RESULT_STATUSES,
  CONNECTOR_RUNTIME_TIMEOUT_SCOPES,
  type ConnectorRuntimeTimeoutPolicy,
  type ConnectorRuntimeTimeoutResult
} from "../index.js";

describe("connector runtime timeout policy contracts", () => {
  it("defines timeout scopes and result statuses", () => {
    expect(CONNECTOR_RUNTIME_TIMEOUT_SCOPES).toEqual([
      "pipeline",
      "stage",
      "operation"
    ]);
    expect(CONNECTOR_RUNTIME_TIMEOUT_RESULT_STATUSES).toEqual([
      "within-limit",
      "timed-out"
    ]);
  });

  it("models timeout duration and result metadata", () => {
    const policy: ConnectorRuntimeTimeoutPolicy = {
      scope: "stage",
      duration: {
        timeoutMs: 5000,
        startedAt: "2026-07-01T00:00:00.000Z",
        deadlineAt: "2026-07-01T00:00:05.000Z"
      }
    };
    const result: ConnectorRuntimeTimeoutResult = {
      status: "timed-out",
      scope: policy.scope,
      duration: policy.duration,
      safeMessage: "Stage exceeded its allowed duration."
    };

    expect(result.duration.timeoutMs).toBe(5000);
  });
});
