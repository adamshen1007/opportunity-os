import type { CandidateOpportunitySafeMetadata } from "../candidate/index.js";
import type { CandidateValidationIssue } from "../validation/index.js";

export const CANDIDATE_ERROR_CODES = {
  validationFailed: "candidate.validation_failed",
  incompleteEvidence: "candidate.incomplete_evidence",
  unsafeInput: "candidate.unsafe_input",
  internalFailure: "candidate.internal_failure"
} as const;

export const CANDIDATE_ERROR_CATEGORIES = {
  validation: "validation",
  safety: "safety",
  infrastructure: "infrastructure",
  internal: "internal"
} as const;

export type CandidateErrorCode =
  (typeof CANDIDATE_ERROR_CODES)[keyof typeof CANDIDATE_ERROR_CODES];

export type CandidateErrorCategory =
  (typeof CANDIDATE_ERROR_CATEGORIES)[keyof typeof CANDIDATE_ERROR_CATEGORIES];

export type CandidateErrorSafeDetails = {
  readonly code: CandidateErrorCode;
  readonly category: CandidateErrorCategory;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly issues?: readonly CandidateValidationIssue[];
  readonly safeMetadata?: CandidateOpportunitySafeMetadata;
};

export type CandidateErrorOptions = CandidateErrorSafeDetails & {
  readonly cause?: unknown;
};

export class CandidateOpportunityError extends Error {
  readonly code: CandidateErrorCode;
  readonly category: CandidateErrorCategory;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly issues?: readonly CandidateValidationIssue[];
  readonly safeMetadata?: CandidateOpportunitySafeMetadata;

  constructor(options: CandidateErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = "CandidateOpportunityError";
    this.code = options.code;
    this.category = options.category;
    this.correlationId = options.correlationId;
    this.requestId = options.requestId;
    this.issues = options.issues;
    this.safeMetadata = options.safeMetadata;
  }

  toSafeDetails(): CandidateErrorSafeDetails {
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

  toJSON(): CandidateErrorSafeDetails {
    return this.toSafeDetails();
  }
}

