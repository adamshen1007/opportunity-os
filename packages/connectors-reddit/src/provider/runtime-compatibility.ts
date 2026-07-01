import type {
  ConnectorRuntimeCancellationReasonCode,
  ConnectorRuntimeCancellationResult,
  ConnectorRuntimeRetryDecision,
  ConnectorRuntimeTimeoutResult,
  ConnectorRuntimeTimeoutScope
} from "@opportunity-os/connector-runtime";
import type { RedditTransportFailure } from "./transport.js";

export type RedditProviderRetryCompatibilityInput = {
  readonly failure: RedditTransportFailure;
  readonly attempt: number;
  readonly maxAttempts: number;
  readonly retryableIssueCodes?: readonly string[];
};

export type RedditProviderTimeoutCompatibilityInput = {
  readonly timeoutMs: number;
  readonly startedAt?: string;
  readonly deadlineAt?: string;
  readonly timedOut: boolean;
  readonly scope?: ConnectorRuntimeTimeoutScope;
};

export type RedditProviderCancellationCompatibilityInput = {
  readonly cancelled: boolean;
  readonly reasonCode?: ConnectorRuntimeCancellationReasonCode;
  readonly safeMessage?: string;
  readonly correlationId: string;
  readonly requestId?: string;
  readonly connectorId?: string;
  readonly requestedAt?: string;
  readonly cancelledAt?: string;
};

export function mapRedditTransportFailureToRetryDecision(
  input: RedditProviderRetryCompatibilityInput
): ConnectorRuntimeRetryDecision {
  const canRetry = input.attempt < input.maxAttempts;

  return {
    decision: canRetry ? "retry" : "do-not-retry",
    attempt: input.attempt,
    maxAttempts: input.maxAttempts,
    nextDelayMs: canRetry ? 0 : undefined,
    safeMessage: input.failure.safeMessage
  };
}

export function mapRedditTimeoutMetadataToRuntimeResult(
  input: RedditProviderTimeoutCompatibilityInput
): ConnectorRuntimeTimeoutResult {
  return {
    status: input.timedOut ? "timed-out" : "within-limit",
    scope: input.scope ?? "operation",
    duration: {
      timeoutMs: input.timeoutMs,
      startedAt: input.startedAt,
      deadlineAt: input.deadlineAt
    },
    safeMessage: input.timedOut ? "Provider operation timed out." : undefined
  };
}

export function mapRedditCancellationToRuntimeResult(
  input: RedditProviderCancellationCompatibilityInput
): ConnectorRuntimeCancellationResult {
  return {
    state: input.cancelled ? "cancelled" : "not-requested",
    reasonCode: input.cancelled ? input.reasonCode ?? "policy-requested" : undefined,
    safeMessage: input.cancelled
      ? input.safeMessage ?? "Provider operation was cancelled."
      : undefined,
    metadata: {
      correlationId: input.correlationId,
      requestId: input.requestId,
      connectorId: input.connectorId ?? "reddit",
      requestedAt: input.requestedAt,
      cancelledAt: input.cancelledAt
    }
  };
}
