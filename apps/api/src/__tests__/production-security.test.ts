import { describe, expect, it } from "vitest";
import { createLocalApiDispatcher } from "../server.js";
import { createFixedWindowRateLimiter } from "../security/index.js";
import { createSyntheticApiInviteStore } from "../testing/index.js";

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

  it("protects production routes with active sessions and a separate admin gate", async () => {
    const dispatch = createLocalApiDispatcher({
      requireAuthentication: true,
      adminAccessToken: "admin-only-token",
      inviteStore: createSyntheticApiInviteStore()
    });
    const denied = await dispatch({ method: "GET", path: "/opportunities" });
    expect(denied.ok).toBe(false);
    expect(denied.ok ? undefined : denied.error.statusCode).toBe(401);
    const allowed = await dispatch({
      method: "GET",
      path: "/opportunities",
      headers: { "x-opportunity-os-session-id": "session-synthetic-1" }
    });
    expect(allowed.ok).toBe(true);
    const inviteDenied = await dispatch({ method: "POST", path: "/auth/invites", body: {} });
    expect(inviteDenied.ok).toBe(false);
    const inviteAllowed = await dispatch({
      method: "POST",
      path: "/auth/invites",
      headers: { "x-opportunity-os-admin-token": "admin-only-token" },
      body: { email: "new.partner@example.com", inviteCode: "safe-one-time-code" }
    });
    expect(inviteAllowed.ok).toBe(true);
  });
});
