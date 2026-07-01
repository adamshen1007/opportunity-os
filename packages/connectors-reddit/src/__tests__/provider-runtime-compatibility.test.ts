import { describe, expect, it } from "vitest";
import {
  mapRedditCancellationToRuntimeResult,
  mapRedditTimeoutMetadataToRuntimeResult,
  mapRedditTransportFailureToRetryDecision
} from "../index.js";

describe("reddit provider runtime compatibility", () => {
  it("maps transport failures to retry decision inputs without running retries", () => {
    const retry = mapRedditTransportFailureToRetryDecision({
      failure: {
        ok: false,
        safeMessage: "Provider returned a retryable response."
      },
      attempt: 1,
      maxAttempts: 3
    });
    const final = mapRedditTransportFailureToRetryDecision({
      failure: {
        ok: false,
        safeMessage: "Provider returned a terminal response."
      },
      attempt: 3,
      maxAttempts: 3
    });

    expect(retry).toEqual({
      decision: "retry",
      attempt: 1,
      maxAttempts: 3,
      nextDelayMs: 0,
      safeMessage: "Provider returned a retryable response."
    });
    expect(final.decision).toBe("do-not-retry");
    expect(final.nextDelayMs).toBeUndefined();
  });

  it("maps timeout metadata to runtime timeout result shapes without timers", () => {
    expect(
      mapRedditTimeoutMetadataToRuntimeResult({
        timeoutMs: 5000,
        startedAt: "2026-07-01T00:00:00.000Z",
        deadlineAt: "2026-07-01T00:00:05.000Z",
        timedOut: true
      })
    ).toEqual({
      status: "timed-out",
      scope: "operation",
      duration: {
        timeoutMs: 5000,
        startedAt: "2026-07-01T00:00:00.000Z",
        deadlineAt: "2026-07-01T00:00:05.000Z"
      },
      safeMessage: "Provider operation timed out."
    });
  });

  it("maps cancellation state to runtime cancellation result shapes", () => {
    const cancellation = mapRedditCancellationToRuntimeResult({
      cancelled: true,
      reasonCode: "policy-requested",
      safeMessage: "Cancelled by policy.",
      correlationId: "corr_cancel",
      requestId: "req_cancel",
      cancelledAt: "2026-07-01T00:00:00.000Z"
    });

    expect(cancellation).toEqual({
      state: "cancelled",
      reasonCode: "policy-requested",
      safeMessage: "Cancelled by policy.",
      metadata: {
        correlationId: "corr_cancel",
        requestId: "req_cancel",
        connectorId: "reddit",
        requestedAt: undefined,
        cancelledAt: "2026-07-01T00:00:00.000Z"
      }
    });
  });
});
