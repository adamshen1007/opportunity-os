import { describe, expect, it } from "vitest";
import {
  CONNECTOR_CAPABILITY_KINDS,
  CONNECTOR_HEALTH_STATUSES,
  CONNECTOR_LIFECYCLE_PHASES,
  CONNECTOR_STABILITY_STATUSES,
  CONNECTOR_VALIDATION_ISSUE_CODES,
  ConnectorError,
  connectorFailure,
  connectorSuccess
} from "../index.js";

describe("connector SDK contract stability", () => {
  it("keeps stable enum-like values", () => {
    expect(CONNECTOR_STABILITY_STATUSES).toEqual([
      "experimental",
      "stable",
      "deprecated"
    ]);
    expect(CONNECTOR_CAPABILITY_KINDS).toEqual([
      "read",
      "sync",
      "validate",
      "health",
      "discover"
    ]);
    expect(CONNECTOR_LIFECYCLE_PHASES).toEqual([
      "configure",
      "validate",
      "initialize",
      "health-check",
      "execute-ready",
      "shutdown"
    ]);
    expect(CONNECTOR_HEALTH_STATUSES).toEqual([
      "healthy",
      "degraded",
      "unhealthy",
      "unknown"
    ]);
    expect(CONNECTOR_VALIDATION_ISSUE_CODES).toEqual([
      "config-invalid",
      "metadata-invalid",
      "capability-invalid",
      "lifecycle-invalid",
      "dependency-invalid"
    ]);
  });

  it("keeps stable result shapes", () => {
    expect(Object.keys(connectorSuccess("value"))).toEqual(["ok", "value"]);
    expect(Object.keys(connectorFailure("error"))).toEqual(["ok", "error"]);
  });

  it("keeps stable safe error shapes", () => {
    const error = new ConnectorError({
      message: "Stable shape."
    });

    expect(Object.keys(error.toJSON())).toEqual([
      "code",
      "category",
      "message",
      "correlationId",
      "requestId"
    ]);
    expect(error.toJSON()).toEqual({
      code: "EXTERNAL_DEPENDENCY_FAILED",
      category: "external_dependency",
      message: "Stable shape.",
      correlationId: undefined,
      requestId: undefined
    });
  });
});
