import { describe, expect, it } from "vitest";
import {
  REDDIT_AUTH_SENSITIVE_FIELD_KEYS,
  type RedditAuthRefreshRequest,
  type RedditAuthState,
  type RedditOAuthCredentials,
  type RedditOAuthToken
} from "../index.js";

describe("reddit provider auth contracts", () => {
  it("marks credential and token fields as sensitive", () => {
    const credentials: RedditOAuthCredentials = {
      clientId: { value: "client-id-secret", sensitive: true },
      clientSecret: { value: "client-secret-value", sensitive: true },
      refreshToken: { value: "refresh-token-value", sensitive: true },
      userAgent: "opportunity-os-test",
      scopes: ["read"]
    };
    const token: RedditOAuthToken = {
      tokenType: "bearer",
      accessToken: { value: "access-token-value", sensitive: true },
      refreshToken: credentials.refreshToken,
      issuedAt: "2026-07-01T00:00:00.000Z",
      expiresAt: "2026-07-01T01:00:00.000Z",
      scopes: ["read"]
    };

    expect(REDDIT_AUTH_SENSITIVE_FIELD_KEYS).toEqual([
      "clientId",
      "clientSecret",
      "accessToken",
      "refreshToken"
    ]);
    expect(credentials.clientId.sensitive).toBe(true);
    expect(credentials.clientSecret?.sensitive).toBe(true);
    expect(token.accessToken.sensitive).toBe(true);
    expect(token.refreshToken?.sensitive).toBe(true);
  });

  it("defines refresh and state contracts without network behavior", () => {
    const credentials: RedditOAuthCredentials = {
      clientId: { value: "client-id-secret", sensitive: true },
      userAgent: "opportunity-os-test"
    };
    const refreshRequest: RedditAuthRefreshRequest = {
      credentials,
      requestedAt: "2026-07-01T00:00:00.000Z",
      correlationId: "corr_provider_auth",
      requestId: "req_provider_auth"
    };
    const authState: RedditAuthState = {
      status: "refresh-required",
      credentials,
      expiration: {
        refreshAfter: "2026-07-01T00:30:00.000Z"
      },
      safeMessage: "Provider credentials are configured for a future refresh boundary."
    };

    expect(refreshRequest.correlationId).toBe("corr_provider_auth");
    expect(authState.status).toBe("refresh-required");
    expect(authState.credentials?.clientId.sensitive).toBe(true);
  });
});
