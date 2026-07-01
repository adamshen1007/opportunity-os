import { describe, expect, it } from "vitest";
import {
  REDDIT_AUTH_SENSITIVE_FIELD_KEYS,
  REDDIT_HTTP_METHODS,
  REDDIT_PROVIDER_AUTH_LIFECYCLE_STATES,
  REDDIT_PROVIDER_ERROR_CODES,
  REDDIT_PROVIDER_RATE_LIMIT_HEADER_KEYS,
  REDDIT_PROVIDER_TELEMETRY_EVENT_NAMES,
  createRedditProviderCursor,
  createRedditProviderError,
  createRedditProviderPaginationMetadata,
  createRedditProviderRequestDescription,
  mapRedditCancellationToRuntimeResult,
  mapRedditTimeoutMetadataToRuntimeResult,
  mapRedditTransportFailureToRetryDecision,
  parseRedditProviderResponse
} from "../index.js";

describe("reddit provider contract stability", () => {
  it("locks OAuth, auth lifecycle, method, telemetry, and provider error vocabularies", () => {
    expect(REDDIT_AUTH_SENSITIVE_FIELD_KEYS).toEqual([
      "clientId",
      "clientSecret",
      "accessToken",
      "refreshToken"
    ]);
    expect(REDDIT_PROVIDER_AUTH_LIFECYCLE_STATES).toEqual([
      "unauthenticated",
      "configured",
      "token-valid",
      "token-expiring",
      "refresh-required",
      "failed",
      "revoked"
    ]);
    expect(REDDIT_HTTP_METHODS).toEqual(["GET", "POST", "PUT", "PATCH", "DELETE"]);
    expect(REDDIT_PROVIDER_RATE_LIMIT_HEADER_KEYS).toEqual([
      "x-ratelimit-limit",
      "x-ratelimit-remaining",
      "x-ratelimit-reset"
    ]);
    expect(REDDIT_PROVIDER_TELEMETRY_EVENT_NAMES).toEqual([
      "reddit.provider.request.described",
      "reddit.provider.response.parsed",
      "reddit.provider.policy.mapped",
      "reddit.provider.auth.lifecycle.changed",
      "reddit.provider.error.mapped"
    ]);
    expect(REDDIT_PROVIDER_ERROR_CODES).toEqual([
      "REDDIT_PROVIDER_TRANSPORT_FAILED",
      "REDDIT_PROVIDER_TIMEOUT",
      "REDDIT_PROVIDER_CANCELLED",
      "REDDIT_PROVIDER_AUTH_FAILED",
      "REDDIT_PROVIDER_RESPONSE_INVALID"
    ]);
  });

  it("locks transport, parser, pagination, policy, and error output shapes", () => {
    const request = createRedditProviderRequestDescription({
      endpoint: "posts",
      baseUrl: "https://provider.example",
      correlationId: "corr_stability"
    });
    const parsed = parseRedditProviderResponse({ kind: "posts", items: [] });
    const pagination = createRedditProviderPaginationMetadata({
      direction: "forward",
      requestedLimit: 10,
      returnedCount: 0,
      hasNextPage: false,
      hasPreviousPage: false
    });
    const cursor = createRedditProviderCursor({ value: "cursor_stable" });
    const retry = mapRedditTransportFailureToRetryDecision({
      failure: { ok: false, safeMessage: "Stable failure." },
      attempt: 1,
      maxAttempts: 1
    });
    const timeout = mapRedditTimeoutMetadataToRuntimeResult({
      timeoutMs: 1000,
      timedOut: false
    });
    const cancellation = mapRedditCancellationToRuntimeResult({
      cancelled: false,
      correlationId: "corr_stability"
    });
    const error = createRedditProviderError({
      message: "Stable provider error.",
      correlationId: "corr_stability",
      retry,
      timeout,
      cancellation
    });

    expect(Object.keys(request)).toEqual([
      "endpoint",
      "operationName",
      "method",
      "url",
      "headers",
      "timeoutMs",
      "metadata"
    ]);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(Object.keys(parsed.envelope)).toEqual(["kind", "items", "metadata"]);
    expect(Object.keys(pagination)).toEqual(["cursor", "direction", "limit", "page", "safeSourceMetadata"]);
    expect(Object.keys(cursor ?? {})).toEqual(["value", "replaySafe", "source"]);
    expect(Object.keys(retry)).toEqual(["decision", "attempt", "maxAttempts", "nextDelayMs", "safeMessage"]);
    expect(Object.keys(timeout)).toEqual(["status", "scope", "duration", "safeMessage"]);
    expect(Object.keys(cancellation)).toEqual(["state", "reasonCode", "safeMessage", "metadata"]);
    expect(Object.keys(error.toJSON())).toEqual([
      "code",
      "category",
      "message",
      "correlationId",
      "requestId",
      "redditProviderCode",
      "retry",
      "timeout",
      "cancellation"
    ]);
  });
});
