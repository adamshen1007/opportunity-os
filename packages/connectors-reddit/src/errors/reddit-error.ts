import {
  ConnectorError,
  sanitizeConnectorErrorMessage,
  type SafeConnectorErrorDetails
} from "@opportunity-os/connectors";

export const REDDIT_CONNECTOR_ERROR_CODES = [
  "REDDIT_CONNECTOR_CONTRACT_INVALID",
  "REDDIT_CONNECTOR_HOST_CONTEXT_INVALID",
  "REDDIT_CONNECTOR_OPERATION_INVALID"
] as const;

export type RedditConnectorErrorCode =
  (typeof REDDIT_CONNECTOR_ERROR_CODES)[number];

export type SafeRedditConnectorErrorDetails = SafeConnectorErrorDetails;

export type RedditConnectorErrorOptions = {
  readonly code?: RedditConnectorErrorCode;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly cause?: unknown;
};

const sensitiveAssignmentPattern =
  /\b(authorization|token|api[_-]?key|provider[_-]?key|password|secret|credential|dsn|database[_-]?url|connection[_-]?string|raw[_-]?payload|raw[_-]?provider[_-]?payload|client[_-]?secret|refresh[_-]?token|access[_-]?token)\s*[:=]\s*[^\s,;]+/giu;
const authorizationHeaderPattern = /\bauthorization\s*:\s*bearer\s+[^\s,;]+/giu;
const sensitiveTokenWordPattern =
  /\b([a-z0-9_-]*(client[_-]?secret|access[_-]?token|refresh[_-]?token|api[_-]?key|provider[_-]?key|credential|password|secret)[a-z0-9_-]*)\b/giu;

export function sanitizeRedditConnectorErrorMessage(message: string): string {
  return sanitizeConnectorErrorMessage(
    message
      .replace(authorizationHeaderPattern, "[REDACTED]")
      .replace(sensitiveAssignmentPattern, "[REDACTED]")
      .replace(sensitiveTokenWordPattern, "[REDACTED]")
      .replace(/\b(raw[-\s]?provider[-\s]?response|provider response|stack frame|stack trace|raw cause|stack|cause)\b/giu, "[REDACTED]")
  );
}

export class RedditConnectorError extends ConnectorError {
  readonly redditCode: RedditConnectorErrorCode;

  constructor(options: RedditConnectorErrorOptions) {
    super({
      message: sanitizeRedditConnectorErrorMessage(options.message),
      correlationId: options.correlationId,
      requestId: options.requestId,
      cause: options.cause
    });
    this.name = "RedditConnectorError";
    this.redditCode = options.code ?? "REDDIT_CONNECTOR_CONTRACT_INVALID";
  }
}

export function createRedditConnectorError(
  options: RedditConnectorErrorOptions
): RedditConnectorError {
  return new RedditConnectorError(options);
}
