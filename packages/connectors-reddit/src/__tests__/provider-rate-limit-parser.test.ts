import { describe, expect, it } from "vitest";
import {
  REDDIT_PROVIDER_RATE_LIMIT_HEADER_KEYS,
  parseRedditProviderRateLimitMetadata
} from "../index.js";

describe("reddit provider rate-limit parser", () => {
  it("maps provider header metadata into reddit rate-limit contracts", () => {
    const metadata = parseRedditProviderRateLimitMetadata({
      checkedAt: "2026-07-01T00:00:00.000Z",
      headers: [
        { name: "x-ratelimit-limit", value: "100" },
        { name: "x-ratelimit-remaining", value: "42" },
        { name: "x-ratelimit-reset", value: "60" }
      ]
    });

    expect(REDDIT_PROVIDER_RATE_LIMIT_HEADER_KEYS).toEqual([
      "x-ratelimit-limit",
      "x-ratelimit-remaining",
      "x-ratelimit-reset"
    ]);
    expect(metadata).toEqual({
      limit: 100,
      remaining: 42,
      resetAt: "2026-07-01T00:01:00.000Z",
      window: {
        windowName: "provider-window",
        windowSeconds: 60
      },
      safeSourceMetadata: {
        source: "provider-rate-limit",
        fallback: false
      }
    });
  });

  it("uses safe fallback metadata for missing or malformed values", () => {
    const metadata = parseRedditProviderRateLimitMetadata({
      checkedAt: "not-a-date",
      limit: "not-a-number",
      remaining: -1,
      resetAfterSeconds: "bad"
    });
    const serialized = JSON.stringify(metadata);

    expect(metadata.window.windowName).toBe("unknown");
    expect(metadata.safeSourceMetadata).toEqual({
      source: "provider-rate-limit",
      fallback: true
    });
    expect(serialized).not.toContain("authorization");
    expect(serialized).not.toContain("token");
  });

  it("keeps provider rate-limit parsing stable for exhausted live limits", () => {
    const metadata = parseRedditProviderRateLimitMetadata({
      checkedAt: "2026-07-05T00:00:00.000Z",
      headers: [
        { name: "X-RateLimit-Limit", value: "60" },
        { name: "X-RateLimit-Remaining", value: "0" },
        { name: "X-RateLimit-Reset", value: "120" }
      ]
    });

    expect(metadata.remaining).toBe(0);
    expect(metadata.resetAt).toBe("2026-07-05T00:02:00.000Z");
    expect(metadata.safeSourceMetadata?.fallback).toBe(false);
  });
});
