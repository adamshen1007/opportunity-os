import {
  ERROR_CATEGORIES,
  ERROR_CODES,
  OpportunityError,
  type ErrorCategory,
  type ErrorCode
} from "@opportunity-os/errors";

export type SafeConnectorHostErrorDetails = {
  readonly code: ErrorCode;
  readonly category: ErrorCategory;
  readonly message: string;
  readonly correlationId: string;
  readonly requestId?: string;
};

export type ConnectorHostErrorOptions = {
  readonly code?: ErrorCode;
  readonly category?: ErrorCategory;
  readonly message: string;
  readonly correlationId: string;
  readonly requestId?: string;
  readonly cause?: unknown;
};

export class ConnectorHostError extends OpportunityError {
  constructor(options: ConnectorHostErrorOptions) {
    super({
      code: options.code ?? ERROR_CODES.infrastructureUnavailable,
      category: options.category ?? ERROR_CATEGORIES.infrastructure,
      message: sanitizeConnectorHostErrorMessage(options.message),
      correlationId: options.correlationId,
      requestId: options.requestId,
      cause: options.cause
    });
    this.name = "ConnectorHostError";
  }

  override toJSON(): SafeConnectorHostErrorDetails {
    return this.toSafeDetails();
  }

  override toSafeDetails(): SafeConnectorHostErrorDetails {
    return {
      code: this.code,
      category: this.category,
      message: sanitizeConnectorHostErrorMessage(this.message),
      correlationId: this.correlationId ?? "unknown",
      requestId: this.requestId
    };
  }
}

export function sanitizeConnectorHostErrorMessage(message: string): string {
  return message
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/giu, "Bearer [REDACTED]")
    .replace(/(api[_-]?key|token|password|secret|credential|authorization|provider[_-]?key)=([^&\s]+)/giu, "$1=[REDACTED]")
    .replace(/postgres(?:ql)?:\/\/[^\s]+/giu, "[REDACTED_DATABASE_URL]")
    .replace(/https?:\/\/[^\s]*?(?:key|token|secret|password|credential)[^\s]*/giu, "[REDACTED_URL]");
}

export function createConnectorHostError(
  options: ConnectorHostErrorOptions
): ConnectorHostError {
  return new ConnectorHostError(options);
}
