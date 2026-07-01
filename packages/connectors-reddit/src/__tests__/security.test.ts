import { describe, expect, it } from "vitest";
import {
  REDDIT_FAKE_CONFIG,
  REDDIT_FAKE_HOST_CONTEXT,
  REDDIT_FAKE_PAGINATION,
  REDDIT_FAKE_RATE_LIMIT,
  createRedditConnectorError,
  createRedditRuntimeError,
  createRedditRuntimeHarness,
  mapRedditRuntimeFailure
} from "../index.js";
import type {
  RedditHostIntegrationContract,
  RedditValidationFailure
} from "../index.js";

const unsafePattern =
  /secret-value|token-value|raw-token|authorization:\s*bearer|provider-key|credential-value|postgres:\/\/|raw-provider-response|raw-payload|provider response|stack trace|dependency-internal|raw cause|stack frame/iu;

describe("reddit connector security contracts", () => {
  it("keeps validation failures safe", () => {
    const failure: RedditValidationFailure = {
      ok: false,
      issues: [
        {
          code: "reddit-config-invalid",
          target: "config",
          safeMessage: "Reddit config contract is missing a required field.",
          path: ["fields", "userAgent"],
          connectorId: "reddit",
          genericCode: "config-invalid"
        }
      ]
    };

    expect(JSON.stringify(failure)).not.toMatch(unsafePattern);
  });

  it("keeps error serialization stack-safe and secret-safe", () => {
    const error = createRedditConnectorError({
      message:
        "authorization: bearer secret-value provider_key=provider-key database_url=postgres://user:pass@localhost/db raw_provider_payload=raw-provider-response",
      correlationId: "corr_security",
      requestId: "req_security",
      cause: new Error("stack trace dependency-internal")
    });

    expect(JSON.stringify(error.toJSON())).not.toMatch(unsafePattern);
    expect(error.toJSON()).toEqual({
      code: "EXTERNAL_DEPENDENCY_FAILED",
      category: "external_dependency",
      message: "[REDACTED] [REDACTED] [REDACTED] [REDACTED]",
      correlationId: "corr_security",
      requestId: "req_security"
    });
  });

  it("keeps fixtures, pagination, rate limit, and host-facing contracts safe", () => {
    const hostContract: Partial<RedditHostIntegrationContract> = {
      validation: {
        startupValidation: {
          status: "invalid",
          checks: [],
          issues: []
        },
        redditValidation: {
          ok: true,
          issues: []
        }
      }
    };

    expect(JSON.stringify(REDDIT_FAKE_CONFIG)).not.toMatch(unsafePattern);
    expect(JSON.stringify(REDDIT_FAKE_HOST_CONTEXT)).not.toMatch(unsafePattern);
    expect(JSON.stringify(REDDIT_FAKE_PAGINATION)).not.toMatch(unsafePattern);
    expect(JSON.stringify(REDDIT_FAKE_RATE_LIMIT)).not.toMatch(unsafePattern);
    expect(JSON.stringify(hostContract)).not.toMatch(unsafePattern);
    expect(
      REDDIT_FAKE_CONFIG.fields
        .filter((field) => field.sensitive)
        .every((field) => field.kind === "secret")
    ).toBe(true);
  });

  it("keeps runtime failures, errors, and harness output secret-safe", () => {
    const error = createRedditRuntimeError({
      message:
        "token=secret-value authorization: bearer raw-token provider response raw-provider-response stack frame raw cause",
      correlationId: "corr_runtime_security",
      requestId: "req_runtime_security",
      cause: new Error("raw cause secret-value stack frame")
    });
    const failure = mapRedditRuntimeFailure(
      "password=secret-value token=token-value provider response stack trace raw cause",
      {
        operationName: "reddit.read.posts",
        correlationId: "corr_runtime_security",
        requestId: "req_runtime_security"
      }
    );
    const harnessResult = createRedditRuntimeHarness().read("reddit.read.posts");

    expect(JSON.stringify(error.toRedditRuntimeSafeDetails())).not.toMatch(
      unsafePattern
    );
    expect(JSON.stringify(failure)).not.toMatch(unsafePattern);
    expect(JSON.stringify(harnessResult)).not.toMatch(unsafePattern);
  });
});
