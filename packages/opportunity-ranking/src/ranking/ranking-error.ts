import type { OpportunityRankingRequestId, OpportunityRankingSafeMetadata } from "./primitives.js";
import type { OpportunityRankingValidationIssue } from "./ranking-validation.js";

export const OPPORTUNITY_RANKING_ERROR_CODES = {
  validationFailed: "opportunity-ranking.validation-failed",
  rankingFailed: "opportunity-ranking.failed"
} as const;

export type OpportunityRankingErrorCode =
  (typeof OPPORTUNITY_RANKING_ERROR_CODES)[keyof typeof OPPORTUNITY_RANKING_ERROR_CODES];

export type SafeOpportunityRankingError = {
  readonly code: OpportunityRankingErrorCode;
  readonly message: string;
  readonly requestId?: OpportunityRankingRequestId;
  readonly issues?: readonly OpportunityRankingValidationIssue[];
  readonly safeMetadata?: OpportunityRankingSafeMetadata;
};

export class OpportunityRankingError extends Error {
  readonly code: OpportunityRankingErrorCode;
  readonly requestId?: OpportunityRankingRequestId;
  readonly issues?: readonly OpportunityRankingValidationIssue[];
  readonly safeMetadata?: OpportunityRankingSafeMetadata;

  constructor(input: SafeOpportunityRankingError) {
    super(input.message);
    this.name = "OpportunityRankingError";
    this.code = input.code;
    this.requestId = input.requestId;
    this.issues = input.issues;
    this.safeMetadata = input.safeMetadata;
  }

  toSafeObject(): SafeOpportunityRankingError {
    return {
      code: this.code,
      message: this.message,
      requestId: this.requestId,
      issues: this.issues,
      safeMetadata: this.safeMetadata
    };
  }
}
