import {
  ERROR_CATEGORIES,
  ERROR_CODES,
  OpportunityError,
  redactSecretLikeValues,
  type SafeErrorDetails
} from "@opportunity-os/errors";

export type SafeConnectorErrorDetails = SafeErrorDetails;

export type ConnectorErrorOptions = {
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly cause?: unknown;
};

const credentialUrlPattern = /\b[a-z][a-z0-9+.-]*:\/\/[^\s/@:]+:[^\s/@]+@[^\s,;]+/giu;
const databaseUrlPattern = /\b(?:postgres(?:ql)?|mysql|mariadb|mongodb|redis):\/\/[^\s,;]+/giu;
const bearerPattern = /\bbearer\s+[^\s,;]+/giu;
const sensitiveAssignmentPattern =
  /\b(authorization|token|api[_-]?key|provider[_-]?key|password|secret|credential|dsn|database[_-]?url|connection[_-]?string|raw[_-]?config|response[_-]?payload|dependency[_-]?details)\s*[:=]\s*[^\s,;]+/giu;

export function sanitizeConnectorErrorMessage(message: string): string {
  return redactSecretLikeValues(
    message
      .replace(credentialUrlPattern, "[REDACTED]")
      .replace(databaseUrlPattern, "[REDACTED]")
      .replace(bearerPattern, "[REDACTED]")
      .replace(sensitiveAssignmentPattern, "[REDACTED]")
  );
}

export class ConnectorError extends OpportunityError {
  constructor(options: ConnectorErrorOptions) {
    super({
      code: ERROR_CODES.externalDependencyFailed,
      category: ERROR_CATEGORIES.externalDependency,
      message: sanitizeConnectorErrorMessage(options.message),
      correlationId: options.correlationId,
      requestId: options.requestId,
      cause: options.cause
    });
    this.name = "ConnectorError";
  }
}

export function createConnectorError(
  options: ConnectorErrorOptions
): ConnectorError {
  return new ConnectorError(options);
}
