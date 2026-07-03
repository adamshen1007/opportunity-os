import type { OpportunityGenerationSafeMetadata } from "../generation/index.js";
import type { GenerationValidationIssue } from "../validation/index.js";

export const GENERATION_ERROR_CODES = {
  validationFailed: "generation.validation_failed",
  evidenceIncomplete: "generation.evidence_incomplete",
  confidenceUnavailable: "generation.confidence_unavailable",
  unsafeInput: "generation.unsafe_input",
  internalFailure: "generation.internal_failure"
} as const;

export const GENERATION_ERROR_CATEGORIES = {
  validation: "validation",
  safety: "safety",
  infrastructure: "infrastructure",
  internal: "internal"
} as const;

export type GenerationErrorCode =
  (typeof GENERATION_ERROR_CODES)[keyof typeof GENERATION_ERROR_CODES];

export type GenerationErrorCategory =
  (typeof GENERATION_ERROR_CATEGORIES)[keyof typeof GENERATION_ERROR_CATEGORIES];

export type OpportunityGenerationErrorSafeDetails = {
  readonly code: GenerationErrorCode;
  readonly category: GenerationErrorCategory;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly issues?: readonly GenerationValidationIssue[];
  readonly safeMetadata?: OpportunityGenerationSafeMetadata;
};

export type OpportunityGenerationErrorOptions = OpportunityGenerationErrorSafeDetails & {
  readonly cause?: unknown;
};

export class OpportunityGenerationError extends Error {
  readonly code: GenerationErrorCode;
  readonly category: GenerationErrorCategory;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly issues?: readonly GenerationValidationIssue[];
  readonly safeMetadata?: OpportunityGenerationSafeMetadata;

  constructor(options: OpportunityGenerationErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = "OpportunityGenerationError";
    this.code = options.code;
    this.category = options.category;
    this.correlationId = options.correlationId;
    this.requestId = options.requestId;
    this.issues = options.issues;
    this.safeMetadata = options.safeMetadata;
  }

  toSafeDetails(): OpportunityGenerationErrorSafeDetails {
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

  toJSON(): OpportunityGenerationErrorSafeDetails {
    return this.toSafeDetails();
  }
}
