import {
  ConnectorError,
  type SafeConnectorErrorDetails
} from "@opportunity-os/connectors";
import type {
  ConnectorRuntimeCancellationResult,
  ConnectorRuntimeRetryDecision,
  ConnectorRuntimeTimeoutResult
} from "@opportunity-os/connector-runtime";
import { sanitizeRedditConnectorErrorMessage } from "../errors/index.js";

export const REDDIT_PROVIDER_ERROR_CODES = [
  "REDDIT_PROVIDER_TRANSPORT_FAILED",
  "REDDIT_PROVIDER_TIMEOUT",
  "REDDIT_PROVIDER_CANCELLED",
  "REDDIT_PROVIDER_AUTH_FAILED",
  "REDDIT_PROVIDER_RESPONSE_INVALID"
] as const;

export type RedditProviderErrorCode =
  (typeof REDDIT_PROVIDER_ERROR_CODES)[number];

export type SafeRedditProviderErrorDetails = SafeConnectorErrorDetails & {
  readonly redditProviderCode: RedditProviderErrorCode;
  readonly retry?: ConnectorRuntimeRetryDecision;
  readonly timeout?: ConnectorRuntimeTimeoutResult;
  readonly cancellation?: ConnectorRuntimeCancellationResult;
};

export type RedditProviderErrorOptions = {
  readonly code?: RedditProviderErrorCode;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly retry?: ConnectorRuntimeRetryDecision;
  readonly timeout?: ConnectorRuntimeTimeoutResult;
  readonly cancellation?: ConnectorRuntimeCancellationResult;
  readonly cause?: unknown;
};

export class RedditProviderError extends ConnectorError {
  readonly redditProviderCode: RedditProviderErrorCode;
  readonly retry?: ConnectorRuntimeRetryDecision;
  readonly timeout?: ConnectorRuntimeTimeoutResult;
  readonly cancellation?: ConnectorRuntimeCancellationResult;

  constructor(options: RedditProviderErrorOptions) {
    super({
      message: sanitizeRedditConnectorErrorMessage(options.message),
      correlationId: options.correlationId,
      requestId: options.requestId,
      cause: options.cause
    });
    this.name = "RedditProviderError";
    this.redditProviderCode = options.code ?? "REDDIT_PROVIDER_TRANSPORT_FAILED";
    this.retry = options.retry;
    this.timeout = options.timeout;
    this.cancellation = options.cancellation;
  }

  override toJSON(): SafeRedditProviderErrorDetails {
    return {
      ...this.toSafeDetails(),
      redditProviderCode: this.redditProviderCode,
      retry: this.retry,
      timeout: this.timeout,
      cancellation: this.cancellation
    };
  }
}

export function createRedditProviderError(
  options: RedditProviderErrorOptions
): RedditProviderError {
  return new RedditProviderError(options);
}
