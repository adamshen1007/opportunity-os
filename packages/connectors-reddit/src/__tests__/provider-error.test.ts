import { describe, expect, it } from "vitest";
import {
  REDDIT_PROVIDER_ERROR_CODES,
  createRedditProviderError,
  mapRedditTimeoutMetadataToRuntimeResult,
  mapRedditTransportFailureToRetryDecision
} from "../index.js";

describe("reddit provider errors", () => {
  it("serializes safe provider errors with compatibility metadata", () => {
    const retry = mapRedditTransportFailureToRetryDecision({
      failure: {
        ok: false,
        safeMessage: "Provider failed safely."
      },
      attempt: 1,
      maxAttempts: 2
    });
    const timeout = mapRedditTimeoutMetadataToRuntimeResult({
      timeoutMs: 1000,
      timedOut: true
    });
    const error = createRedditProviderError({
      code: "REDDIT_PROVIDER_TIMEOUT",
      message:
        "authorization: bearer raw-access-token client_secret=raw-secret refresh_token=raw-refresh stack trace raw provider response",
      correlationId: "corr_provider_error",
      requestId: "req_provider_error",
      retry,
      timeout,
      cause: new Error("raw cause with token=raw-token")
    });
    const safe = error.toJSON();
    const serialized = JSON.stringify(safe);

    expect(REDDIT_PROVIDER_ERROR_CODES).toEqual([
      "REDDIT_PROVIDER_TRANSPORT_FAILED",
      "REDDIT_PROVIDER_TIMEOUT",
      "REDDIT_PROVIDER_CANCELLED",
      "REDDIT_PROVIDER_AUTH_FAILED",
      "REDDIT_PROVIDER_RESPONSE_INVALID"
    ]);
    expect(safe).toMatchObject({
      redditProviderCode: "REDDIT_PROVIDER_TIMEOUT",
      correlationId: "corr_provider_error",
      requestId: "req_provider_error",
      retry,
      timeout
    });
    expect(serialized).not.toContain("raw-access-token");
    expect(serialized).not.toContain("raw-secret");
    expect(serialized).not.toContain("raw-refresh");
    expect(serialized).not.toContain("raw cause");
    expect(serialized).not.toContain("stack trace");
  });
});
