import type { CandidateOpportunity } from "../candidate/index.js";
import type { CandidateConfidenceAggregation } from "../confidence/index.js";
import type { CandidateErrorSafeDetails } from "../errors/index.js";
import type { CandidateEvidenceCompleteness } from "../evidence/index.js";
import type { CandidateValidationIssue } from "../validation/index.js";

export const CANDIDATE_RESULT_STATUSES = {
  success: "success",
  validationFailure: "validation-failure",
  evidenceIncomplete: "evidence-incomplete",
  failed: "failed"
} as const;

export type CandidateResultStatus =
  (typeof CANDIDATE_RESULT_STATUSES)[keyof typeof CANDIDATE_RESULT_STATUSES];

export type CandidateResultSuccess = {
  readonly status: typeof CANDIDATE_RESULT_STATUSES.success;
  readonly candidate: CandidateOpportunity;
  readonly evidenceCompleteness?: CandidateEvidenceCompleteness;
  readonly confidenceAggregation?: CandidateConfidenceAggregation;
};

export type CandidateResultFailure = {
  readonly status: Exclude<CandidateResultStatus, typeof CANDIDATE_RESULT_STATUSES.success>;
  readonly candidate?: CandidateOpportunity;
  readonly issues: readonly CandidateValidationIssue[];
  readonly error?: CandidateErrorSafeDetails;
};

export type CandidateResult =
  | CandidateResultSuccess
  | CandidateResultFailure;

