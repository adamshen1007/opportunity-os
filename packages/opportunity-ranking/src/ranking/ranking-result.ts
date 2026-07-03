import type { OpportunityRankingEvent } from "./ranking-event.js";
import type { SafeOpportunityRankingError } from "./ranking-error.js";
import type { OpportunityRankingOutput } from "./ranking-output.js";
import type { OpportunityRankingValidationIssue } from "./ranking-validation.js";

export const OPPORTUNITY_RANKING_RESULT_STATUSES = {
  success: "success",
  validationFailed: "validation-failed",
  failed: "failed"
} as const;

export type OpportunityRankingResultStatus =
  (typeof OPPORTUNITY_RANKING_RESULT_STATUSES)[keyof typeof OPPORTUNITY_RANKING_RESULT_STATUSES];

export type OpportunityRankingResult =
  | {
      readonly status: typeof OPPORTUNITY_RANKING_RESULT_STATUSES.success;
      readonly output: OpportunityRankingOutput;
      readonly events: readonly OpportunityRankingEvent[];
    }
  | {
      readonly status: typeof OPPORTUNITY_RANKING_RESULT_STATUSES.validationFailed;
      readonly issues: readonly OpportunityRankingValidationIssue[];
      readonly error: SafeOpportunityRankingError;
      readonly events: readonly OpportunityRankingEvent[];
    }
  | {
      readonly status: typeof OPPORTUNITY_RANKING_RESULT_STATUSES.failed;
      readonly error: SafeOpportunityRankingError;
      readonly events: readonly OpportunityRankingEvent[];
    };
