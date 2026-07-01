import { describe, expect, it } from "vitest";
import * as runtime from "../index.js";

describe("connector runtime public exports", () => {
  it("exposes approved runtime constants from the package root", () => {
    expect(runtime.CONNECTOR_RUNTIME_EXECUTION_STATES).toEqual([
      "created",
      "ready",
      "running",
      "paused",
      "succeeded",
      "failed",
      "cancelled",
      "timed-out"
    ]);
    expect(runtime.CONNECTOR_RUNTIME_PIPELINE_STAGE_KINDS).toEqual([
      "prepare",
      "validate",
      "process",
      "finalize"
    ]);
    expect(runtime.CONNECTOR_RUNTIME_RETRY_DECISIONS).toEqual([
      "retry",
      "do-not-retry"
    ]);
    expect(runtime.CONNECTOR_RUNTIME_AGGREGATE_RESULT_STATUSES).toContain(
      "partially-succeeded"
    );
  });

  it("exposes approved runtime helpers from the package root", () => {
    expect(typeof runtime.ConnectorRuntimeError).toBe("function");
    expect(typeof runtime.createConnectorRuntimeError).toBe("function");
    expect(typeof runtime.sanitizeConnectorRuntimeErrorMessage).toBe(
      "function"
    );
  });
});
