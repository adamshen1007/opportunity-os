import { describe, expect, it } from "vitest";
import {
  CONNECTOR_HOST_BOOTSTRAP_STATUSES,
  CONNECTOR_HOST_EXECUTION_ORCHESTRATION_STATUSES,
  CONNECTOR_HOST_HEALTH_STATUSES,
  CONNECTOR_HOST_LIFECYCLE_PHASES,
  CONNECTOR_HOST_RESULT_STATUSES,
  CONNECTOR_HOST_RUNNER_RESULT_STATUSES,
  CONNECTOR_HOST_SHUTDOWN_RESULT_STATUSES,
  CONNECTOR_HOST_STARTUP_ISSUE_CODES,
  type ConnectorHostResult,
  type SafeConnectorHostErrorDetails
} from "../index.js";

describe("connector host contract stability", () => {
  it("locks host status and issue vocabularies", () => {
    expect(CONNECTOR_HOST_BOOTSTRAP_STATUSES).toEqual(["ready", "invalid"]);
    expect(CONNECTOR_HOST_RUNNER_RESULT_STATUSES).toEqual([
      "accepted",
      "rejected"
    ]);
    expect(CONNECTOR_HOST_LIFECYCLE_PHASES).toEqual([
      "configure",
      "validate",
      "initialize",
      "health-check",
      "execute-ready",
      "shutdown"
    ]);
    expect(CONNECTOR_HOST_STARTUP_ISSUE_CODES).toEqual([
      "missing-configuration",
      "invalid-configuration-binding",
      "missing-container-binding",
      "missing-logger-binding",
      "invalid-event-publisher-binding",
      "invalid-runtime-contract",
      "invalid-lifecycle-contract",
      "invalid-health-contract",
      "unsafe-message"
    ]);
    expect(CONNECTOR_HOST_SHUTDOWN_RESULT_STATUSES).toEqual([
      "completed",
      "failed",
      "timed-out"
    ]);
    expect(CONNECTOR_HOST_HEALTH_STATUSES).toEqual([
      "healthy",
      "degraded",
      "unhealthy",
      "unknown"
    ]);
    expect(CONNECTOR_HOST_EXECUTION_ORCHESTRATION_STATUSES).toEqual([
      "accepted",
      "rejected"
    ]);
    expect(CONNECTOR_HOST_RESULT_STATUSES).toEqual([
      "succeeded",
      "partially-succeeded",
      "failed",
      "validation-failed",
      "shutdown-failed"
    ]);
  });

  it("locks result and safe error shapes", () => {
    const safeError: SafeConnectorHostErrorDetails = {
      code: "INFRASTRUCTURE_UNAVAILABLE",
      category: "infrastructure",
      message: "Safe host failure.",
      correlationId: "correlation-1",
      requestId: "request-1"
    };
    const result: ConnectorHostResult = {
      status: "failed",
      metadata: {
        hostId: "host-1",
        correlationId: "correlation-1",
        requestId: "request-1"
      },
      errors: [safeError]
    };

    expect(Object.keys(safeError).sort()).toEqual([
      "category",
      "code",
      "correlationId",
      "message",
      "requestId"
    ]);
    expect(Object.keys(result).sort()).toEqual([
      "errors",
      "metadata",
      "status"
    ]);
  });
});
