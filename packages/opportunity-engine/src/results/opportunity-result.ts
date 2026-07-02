import type { OpportunityConfidence } from "../confidence/index.js";
import type { OpportunityEngineErrorSafeDetails } from "../errors/index.js";
import type { OpportunityEvidenceReference } from "../evidence/index.js";
import type { OpportunityHypothesis } from "../hypothesis/index.js";
import type { OpportunityId, OpportunitySafeMetadata } from "../opportunity/index.js";
import type { OpportunityRanking } from "../ranking/index.js";
import type { OpportunityScore } from "../scoring/index.js";
import type { OpportunityValidationIssue } from "../validation/index.js";

export const OPPORTUNITY_RESULT_STATUSES = {
  success: "success",
  validationFailure: "validation-failure",
  partial: "partial",
  failed: "failed"
} as const;

export type OpportunityResultStatus =
  (typeof OPPORTUNITY_RESULT_STATUSES)[keyof typeof OPPORTUNITY_RESULT_STATUSES];

export type OpportunityResultSuccess = {
  readonly status: typeof OPPORTUNITY_RESULT_STATUSES.success;
  readonly opportunityId: OpportunityId;
  readonly hypothesis: OpportunityHypothesis;
  readonly evidence: readonly OpportunityEvidenceReference[];
  readonly score?: OpportunityScore;
  readonly confidence?: OpportunityConfidence;
  readonly ranking?: OpportunityRanking;
  readonly safeMetadata?: OpportunitySafeMetadata;
};

export type OpportunityResultFailure = {
  readonly status: Exclude<OpportunityResultStatus, typeof OPPORTUNITY_RESULT_STATUSES.success>;
  readonly issues: readonly OpportunityValidationIssue[];
  readonly error?: OpportunityEngineErrorSafeDetails;
  readonly safeMetadata?: OpportunitySafeMetadata;
};

export type OpportunityResult =
  | OpportunityResultSuccess
  | OpportunityResultFailure;
