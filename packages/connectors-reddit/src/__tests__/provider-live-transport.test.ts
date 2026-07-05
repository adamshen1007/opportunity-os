import { describe, expect, it } from "vitest";
import {
  createRedditFakeTransport,
  createRedditLiveHttpTransport,
  exchangeRedditOAuthToken,
  mapRedditLiveListingResponse,
  parseRedditProviderResponse
} from "../index.js";

describe("reddit live provider transport", () => {
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
