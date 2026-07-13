import { describe, expect, it } from "vitest";
import type { ServerResponse } from "node:http";
import { applyCorsHeaders, applySecurityHeaders, createLocalApiDispatcher } from "../server.js";

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

  it("restores a persisted scan through its stable scan id", async () => {
    const dispatch = createTestDispatcher();
    const created = await dispatch({ method: "POST", path: "/scans", body: { source: "stack-exchange", mode: "fixture" } });
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const scanId = (created.data as { scanId: string }).scanId;
    const restored = await dispatch({ method: "GET", path: `/scans/${scanId}` });
    expect(restored.ok).toBe(true);
    expect(restored.ok ? restored.data : undefined).toMatchObject({ scanId });
  });

  it("reports configured production dependencies without exposing configuration values", async () => {
    const dispatch = createLocalApiDispatcher({
      healthDependencies: async () => [{
        name: "stack-exchange",
        status: "ok",
        checkedAt: "2026-07-05T00:00:00.000Z",
        safeMessage: "Stack Exchange live scans are enabled."
      }]
    });
    const health = await dispatch({ method: "GET", path: "/health" });
    expect(health.ok).toBe(true);
    expect(health.ok ? health.data : undefined).toMatchObject({ dependencies: [{ name: "stack-exchange", status: "ok" }] });
    expect(JSON.stringify(health)).not.toMatch(/api[_-]?key|password|secret|token/iu);
  });

  it("applies stable security and origin policy without opening a socket", () => {
    const headers = new Map<string, string>();
    const response = {
      setHeader(name: string, value: string) {
        headers.set(name, value);
        return this;
      }
    } as unknown as ServerResponse;
    applySecurityHeaders(response);
    expect(applyCorsHeaders(response, "https://opportunity-os-web.vercel.app", ["https://opportunity-os-web.vercel.app"])).toBe(true);
    expect(headers.get("access-control-allow-origin")).toBe("https://opportunity-os-web.vercel.app");
    expect(headers.get("x-content-type-options")).toBe("nosniff");
    expect(headers.get("x-frame-options")).toBe("DENY");
    expect(headers.get("vary")).toBe("Origin");
    expect(applyCorsHeaders(response, "https://unknown.example", ["https://opportunity-os-web.vercel.app"])).toBe(false);
  });
});
