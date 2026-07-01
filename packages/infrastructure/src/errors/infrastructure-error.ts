import {
  ERROR_CATEGORIES,
  ERROR_CODES,
  OpportunityError,
  redactSecretLikeValues,
  type SafeErrorDetails
} from "@opportunity-os/errors";

export type SafeInfrastructureErrorDetails = SafeErrorDetails;

export type InfrastructureErrorOptions = {
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly cause?: unknown;
};

const connectionStringPattern =
  /\b(?:postgres(?:ql)?|redis|mysql|mongodb):\/\/[^\s,;]+/giu;
const authorizationValuePattern =
  /\b(?:authorization|auth(?:entication)?)\s*[:=]\s*(?:Bearer\s+)?[^\s,;]+/giu;

export function sanitizeInfrastructureErrorMessage(message: string): string {
  return redactSecretLikeValues(
    message.replace(authorizationValuePattern, "[REDACTED]")
  )
    .replace(connectionStringPattern, "[REDACTED]");
}

export class InfrastructureError extends OpportunityError {
  constructor(options: InfrastructureErrorOptions) {
    super({
      code: ERROR_CODES.infrastructureUnavailable,
      category: ERROR_CATEGORIES.infrastructure,
      message: sanitizeInfrastructureErrorMessage(options.message),
      correlationId: options.correlationId,
      requestId: options.requestId,
      cause: options.cause
    });
    this.name = "InfrastructureError";
  }
}

export function createInfrastructureError(
  options: InfrastructureErrorOptions
): InfrastructureError {
  return new InfrastructureError(options);
}
