export const ANALYSIS_ERROR_CODES = {
  validationFailed: "analysis.validation_failed",
  unsafePayload: "analysis.unsafe_payload",
  providerUnavailable: "analysis.provider_unavailable",
  internalFailure: "analysis.internal_failure"
} as const;

export const ANALYSIS_ERROR_CATEGORIES = {
  validation: "validation",
  safety: "safety",
  infrastructure: "infrastructure",
  internal: "internal"
} as const;

export type AnalysisErrorCode =
  (typeof ANALYSIS_ERROR_CODES)[keyof typeof ANALYSIS_ERROR_CODES];

export type AnalysisErrorCategory =
  (typeof ANALYSIS_ERROR_CATEGORIES)[keyof typeof ANALYSIS_ERROR_CATEGORIES];

export type AnalysisErrorSafeDetails = {
  readonly code: AnalysisErrorCode;
  readonly category: AnalysisErrorCategory;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean | null>>;
};

export type AnalysisErrorOptions = AnalysisErrorSafeDetails;

export class AnalysisError extends Error {
  readonly code: AnalysisErrorCode;
  readonly category: AnalysisErrorCategory;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean | null>>;

  constructor(options: AnalysisErrorOptions) {
    super(options.message);
    this.name = "AnalysisError";
    this.code = options.code;
    this.category = options.category;
    this.correlationId = options.correlationId;
    this.requestId = options.requestId;
    this.safeMetadata = options.safeMetadata;
  }

  toSafeDetails(): AnalysisErrorSafeDetails {
    return {
      code: this.code,
      category: this.category,
      message: this.message,
      ...(this.correlationId === undefined ? {} : { correlationId: this.correlationId }),
      ...(this.requestId === undefined ? {} : { requestId: this.requestId }),
      ...(this.safeMetadata === undefined ? {} : { safeMetadata: this.safeMetadata })
    };
  }

  toJSON(): AnalysisErrorSafeDetails {
    return this.toSafeDetails();
  }
}
