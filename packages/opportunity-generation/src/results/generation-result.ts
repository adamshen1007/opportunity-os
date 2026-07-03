import type { GeneratedOpportunity, OpportunityGenerationOutput } from "../generation/index.js";
import type { OpportunityGenerationErrorSafeDetails } from "../errors/index.js";
import type { GenerationValidationIssue } from "../validation/index.js";

export const GENERATION_RESULT_STATUSES = {
  success: "success",
  validationFailure: "validation-failure",
  evidenceIncomplete: "evidence-incomplete",
  confidenceUnavailable: "confidence-unavailable",
  failed: "failed"
} as const;

export type GenerationResultStatus =
  (typeof GENERATION_RESULT_STATUSES)[keyof typeof GENERATION_RESULT_STATUSES];

export type GenerationResultSuccess = {
  readonly status: typeof GENERATION_RESULT_STATUSES.success;
  readonly output: OpportunityGenerationOutput;
  readonly generatedOpportunity: GeneratedOpportunity;
};

export type GenerationResultFailure = {
  readonly status: Exclude<GenerationResultStatus, typeof GENERATION_RESULT_STATUSES.success>;
  readonly output?: OpportunityGenerationOutput;
  readonly issues: readonly GenerationValidationIssue[];
  readonly error?: OpportunityGenerationErrorSafeDetails;
};

export type GenerationResult =
  | GenerationResultSuccess
  | GenerationResultFailure;
