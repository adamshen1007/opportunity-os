import {
  ERROR_CATEGORIES,
  ERROR_CODES,
  OpportunityError,
  type SafeErrorDetails
} from "@opportunity-os/errors";

export const CONTAINER_ERROR_CODES = {
  validationFailed: ERROR_CODES.validationFailed,
  dependencyUnavailable: ERROR_CODES.infrastructureUnavailable,
  compositionFailed: ERROR_CODES.internalSystemFailure
} as const;

export type ContainerErrorCode =
  (typeof CONTAINER_ERROR_CODES)[keyof typeof CONTAINER_ERROR_CODES];

export type ContainerErrorOptions = {
  readonly code: ContainerErrorCode;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly cause?: unknown;
};

export type SafeContainerErrorDetails = SafeErrorDetails;

export class ContainerError extends OpportunityError {
  constructor(options: ContainerErrorOptions) {
    super({
      code: options.code,
      category: ERROR_CATEGORIES.infrastructure,
      message: options.message,
      correlationId: options.correlationId,
      requestId: options.requestId,
      cause: options.cause
    });
    this.name = "ContainerError";
  }

  override toSafeDetails(): SafeContainerErrorDetails {
    return super.toSafeDetails();
  }
}

export function createContainerError(
  options: ContainerErrorOptions
): ContainerError {
  return new ContainerError(options);
}
