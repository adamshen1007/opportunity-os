import type {
  CandidateOpportunity,
  CandidateOpportunityFieldPath,
  CandidateOpportunitySafeMetadata
} from "../candidate/index.js";
import type { CandidateConfidenceAggregation } from "../confidence/index.js";
import type { CandidateEvidenceCompleteness } from "../evidence/index.js";

export const CANDIDATE_VALIDATION_ISSUE_CODES = {
  missingCandidate: "candidate.missing_candidate",
  missingHypothesis: "candidate.missing_hypothesis",
  missingEvidence: "candidate.missing_evidence",
  incompleteEvidence: "candidate.incomplete_evidence",
  unsupportedProvenance: "candidate.unsupported_provenance",
  confidenceReviewRequired: "candidate.confidence_review_required",
  unsafeMetadata: "candidate.unsafe_metadata"
} as const;

export type CandidateValidationIssueCode =
  (typeof CANDIDATE_VALIDATION_ISSUE_CODES)[keyof typeof CANDIDATE_VALIDATION_ISSUE_CODES];

export type CandidateValidationIssue = {
  readonly code: CandidateValidationIssueCode;
  readonly message: string;
  readonly fieldPath?: CandidateOpportunityFieldPath;
  readonly safeMetadata?: CandidateOpportunitySafeMetadata;
};

export type CandidateValidationInput = {
  readonly candidate: CandidateOpportunity;
  readonly evidenceCompleteness?: CandidateEvidenceCompleteness;
  readonly confidenceAggregation?: CandidateConfidenceAggregation;
  readonly safeMetadata?: CandidateOpportunitySafeMetadata;
};

export type CandidateValidationSuccess = {
  readonly valid: true;
  readonly input: CandidateValidationInput;
};

export type CandidateValidationFailure = {
  readonly valid: false;
  readonly issues: readonly CandidateValidationIssue[];
};

export type CandidateValidationResult =
  | CandidateValidationSuccess
  | CandidateValidationFailure;

export type CandidateValidationContract = {
  readonly input: CandidateValidationInput;
  readonly result: CandidateValidationResult;
};

