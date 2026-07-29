import { describe, expect, it, vi } from "vitest";
import {
  STACK_EXCHANGE_FIXTURE_RESULT,
  buildStackExchangeSearchUrl,
  createStackExchangeProviderConfigFromEnv,
  searchStackExchange
} from "../index.js";

describe("Stack Exchange provider", () => {
  it("uses deterministic fixtures unless live access is explicitly enabled", async () => {
    const result = await searchStackExchange({
      config: createStackExchangeProviderConfigFromEnv({}),
      request: { query: "deployment" }
    });
    expect(result).toEqual({ ok: true, result: STACK_EXCHANGE_FIXTURE_RESULT });
  });

  it("builds deterministic, bounded search requests", () => {
    const config = createStackExchangeProviderConfigFromEnv({
      STACK_EXCHANGE_LIVE_SCAN_ENABLED: "true",
      STACK_EXCHANGE_API_KEY: "test-key"
    });
    const url = buildStackExchangeSearchUrl(config, {
      query: "manual deployment",
      tags: ["typescript", "deployment"],
      page: 2,
      pageSize: 100
    });
    expect(url.pathname).toBe("/2.3/search/advanced");
    expect(url.searchParams.get("q")).toBe("manual deployment");
    expect(url.searchParams.get("pagesize")).toBe("25");
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("tagged")).toBe("typescript;deployment");
    expect(url.toString()).not.toContain("test-key");
  });

  it("maps live responses without exposing configuration secrets", async () => {
    const fetch = vi.fn(async () => new Response(JSON.stringify({
      items: [{
        question_id: 42,
        title: "Manual &amp; fragile workflow",
        body_markdown: "A safe public description.",
        link: "https://stackoverflow.com/questions/42/example",
        score: 7,
        answer_count: 2,
        tags: ["workflow"],
        creation_date: 1_700_000_000,
        owner: { user_id: 9, display_name: "Example User" }
      }],
      has_more: false,
      quota_remaining: 99,
      quota_max: 100
    }), { status: 200 }));
    const result = await searchStackExchange({
      config: createStackExchangeProviderConfigFromEnv({
        STACK_EXCHANGE_LIVE_SCAN_ENABLED: "true",
        STACK_EXCHANGE_API_KEY: "unsafe-secret-key"
      }),
      request: { query: "workflow" },
      fetch: fetch as unknown as typeof globalThis.fetch
    });
    expect(result.ok).toBe(true);
    expect(result.ok ? result.result.items[0]?.title : undefined).toBe("Manual & fragile workflow");
    expect(JSON.stringify(result)).not.toContain("unsafe-secret-key");
  });

  it("preserves legitimate security discussions while redacting credential-shaped values", async () => {
    const fetch = vi.fn(async () => new Response(JSON.stringify({
      items: [{
        question_id: 43,
        title: "Authorization failure during deployment",
        body_markdown: "The stack trace points to an authorization check. password=supersecretvalue and Authorization: Bearer abcdefghijklmnop must not survive.",
        link: "https://stackoverflow.com/questions/43/example",
        creation_date: 1_700_000_000
      }],
      quota_remaining: 98,
      quota_max: 100
    }), { status: 200 }));

    const result = await searchStackExchange({
      config: createStackExchangeProviderConfigFromEnv({ STACK_EXCHANGE_LIVE_SCAN_ENABLED: "true" }),
      request: { query: "deployment authorization" },
      fetch: fetch as unknown as typeof globalThis.fetch
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.items[0]?.title).toContain("Authorization failure");
    expect(result.result.items[0]?.bodyText).toContain("stack trace");
    expect(result.result.items[0]?.bodyText).not.toContain("supersecretvalue");
    expect(result.result.items[0]?.bodyText).not.toContain("abcdefghijklmnop");
    expect(result.result.items[0]?.bodyText).toContain("[REDACTED]");
  });

  it("preserves pagination, backoff, and exhausted quota metadata", async () => {
    const config = createStackExchangeProviderConfigFromEnv({ STACK_EXCHANGE_LIVE_SCAN_ENABLED: "true" });
    const fetch = vi.fn(async () => new Response(JSON.stringify({
      items: [{
        question_id: 44,
        title: "Deployment workflow",
        link: "https://stackoverflow.com/questions/44/example",
        creation_date: 1_700_000_000
      }],
      has_more: true,
      quota_remaining: 0,
      quota_max: 300,
      backoff: 30
    }), { status: 200 }));

    const result = await searchStackExchange({
      config,
      request: { query: "deployment", page: 2, pageSize: 5 },
      fetch: fetch as unknown as typeof globalThis.fetch
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.quota).toEqual({ remaining: 0, maximum: 300, backoffSeconds: 30, hasMore: true });
    expect(fetch).toHaveBeenCalledOnce();
  });

  it("returns safe errors for throttling, malformed responses, timeouts, and downtime", async () => {
    const config = createStackExchangeProviderConfigFromEnv({ STACK_EXCHANGE_LIVE_SCAN_ENABLED: "true" });
    const throttled = await searchStackExchange({
      config,
      request: { query: "workflow" },
      fetch: vi.fn(async () => new Response("limited", { status: 429, headers: { "retry-after": "45" } })) as unknown as typeof globalThis.fetch
    });
    expect(throttled).toEqual({
      ok: false,
      error: { code: "rate-limited", message: "Stack Exchange request was not successful.", retryAfterSeconds: 45 }
    });

    const malformed = await searchStackExchange({
      config,
      request: { query: "workflow" },
      fetch: vi.fn(async () => new Response(JSON.stringify({ items: [{ title: "missing required fields" }] }), { status: 200 })) as unknown as typeof globalThis.fetch
    });
    expect(malformed).toEqual({ ok: false, error: { code: "response-invalid", message: "Stack Exchange returned an invalid response." } });

    const timedOut = await searchStackExchange({
      config,
      request: { query: "workflow" },
      fetch: vi.fn(async () => { throw new DOMException("aborted", "AbortError"); }) as unknown as typeof globalThis.fetch
    });
    expect(timedOut).toEqual({ ok: false, error: { code: "timeout", message: "Stack Exchange request timed out safely." } });

    const unavailable = await searchStackExchange({
      config,
      request: { query: "workflow" },
      fetch: vi.fn(async () => { throw new Error("provider response and secret-token"); }) as unknown as typeof globalThis.fetch
    });
    expect(unavailable).toEqual({ ok: false, error: { code: "request-failed", message: "Stack Exchange request failed safely." } });
    expect(JSON.stringify({ timedOut, unavailable })).not.toContain("secret-token");
  });
});
