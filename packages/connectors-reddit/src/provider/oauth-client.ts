import type { RedditOAuthCredentials, RedditOAuthToken } from "./auth.js";
import { createRedditProviderError, type RedditProviderError } from "./provider-error.js";
import type { RedditHttpTransport, RedditTransportHeader } from "./transport.js";

export type RedditOAuthGrantType = "client_credentials" | "refresh_token";

export type RedditOAuthTokenExchangeInput = {
  readonly credentials: RedditOAuthCredentials;
  readonly grantType?: RedditOAuthGrantType;
  readonly tokenEndpoint?: string;
  readonly transport: RedditHttpTransport;
  readonly requestedAt: string;
  readonly correlationId: string;
  readonly requestId?: string;
  readonly timeoutMs?: number;
};

export type RedditOAuthTokenExchangeResult =
  | {
      readonly ok: true;
      readonly token: RedditOAuthToken;
    }
  | {
      readonly ok: false;
      readonly error: RedditProviderError;
    };

type RedditTokenResponseBody = {
  readonly access_token?: unknown;
  readonly token_type?: unknown;
  readonly expires_in?: unknown;
  readonly scope?: unknown;
  readonly refresh_token?: unknown;
};

function encodeBasicAuth(credentials: RedditOAuthCredentials): string {
  const secret = credentials.clientSecret?.value ?? "";

  return Buffer.from(`${credentials.clientId.value}:${secret}`, "utf8").toString("base64");
}

function formBody(input: RedditOAuthTokenExchangeInput, grantType: RedditOAuthGrantType): string {
  const body = new URLSearchParams();
  body.set("grant_type", grantType);

  if (grantType === "refresh_token" && input.credentials.refreshToken?.value) {
    body.set("refresh_token", input.credentials.refreshToken.value);
  }

  return body.toString();
}

function authHeaders(credentials: RedditOAuthCredentials): readonly RedditTransportHeader[] {
  return [
    {
      name: "authorization",
      value: `Basic ${encodeBasicAuth(credentials)}`,
      sensitive: true
    },
    {
      name: "content-type",
      value: "application/x-www-form-urlencoded"
    },
    {
      name: "user-agent",
      value: credentials.userAgent
    }
  ];
}

function tokenFailure(input: {
  readonly message: string;
  readonly correlationId: string;
  readonly requestId?: string;
  readonly cause?: unknown;
}): RedditOAuthTokenExchangeResult {
  return {
    ok: false,
    error: createRedditProviderError({
      code: "REDDIT_PROVIDER_AUTH_FAILED",
      message: input.message,
      correlationId: input.correlationId,
      requestId: input.requestId,
      cause: input.cause
    })
  };
}

function toToken(
  body: RedditTokenResponseBody,
  input: RedditOAuthTokenExchangeInput
): RedditOAuthTokenExchangeResult {
  if (typeof body.access_token !== "string" || body.access_token.trim() === "") {
    return tokenFailure({
      message: "Reddit OAuth response did not include a valid access token.",
      correlationId: input.correlationId,
      requestId: input.requestId
    });
  }

  const expiresIn = typeof body.expires_in === "number" && Number.isFinite(body.expires_in)
    ? body.expires_in
    : undefined;
  const issuedAtMs = Date.parse(input.requestedAt);
  const expiresAt =
    expiresIn !== undefined && Number.isFinite(issuedAtMs)
      ? new Date(issuedAtMs + expiresIn * 1000).toISOString()
      : undefined;
  const scopeText = typeof body.scope === "string" ? body.scope : undefined;

  return {
    ok: true,
    token: {
      tokenType: "bearer",
      accessToken: {
        value: body.access_token,
        sensitive: true
      },
      refreshToken:
        typeof body.refresh_token === "string" && body.refresh_token.trim() !== ""
          ? {
              value: body.refresh_token,
              sensitive: true
            }
          : input.credentials.refreshToken,
      issuedAt: input.requestedAt,
      expiresAt,
      scopes: scopeText?.split(" ").filter(Boolean)
    }
  };
}

export async function exchangeRedditOAuthToken(
  input: RedditOAuthTokenExchangeInput
): Promise<RedditOAuthTokenExchangeResult> {
  const grantType = input.grantType ?? (input.credentials.refreshToken ? "refresh_token" : "client_credentials");

  if (grantType === "refresh_token" && !input.credentials.refreshToken?.value) {
    return tokenFailure({
      message: "Reddit OAuth refresh requires a configured refresh token.",
      correlationId: input.correlationId,
      requestId: input.requestId
    });
  }

  const result = await Promise.resolve(
    input.transport.send<RedditTokenResponseBody>({
      method: "POST",
      url: input.tokenEndpoint ?? "https://www.reddit.com/api/v1/access_token",
      headers: authHeaders(input.credentials),
      body: formBody(input, grantType),
      timeoutMs: input.timeoutMs,
      metadata: {
        correlationId: input.correlationId,
        ...(input.requestId ? { requestId: input.requestId } : {}),
        redditOAuthGrantType: grantType
      }
    })
  );

  if (!result.ok) {
    return tokenFailure({
      message: result.safeMessage,
      correlationId: input.correlationId,
      requestId: input.requestId,
      cause: result
    });
  }

  return toToken(result.response.body, input);
}
