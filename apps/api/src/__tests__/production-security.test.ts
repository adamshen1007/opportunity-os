import { describe, expect, it } from "vitest";
import { createLocalApiDispatcher } from "../server.js";
import { createFixedWindowRateLimiter } from "../security/index.js";

describe("production API controls", () => {
  it("requires the configured access token for live scans", async () => {
    const dispatch = createLocalApiDispatcher({ liveScanAccessToken: "pilot-access-code" });
    const denied = await dispatch({ method: "POST", path: "/scans", body: { mode: "live" } });
    expect(denied.ok).toBe(false);
    expect(denied.ok ? undefined : denied.error.statusCode).toBe(401);
  });

  it("limits repeated scan requests deterministically", async () => {
    const dispatch = createLocalApiDispatcher({
      scanRateLimiter: createFixedWindowRateLimiter({ limit: 1, windowMs: 60_000 })
    });
    const input = { method: "POST", path: "/scans", body: { mode: "fixture" }, headers: { "x-request-id": "same-client" } } as const;
    expect((await dispatch(input)).ok).toBe(true);
    const limited = await dispatch(input);
    expect(limited.ok).toBe(false);
    expect(limited.ok ? undefined : limited.error.statusCode).toBe(429);
  });
});
