import {
  ERROR_CATEGORIES,
  ERROR_CODES,
  OpportunityError,
  redactSecretLikeValues,
  type ErrorCategory,
  type ErrorCode,
  type SafeErrorDetails
} from "@opportunity-os/errors";

export const APPLICATION_ERROR_CODES = {
  validationFailed: ERROR_CODES.validationFailed,
  operationRejected: ERROR_CODES.businessRuleRejected,
  dependencyUnavailable: ERROR_CODES.infrastructureUnavailable,
  internalFailure: ERROR_CODES.internalSystemFailure
} as const;

export type ApplicationErrorCode =
  (typeof APPLICATION_ERROR_CODES)[keyof typeof APPLICATION_ERROR_CODES];

export type ApplicationErrorCategory = Extract<
  ErrorCategory,
  "validation" | "business" | "infrastructure" | "internal_system"
>;

export type ApplicationErrorOptions = {
  readonly code: ApplicationErrorCode;
  readonly category?: ApplicationErrorCategory;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly cause?: unknown;
};

export type SafeApplicationErrorDetails = SafeErrorDetails;

function defaultCategoryForCode(code: ApplicationErrorCode): ApplicationErrorCategory {
  if (code === APPLICATION_ERROR_CODES.validationFailed) {
    return ERROR_CATEGORIES.validation;
  }

  if (code === APPLICATION_ERROR_CODES.operationRejected) {
    return ERROR_CATEGORIES.business;
  }

  if (code === APPLICATION_ERROR_CODES.dependencyUnavailable) {
    return ERROR_CATEGORIES.infrastructure;
  }

  return ERROR_CATEGORIES.internalSystem;
}

export function redactApplicationErrorText(message: string): string {
  return redactSecretLikeValues(message).replace(
    /\b(payload|credential|credentials)\s*[:=]\s*[^\s,;]+/giu,
    "[REDACTED]"
  );
}

export class ApplicationError extends OpportunityError {
  constructor(options: ApplicationErrorOptions) {
    super({
      code: options.code,
      category: options.category ?? defaultCategoryForCode(options.code),
      message: redactApplicationErrorText(options.message),
      correlationId: options.correlationId,
      requestId: options.requestId,
      cause: options.cause
    });
    this.name = "ApplicationError";
  }
}

export function createApplicationError(
  options: ApplicationErrorOptions
): ApplicationError {
  return new ApplicationError(options);
}
