import type { RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type { OpportunityPipelineValidationIssue } from "../validation/index.js";

export const OPPORTUNITY_PIPELINE_ERROR_CODES = {
  validationFailed: "pipeline.validation_failed",
  unsafeInput: "pipeline.unsafe_input",
  invalidAssembly: "pipeline.invalid_assembly",
  internalFailure: "pipeline.internal_failure"
} as const;

export const OPPORTUNITY_PIPELINE_ERROR_CATEGORIES = {
  validation: "validation",
  safety: "safety",
  infrastructure: "infrastructure",
  internal: "internal"
} as const;

export type OpportunityPipelineErrorCode =
  (typeof OPPORTUNITY_PIPELINE_ERROR_CODES)[keyof typeof OPPORTUNITY_PIPELINE_ERROR_CODES];

export type OpportunityPipelineErrorCategory =
  (typeof OPPORTUNITY_PIPELINE_ERROR_CATEGORIES)[keyof typeof OPPORTUNITY_PIPELINE_ERROR_CATEGORIES];

export type OpportunityPipelineErrorSafeDetails = {
  readonly code: OpportunityPipelineErrorCode;
  readonly category: OpportunityPipelineErrorCategory;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly issues?: readonly OpportunityPipelineValidationIssue[];
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type OpportunityPipelineErrorOptions = OpportunityPipelineErrorSafeDetails & {
  readonly cause?: unknown;
};

export class OpportunityPipelineError extends Error {
  readonly code: OpportunityPipelineErrorCode;
  readonly category: OpportunityPipelineErrorCategory;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly issues?: readonly OpportunityPipelineValidationIssue[];
  readonly safeMetadata?: RawContentSafeMetadata;

  constructor(options: OpportunityPipelineErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = "OpportunityPipelineError";
    this.code = options.code;
    this.category = options.category;
    this.correlationId = options.correlationId;
    this.requestId = options.requestId;
    this.issues = options.issues;
    this.safeMetadata = options.safeMetadata;
  }

  toSafeDetails(): OpportunityPipelineErrorSafeDetails {
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

  toJSON(): OpportunityPipelineErrorSafeDetails {
    return this.toSafeDetails();
  }
}
