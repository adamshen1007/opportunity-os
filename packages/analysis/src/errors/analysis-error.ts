import type { StructuredAnalysisValidationIssue } from "../validation/index.js";

export const STRUCTURED_ANALYSIS_ERROR_CODES = {
  validationFailed: "structured-analysis.validation_failed",
  unsafeStructuredOutput: "structured-analysis.unsafe_structured_output",
  schemaMismatch: "structured-analysis.schema_mismatch",
  internalFailure: "structured-analysis.internal_failure"
} as const;

export const STRUCTURED_ANALYSIS_ERROR_CATEGORIES = {
  validation: "validation",
  safety: "safety",
  infrastructure: "infrastructure",
  internal: "internal"
} as const;

export type StructuredAnalysisErrorCode =
  (typeof STRUCTURED_ANALYSIS_ERROR_CODES)[keyof typeof STRUCTURED_ANALYSIS_ERROR_CODES];

export type StructuredAnalysisErrorCategory =
  (typeof STRUCTURED_ANALYSIS_ERROR_CATEGORIES)[keyof typeof STRUCTURED_ANALYSIS_ERROR_CATEGORIES];

export type StructuredAnalysisErrorSafeDetails = {
  readonly code: StructuredAnalysisErrorCode;
  readonly category: StructuredAnalysisErrorCategory;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly issues?: readonly StructuredAnalysisValidationIssue[];
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean | null>>;
};

export type StructuredAnalysisErrorOptions = StructuredAnalysisErrorSafeDetails & {
  readonly cause?: unknown;
};

export class StructuredAnalysisError extends Error {
  readonly code: StructuredAnalysisErrorCode;
  readonly category: StructuredAnalysisErrorCategory;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly issues?: readonly StructuredAnalysisValidationIssue[];
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean | null>>;

  constructor(options: StructuredAnalysisErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = "StructuredAnalysisError";
    this.code = options.code;
    this.category = options.category;
    this.correlationId = options.correlationId;
    this.requestId = options.requestId;
    this.issues = options.issues;
    this.safeMetadata = options.safeMetadata;
  }

  toSafeDetails(): StructuredAnalysisErrorSafeDetails {
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

  toJSON(): StructuredAnalysisErrorSafeDetails {
    return this.toSafeDetails();
  }
}

