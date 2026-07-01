import { describe, expect, it } from "vitest";
import {
  CONNECTOR_HOST_HEALTH_STATUSES,
  type ConnectorHostHealthResult
} from "../index.js";

describe("connector host health contracts", () => {
  it("defines host health statuses", () => {
    expect(CONNECTOR_HOST_HEALTH_STATUSES).toEqual([
      "healthy",
      "degraded",
      "unhealthy",
      "unknown"
    ]);
  });

  it("aggregates host, runtime, and connector health metadata", () => {
    const result: ConnectorHostHealthResult = {
      status: "degraded",
      aggregate: {
        host: {
          hostId: "host-1",
          status: "degraded",
          checkedAt: "2026-07-01T00:00:00.000Z",
          correlationId: "correlation-1",
          safeMessage: "One connector boundary is degraded."
        },
        runtime: {
          status: "healthy",
          checkedAt: "2026-07-01T00:00:00.000Z",
          metrics: {
            counts: {
              processed: 1,
              succeeded: 1,
              failed: 0
            },
            durations: {
              totalMs: 10
            },
            attempts: {
              attempts: 1
            }
          }
        },
        connectors: {
          status: "degraded",
          results: [
            {
              health: {
                connectorId: "generic-source",
                status: "degraded",
                checkedAt: "2026-07-01T00:00:00.000Z",
                safeMessage: "Connector boundary is degraded."
              }
            }
          ]
        }
      },
      failures: []
    };

    expect(result.aggregate.connectors.results).toHaveLength(1);
    expect(result.aggregate.host.safeMessage).not.toContain("token");
  });
});
