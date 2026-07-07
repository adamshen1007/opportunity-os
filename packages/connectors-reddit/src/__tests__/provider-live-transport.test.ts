import { describe, expect, it } from "vitest";
import {
  createRedditFakeTransport,
  createRedditLiveHttpTransport,
  createRedditLiveProviderConfigFromEnv,
  exchangeRedditOAuthToken,
  mapRedditLiveListingResponse,
  parseRedditProviderResponse
} from "../index.js";

describe("reddit live provider transport", () => {
  it("supports production credential environment aliases while keeping live access disabled by default", () => {
    const result = createRedditLiveProviderConfigFromEnv({
      REDDIT_PRODUCTION_CLIENT_ID: "production-client-id",
      REDDIT_PRODUCTION_CLIENT_SECRET: "production-client-secret",
      REDDIT_PRODUCTION_REFRESH_TOKEN: "production-refresh-token",
      REDDIT_PRODUCTION_USER_AGENT: "OpportunityOS/0.0.0 external-mvp",
      REDDIT_LIVE_SUBREDDIT: "startups",
      REDDIT_LIVE_LIMIT: "10"
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.config.enabled).toBe(false);
    expect(result.config.subreddit).toBe("startups");
    expect(result.config.limit).toBe(10);
    expect(result.config.credentials.clientId.sensitive).toBe(true);
    expect(result.config.credentials.clientSecret?.sensitive).toBe(true);
    expect(result.config.credentials.refreshToken?.sensitive).toBe(true);
    expect(JSON.stringify(result)).not.toContain("production-client-secret");
    expect(JSON.stringify(result)).not.toContain("production-refresh-token");
  });

  it("exchanges OAuth credentials through an injected transport without exposing tokens", async () => {
    const transport = createRedditFakeTransport({
      response: {
        body: {
          access_token: "secret-access-token",
          token_type: "bearer",
          expires_in: 3600,
          scope: "read"
        },
        metadata: {
          status: 200,
          receivedAt: "2026-07-05T00:00:00.000Z",
          safeSource: "oauth-fixture"
        }
      }
    });
    const result = await exchangeRedditOAuthToken({
      credentials: {
        clientId: { value: "secret-client-id", sensitive: true },
        clientSecret: { value: "secret-client-secret", sensitive: true },
        userAgent: "OpportunityOS/0.0.0 local-dev"
      },
      transport,
      requestedAt: "2026-07-05T00:00:00.000Z",
      correlationId: "corr_live_oauth"
    });

    expect(result.ok).toBe(true);
    expect(transport.getRequests()[0]?.headers).toContainEqual({
      name: "authorization",
      value: "[REDACTED]",
      sensitive: true
    });
    expect(JSON.stringify({ result, requests: transport.getRequests() })).not.toContain("secret-client-secret");
    expect(JSON.stringify({ result, requests: transport.getRequests() })).not.toContain("secret-client-id");
  });

  it("uses injected fetch for live HTTP transport and returns safe response metadata", async () => {
    const transport = createRedditLiveHttpTransport({
      now: () => "2026-07-05T00:00:00.000Z",
      fetch: async () =>
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "x-ratelimit-limit": "100"
          }
        })
    });
    const result = await transport.send<{ readonly ok: true }>({
      method: "GET",
      url: "https://oauth.reddit.example/r/typescript/new",
      headers: [
        {
          name: "authorization",
          value: "Bearer secret-access-token",
          sensitive: true
        }
      ]
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.response.body).toEqual({ ok: true });
      expect(result.response.metadata.safeSource).toBe("reddit-live-provider");
    }
    expect(JSON.stringify(result)).not.toContain("secret-access-token");
  });

  it("returns safe transport failures for non-OK provider responses", async () => {
    const transport = createRedditLiveHttpTransport({
      now: () => "2026-07-05T00:00:00.000Z",
      fetch: async () =>
        new Response(JSON.stringify({ error: "secret-token raw provider response" }), {
          status: 429,
          statusText: "Too Many Requests",
          headers: {
            "content-type": "application/json",
            "x-ratelimit-remaining": "0",
            "x-ratelimit-reset": "120"
          }
        })
    });
    const result = await transport.send({
      method: "GET",
      url: "https://oauth.reddit.example/r/startups/new",
      headers: [{ name: "authorization", value: "Bearer secret-access-token", sensitive: true }]
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.safeMessage).toBe("Reddit provider request failed with HTTP status 429.");
    expect(result.metadata?.status).toBe(429);
    expect(JSON.stringify(result)).not.toContain("secret-access-token");
    expect(JSON.stringify(result)).not.toContain("raw provider response");
  });

  it("maps Reddit listing responses into safe provider contracts", () => {
    const mapped = mapRedditLiveListingResponse({
      kind: "posts",
      checkedAt: "2026-07-05T00:00:00.000Z",
      requestedLimit: 1,
      headers: [
        { name: "x-ratelimit-limit", value: "100" },
        { name: "x-ratelimit-remaining", value: "99" },
        { name: "x-ratelimit-reset", value: "60" }
      ],
      body: {
        data: {
          after: "safe_cursor",
          before: null,
          children: [
            {
              kind: "t3",
              data: {
                id: "abc123",
                name: "t3_abc123",
                subreddit: "typescript",
                subreddit_id: "t5_typescript",
                author: "fixture_author",
                author_fullname: "t2_fixture_author",
                title: "Fixture Reddit post",
                selftext: "Synthetic body",
                permalink: "/r/typescript/comments/abc123/fixture/",
                score: 42,
                upvote_ratio: 0.91,
                created_utc: 1783209600
              }
            }
          ]
        }
      }
    });

    expect(mapped.ok).toBe(true);
    if (mapped.ok) {
      const parsed = parseRedditProviderResponse(mapped.response);
      expect(parsed.ok).toBe(true);
      if (parsed.ok) {
        expect(parsed.envelope.kind).toBe("posts");
        expect(parsed.envelope.items).toHaveLength(1);
      }
    }
  });
});
