import { describe, expect, it } from "vitest";
import * as host from "../index.js";

describe("connector host public exports", () => {
  it("exposes approved host constants and helpers from the package root", () => {
    expect(host.CONNECTOR_HOST_BOOTSTRAP_STATUSES).toEqual([
      "ready",
      "invalid"
    ]);
    expect(host.CONNECTOR_HOST_RUNNER_RESULT_STATUSES).toEqual([
      "accepted",
      "rejected"
    ]);
    expect(host.CONNECTOR_HOST_EXECUTION_ORCHESTRATION_STATUSES).toEqual([
      "accepted",
      "rejected"
    ]);
    expect(host.CONNECTOR_HOST_RESULT_STATUSES).toContain(
      "validation-failed"
    );
    expect(typeof host.ConnectorHostError).toBe("function");
    expect(typeof host.createConnectorHostError).toBe("function");
    expect(typeof host.sanitizeConnectorHostErrorMessage).toBe("function");
  });
});
