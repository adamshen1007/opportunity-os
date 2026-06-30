import {
  ERROR_CATEGORIES,
  ERROR_CODES,
  OpportunityError,
  type ErrorCategory,
  type ErrorCode,
  type SafeErrorDetails
} from "@opportunity-os/errors";

export type DomainErrorCode = ErrorCode;
export type DomainErrorCategory = ErrorCategory;

export type DomainErrorOptions = {
  readonly code?: DomainErrorCode;
  readonly category?: DomainErrorCategory;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly cause?: unknown;
};

export type SafeDomainErrorDetails = SafeErrorDetails;

const REDACTED_DOMAIN_ERROR_VALUE = "[REDACTED]";
const keyedSecretPattern =
  /\b(authorization|bearer|token|api[_-]?key|provider[_-]?key|password|secret|jwt|dsn|credential|payload)\s*[:=]\s*((?:Bearer\s+)?(?:"[^"]*"|'[^']*'|[^\s,;]+))/giu;
const bearerValuePattern = /\bbearer\s+("[^"]*"|'[^']*'|[^\s,;]+)/giu;

export class DomainError extends OpportunityError {
  constructor(options: DomainErrorOptions) {
    super({
      code: options.code ?? ERROR_CODES.businessRuleRejected,
      category: options.category ?? ERROR_CATEGORIES.business,
      message: options.message,
      correlationId: options.correlationId,
      requestId: options.requestId,
      cause: options.cause
    });
    this.name = "DomainError";
  }

  override toJSON(): SafeDomainErrorDetails {
    return this.toSafeDetails();
  }

  override toSafeDetails(): SafeDomainErrorDetails {
    const details = super.toSafeDetails();

    return {
      ...details,
      message: redactDomainErrorText(details.message),
      correlationId:
        details.correlationId === undefined
          ? undefined
          : redactDomainErrorText(details.correlationId),
      requestId:
        details.requestId === undefined
          ? undefined
          : redactDomainErrorText(details.requestId)
    };
  }
}

export function createDomainError(options: DomainErrorOptions): DomainError {
  return new DomainError(options);
}

export function redactDomainErrorText(value: string): string {
  return value
    .replace(
      keyedSecretPattern,
      (_match, key: string) => `${key}=${REDACTED_DOMAIN_ERROR_VALUE}`
    )
    .replace(bearerValuePattern, `Bearer ${REDACTED_DOMAIN_ERROR_VALUE}`);
}
