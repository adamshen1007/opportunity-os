import { describe, expect, it } from "vitest";
import {
  createRedditFakeTransport,
  createRedditLiveHttpTransport,
  createRedditLiveApiClient,
  createRedditLiveProviderConfigFromEnv,
  createRedditProviderError,
  createRedditProviderRequestDescription,
  exchangeRedditOAuthToken
} from "../index.js";
import { REDDIT_FAKE_HOST_CONTEXT } from "../testing/index.js";

const unsafePattern =
  /secret-access-token|secret-refresh-token|secret-client-secret|secret-client-id|bearer\s+secret|basic\s+[a-z0-9+/=]+|raw provider response|stack trace|raw cause/iu;

describe("reddit live provider security", () => {
  it("does not serialize production credential values from config or transport failures", async () => {
    const configResult = createRedditLiveProviderConfigFromEnv({
      REDDIT_PRODUCTION_CLIENT_ID: "secret-client-id",
      REDDIT_PRODUCTION_CLIENT_SECRET: "secret-client-secret",
      REDDIT_PRODUCTION_REFRESH_TOKEN: "secret-refresh-token",
      REDDIT_PRODUCTION_USER_AGENT: "OpportunityOS/0.0.0 external-mvp",
      REDDIT_LIVE_TEST_ENABLED: "true"
    });
    const transport = createRedditLiveHttpTransport({
      now: () => "2026-07-05T00:00:00.000Z",
      fetch: async () => {
        throw new Error("secret-access-token raw provider response stack trace");
      }
    });
    const failure = await transport.send({
      method: "GET",
      url: "https://oauth.reddit.example/r/startups/new",
      headers: [{ name: "authorization", value: "Bearer secret-access-token", sensitive: true }]
    });

    expect(configResult.ok).toBe(true);
    expect(failure.ok).toBe(false);
    expect(JSON.stringify({ configResult, failure })).not.toMatch(unsafePattern);
  });

  it("redacts sensitive headers in fake transport history and live client descriptions", async () => {
    const transport = createRedditFakeTransport();
    const description = createRedditProviderRequestDescription({
      endpoint: "posts",
      baseUrl: "https://oauth.reddit.example",
      auth: {
        scheme: "Bearer",
        token: { value: "secret-access-token", sensitive: true }
      },
      correlationId: "corr_live_security"
    });
    const client = createRedditLiveApiClient({
      transport,
      token: {
        tokenType: "bearer",
        accessToken: { value: "secret-access-token", sensitive: true }
      },
      auth: {
        status: "token-valid",
        token: {
          tokenType: "bearer",
          accessToken: { value: "secret-access-token", sensitive: true }
        }
      },
      runtimeContext: REDDIT_FAKE_HOST_CONTEXT
    });
    const result = await client.execute({ description });

    expect(result.description.headers?.[0]?.value).toBe("Bearer [REDACTED]");
    expect(transport.getRequests()[0]?.headers?.find((header) => header.name === "authorization")?.value).toBe("[REDACTED]");
    expect(JSON.stringify({ result, requests: transport.getRequests() })).not.toMatch(unsafePattern);
  });

  it("keeps OAuth failures and provider errors secret-safe", async () => {
    const tokenResult = await exchangeRedditOAuthToken({
      credentials: {
        clientId: { value: "secret-client-id", sensitive: true },
        clientSecret: { value: "secret-client-secret", sensitive: true },
        refreshToken: { value: "secret-refresh-token", sensitive: true },
        userAgent: "OpportunityOS/0.0.0 local-dev"
      },
      transport: createRedditFakeTransport({
        response: {
          body: {
            error: "invalid_grant"
          },
          metadata: {
            status: 200,
            safeSource: "oauth-fixture"
          }
        }
      }),
      requestedAt: "2026-07-05T00:00:00.000Z",
      correlationId: "corr_live_oauth_failure"
    });
    const error = createRedditProviderError({
      message:
        "secret-client-secret secret-access-token secret-refresh-token raw provider response stack trace raw cause",
      correlationId: "corr_live_provider_error",
      cause: new Error("secret-access-token raw cause")
    });

    expect(tokenResult.ok).toBe(false);
    expect(JSON.stringify({ tokenResult, error: error.toJSON() })).not.toMatch(unsafePattern);
  });
});
