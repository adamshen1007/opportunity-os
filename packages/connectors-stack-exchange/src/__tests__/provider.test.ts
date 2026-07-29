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
      pageSize: 100
    });
    expect(url.pathname).toBe("/2.3/search/advanced");
    expect(url.searchParams.get("q")).toBe("manual deployment");
    expect(url.searchParams.get("pagesize")).toBe("25");
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
    }), { status: 200 })) as unknown as typeof globalThis.fetch;
    const result = await searchStackExchange({
      config: createStackExchangeProviderConfigFromEnv({
        STACK_EXCHANGE_LIVE_SCAN_ENABLED: "true",
        STACK_EXCHANGE_API_KEY: "unsafe-secret-key"
      }),
      request: { query: "workflow" },
      fetch
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
    }), { status: 200 })) as unknown as typeof globalThis.fetch;

    const result = await searchStackExchange({
      config: createStackExchangeProviderConfigFromEnv({ STACK_EXCHANGE_LIVE_SCAN_ENABLED: "true" }),
      request: { query: "deployment authorization" },
      fetch
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.items[0]?.title).toContain("Authorization failure");
    expect(result.result.items[0]?.bodyText).toContain("stack trace");
    expect(result.result.items[0]?.bodyText).not.toContain("supersecretvalue");
    expect(result.result.items[0]?.bodyText).not.toContain("abcdefghijklmnop");
    expect(result.result.items[0]?.bodyText).toContain("[REDACTED]");
  });

  it("returns safe errors for throttling and malformed responses", async () => {
    const config = createStackExchangeProviderConfigFromEnv({ STACK_EXCHANGE_LIVE_SCAN_ENABLED: "true" });
    const throttled = await searchStackExchange({
      config,
      request: { query: "workflow" },
      fetch: vi.fn(async () => new Response("limited", { status: 429 })) as unknown as typeof globalThis.fetch
    });
    expect(throttled).toEqual({ ok: false, error: { code: "rate-limited", message: "Stack Exchange request was not successful." } });
  });
});
