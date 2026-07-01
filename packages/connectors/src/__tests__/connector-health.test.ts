import { describe, expect, it } from "vitest";
import {
  CONNECTOR_HEALTH_STATUSES,
  type ConnectorHealthCheckContract,
  type ConnectorHealthResult
} from "../index.js";

describe("connector health contracts", () => {
  it("defines stable health statuses", () => {
    expect(CONNECTOR_HEALTH_STATUSES).toEqual([
      "healthy",
      "degraded",
      "unhealthy",
      "unknown"
    ]);
  });

  it("models health metadata with safe messages and capability references", () => {
    const result: ConnectorHealthResult = {
      health: {
        connectorId: "generic-source",
        status: "degraded",
        checkedAt: "2026-07-01T00:00:00.000Z",
        safeMessage: "Connector is reachable with reduced capability.",
        details: {
          latencyMs: 120,
          sampled: true
        },
        capabilities: ["read", "health"]
      }
    };
    const check: ConnectorHealthCheckContract = {
      name: "readiness",
      capabilities: ["health"]
    };

    expect(result.health.safeMessage).toBe(
      "Connector is reachable with reduced capability."
    );
    expect(check.capabilities).toEqual(["health"]);
  });
});
