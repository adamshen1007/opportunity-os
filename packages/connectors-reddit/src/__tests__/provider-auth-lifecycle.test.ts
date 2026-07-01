import { describe, expect, it } from "vitest";
import {
  REDDIT_PROVIDER_AUTH_LIFECYCLE_STATES,
  createRedditProviderAuthLifecycleSnapshot
} from "../index.js";

describe("reddit provider auth lifecycle contracts", () => {
  it("defines stable auth lifecycle states without exchange behavior", () => {
    expect(REDDIT_PROVIDER_AUTH_LIFECYCLE_STATES).toEqual([
      "unauthenticated",
      "configured",
      "token-valid",
      "token-expiring",
      "refresh-required",
      "failed",
      "revoked"
    ]);
  });

  it("creates safe lifecycle snapshots without secrets", () => {
    const snapshot = createRedditProviderAuthLifecycleSnapshot({
      state: "token-expiring",
      checkedAt: "2026-07-01T00:00:00.000Z",
      expiresAt: "2026-07-01T00:05:00.000Z",
      refreshAfter: "2026-07-01T00:04:00.000Z",
      safeMessage: "Token is nearing expiration."
    });
    const serialized = JSON.stringify(snapshot);

    expect(snapshot.state).toBe("token-expiring");
    expect(serialized).not.toContain("access-token");
    expect(serialized).not.toContain("refresh-token");
  });
});
