import { describe, expect, it } from "vitest";
import {
  REDDIT_PROVIDER_FIXTURE_REQUEST,
  REDDIT_PROVIDER_FIXTURE_TRANSPORT_RESPONSE,
  createRedditFakeTransport,
  createRedditProviderError,
  createRedditProviderRequestDescription,
  parseRedditProviderRateLimitMetadata,
  parseRedditProviderResponse
} from "../index.js";

const unsafePattern =
  /secret-value|token-value|raw-token|authorization:\s*bearer|provider-key|credential-value|postgres:\/\/|database-url|raw-provider-response|raw-payload|stack trace|raw cause|client-secret|access-token|refresh-token/iu;

describe("reddit provider transport security hardening", () => {
  it("does not leak OAuth values from request descriptions or fixtures", () => {
    const description = createRedditProviderRequestDescription({
      endpoint: "posts",
      baseUrl: "https://provider.example",
      auth: {
        scheme: "Bearer",
        token: {
          value: "raw-token-value",
          sensitive: true
        }
      },
      correlationId: "corr_security_provider"
    });

    expect(JSON.stringify(description)).not.toMatch(unsafePattern);
    expect(JSON.stringify(REDDIT_PROVIDER_FIXTURE_REQUEST)).not.toMatch(unsafePattern);
  });

  it("does not leak raw values from parser failures, rate limits, errors, telemetry-shaped output, or fake transport", async () => {
    const malformed = parseRedditProviderResponse({
      kind: "posts",
      items: [{ token: "raw-token-value" }]
    });
    const rateLimit = parseRedditProviderRateLimitMetadata({
      checkedAt: "2026-07-01T00:00:00.000Z",
      headers: [
        { name: "authorization", value: "bearer raw-token-value", sensitive: true }
      ]
    });
    const error = createRedditProviderError({
      message:
        "client_secret=secret-value access_token=access-token refresh_token=refresh-token raw provider response stack trace raw cause",
      correlationId: "corr_provider_security",
      cause: new Error("raw cause token-value")
    });
    const transport = createRedditFakeTransport();
    const transportResult = await Promise.resolve(
      transport.send(REDDIT_PROVIDER_FIXTURE_REQUEST)
    );
    const serialized = JSON.stringify({
      malformed,
      rateLimit,
      error: error.toJSON(),
      transportResult,
      response: REDDIT_PROVIDER_FIXTURE_TRANSPORT_RESPONSE
    });

    expect(serialized).not.toMatch(unsafePattern);
  });
});
