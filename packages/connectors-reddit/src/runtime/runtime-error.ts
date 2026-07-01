import {
  RedditConnectorError,
  sanitizeRedditConnectorErrorMessage,
  type RedditConnectorErrorCode
} from "../errors/index.js";

export type SafeRedditRuntimeErrorDetails = {
  readonly code: RedditConnectorErrorCode;
  readonly category: "external dependency";
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
};

export type RedditRuntimeErrorOptions = {
  readonly code?: RedditConnectorErrorCode;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly cause?: unknown;
};

export class RedditRuntimeError extends RedditConnectorError {
  constructor(options: RedditRuntimeErrorOptions) {
    super({
      code: options.code ?? "REDDIT_CONNECTOR_OPERATION_INVALID",
      message: sanitizeRedditConnectorErrorMessage(options.message),
      correlationId: options.correlationId,
      requestId: options.requestId,
      cause: options.cause
    });
    this.name = "RedditRuntimeError";
  }

  toRedditRuntimeSafeDetails(): SafeRedditRuntimeErrorDetails {
    return {
      code: this.redditCode,
      category: "external dependency",
      message: sanitizeRedditConnectorErrorMessage(this.message),
      correlationId: this.correlationId,
      requestId: this.requestId
  };
}
}

export function createRedditRuntimeError(
  options: RedditRuntimeErrorOptions
): RedditRuntimeError {
  return new RedditRuntimeError(options);
}
