import type { OpportunityEvidenceReference } from "../evidence/index.js";
import type { OpportunityHypothesis } from "../hypothesis/index.js";
import type { OpportunityFieldPath, OpportunityId, OpportunitySafeMetadata } from "../opportunity/index.js";

export const OPPORTUNITY_VALIDATION_ISSUE_CODES = {
  missingEvidence: "opportunity.missing_evidence",
  unsupportedSource: "opportunity.unsupported_source",
  invalidHypothesis: "opportunity.invalid_hypothesis",
  invalidScore: "opportunity.invalid_score",
  unsafeMetadata: "opportunity.unsafe_metadata"
} as const;

export type OpportunityValidationIssueCode =
  (typeof OPPORTUNITY_VALIDATION_ISSUE_CODES)[keyof typeof OPPORTUNITY_VALIDATION_ISSUE_CODES];

export type OpportunityValidationIssue = {
  readonly code: OpportunityValidationIssueCode;
  readonly message: string;
  readonly fieldPath?: OpportunityFieldPath;
  readonly safeMetadata?: OpportunitySafeMetadata;
};

export type OpportunityValidationInput = {
  readonly opportunityId: OpportunityId;
  readonly hypothesis?: OpportunityHypothesis;
  readonly evidence: readonly OpportunityEvidenceReference[];
  readonly safeMetadata?: OpportunitySafeMetadata;
};

export type OpportunityValidationSuccess = {
  readonly valid: true;
  readonly input: OpportunityValidationInput;
};

export type OpportunityValidationFailure = {
  readonly valid: false;
  readonly issues: readonly OpportunityValidationIssue[];
};

export type OpportunityValidationResult =
  | OpportunityValidationSuccess
  | OpportunityValidationFailure;

export type OpportunityValidationContract = {
  readonly validate: (input: OpportunityValidationInput) => OpportunityValidationResult;
};
