import type { OpportunitySafeMetadata } from "../opportunity/index.js";
import type { OpportunityValidationIssue } from "../validation/index.js";

export const OPPORTUNITY_ENGINE_ERROR_CODES = {
  validationFailed: "opportunity.validation_failed",
  unsafeInput: "opportunity.unsafe_input",
  invalidResult: "opportunity.invalid_result",
  internalFailure: "opportunity.internal_failure"
} as const;

export const OPPORTUNITY_ENGINE_ERROR_CATEGORIES = {
  validation: "validation",
  safety: "safety",
  infrastructure: "infrastructure",
  internal: "internal"
} as const;

export type OpportunityEngineErrorCode =
  (typeof OPPORTUNITY_ENGINE_ERROR_CODES)[keyof typeof OPPORTUNITY_ENGINE_ERROR_CODES];

export type OpportunityEngineErrorCategory =
  (typeof OPPORTUNITY_ENGINE_ERROR_CATEGORIES)[keyof typeof OPPORTUNITY_ENGINE_ERROR_CATEGORIES];

export type OpportunityEngineErrorSafeDetails = {
  readonly code: OpportunityEngineErrorCode;
  readonly category: OpportunityEngineErrorCategory;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly issues?: readonly OpportunityValidationIssue[];
  readonly safeMetadata?: OpportunitySafeMetadata;
};

export type OpportunityEngineErrorOptions = OpportunityEngineErrorSafeDetails & {
  readonly cause?: unknown;
};

export class OpportunityEngineError extends Error {
  readonly code: OpportunityEngineErrorCode;
  readonly category: OpportunityEngineErrorCategory;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly issues?: readonly OpportunityValidationIssue[];
  readonly safeMetadata?: OpportunitySafeMetadata;

  constructor(options: OpportunityEngineErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = "OpportunityEngineError";
    this.code = options.code;
    this.category = options.category;
    this.correlationId = options.correlationId;
    this.requestId = options.requestId;
    this.issues = options.issues;
    this.safeMetadata = options.safeMetadata;
  }

  toSafeDetails(): OpportunityEngineErrorSafeDetails {
    return {
      code: this.code,
      category: this.category,
      message: this.message,
      ...(this.correlationId === undefined ? {} : { correlationId: this.correlationId }),
      ...(this.requestId === undefined ? {} : { requestId: this.requestId }),
      ...(this.issues === undefined ? {} : { issues: this.issues }),
      ...(this.safeMetadata === undefined ? {} : { safeMetadata: this.safeMetadata })
    };
  }

  toJSON(): OpportunityEngineErrorSafeDetails {
    return this.toSafeDetails();
  }
}
