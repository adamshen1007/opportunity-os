import type { ErrorCategory } from "./error-categories.js";
import type { ErrorCode } from "./error-codes.js";
import { toSafeErrorDetails } from "./safe-error.js";

export type SafeErrorDetails = {
  readonly code: ErrorCode;
  readonly category: ErrorCategory;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
};

export type OpportunityErrorOptions = {
  readonly code: ErrorCode;
  readonly category: ErrorCategory;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly cause?: unknown;
};

export class OpportunityError extends Error {
  readonly code: ErrorCode;
  readonly category: ErrorCategory;
  readonly correlationId?: string;
  readonly requestId?: string;

  constructor(options: OpportunityErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = "OpportunityError";
    this.code = options.code;
    this.category = options.category;
    this.correlationId = options.correlationId;
    this.requestId = options.requestId;
  }

  toJSON(): SafeErrorDetails {
    return this.toSafeDetails();
  }

  toSafeDetails(): SafeErrorDetails {
    return toSafeErrorDetails(this);
  }
}
