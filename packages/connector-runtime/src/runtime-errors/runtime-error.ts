import {
  ERROR_CATEGORIES,
  ERROR_CODES,
  OpportunityError,
  type ErrorCategory,
  type ErrorCode
} from "@opportunity-os/errors";

export type SafeConnectorRuntimeErrorDetails = {
  readonly code: ErrorCode;
  readonly category: ErrorCategory;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
};

export type ConnectorRuntimeErrorOptions = {
  readonly code?: ErrorCode;
  readonly category?: ErrorCategory;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly cause?: unknown;
};

export class ConnectorRuntimeError extends OpportunityError {
  constructor(options: ConnectorRuntimeErrorOptions) {
    super({
      code: options.code ?? ERROR_CODES.infrastructureUnavailable,
      category: options.category ?? ERROR_CATEGORIES.infrastructure,
      message: sanitizeConnectorRuntimeErrorMessage(options.message),
      correlationId: options.correlationId,
      requestId: options.requestId,
      cause: options.cause
    });
    this.name = "ConnectorRuntimeError";
  }

  override toJSON(): SafeConnectorRuntimeErrorDetails {
    return this.toSafeDetails();
  }

  override toSafeDetails(): SafeConnectorRuntimeErrorDetails {
    return {
      code: this.code,
      category: this.category,
      message: sanitizeConnectorRuntimeErrorMessage(this.message),
      correlationId: this.correlationId,
      requestId: this.requestId
    };
  }
}

export function sanitizeConnectorRuntimeErrorMessage(message: string): string {
  return message
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/giu, "Bearer [REDACTED]")
    .replace(/(api[_-]?key|token|password|secret|credential|authorization|provider[_-]?key)=([^&\s]+)/giu, "$1=[REDACTED]")
    .replace(/postgres(?:ql)?:\/\/[^\s]+/giu, "[REDACTED_DATABASE_URL]")
    .replace(/https?:\/\/[^\s]*?(?:key|token|secret|password|credential)[^\s]*/giu, "[REDACTED_URL]");
}

export function createConnectorRuntimeError(
  options: ConnectorRuntimeErrorOptions
): ConnectorRuntimeError {
  return new ConnectorRuntimeError(options);
}
