import { describe, expect, it } from "vitest";
import { createLocalApiDispatcher } from "../server.js";

function createTestDispatcher() {
  return createLocalApiDispatcher({
    serviceName: "opportunity-os-api-test",
    version: "test",
    environment: "local",
    clock: () => "2026-07-05T00:00:00.000Z"
  });
}

describe("local API server", () => {
  it("dispatches health and opportunity routes without opening a test socket", async () => {
    const dispatch = createTestDispatcher();

    const health = await dispatch({
      method: "GET",
      path: "/health",
      headers: {
        "x-correlation-id": "correlation-local-server-test"
      }
    });

    expect(health.ok).toBe(true);
    expect(health.ok ? health.data : undefined).toMatchObject({
      status: "ok",
      environment: "local",
      dependencies: []
    });

    const opportunities = await dispatch({
      method: "GET",
      path: "/opportunities",
      query: {
        limit: "10"
      },
      headers: {
        "x-correlation-id": "correlation-local-server-test"
      }
    });

    expect(opportunities.ok).toBe(true);
    expect(opportunities.ok ? opportunities.data : undefined).toMatchObject({
      opportunities: [{ opportunityId: "opportunity-synthetic-1" }]
    });
  });
});
