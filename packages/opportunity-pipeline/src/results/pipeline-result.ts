import type { RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type { PipelineCandidateOpportunity } from "../assembly/index.js";
import type { OpportunityPipelineErrorSafeDetails } from "../errors/index.js";
import type { OpportunityPipelineMetadata } from "../pipeline/index.js";
import type { OpportunityPipelineValidationIssue } from "../validation/index.js";

export const OPPORTUNITY_PIPELINE_RESULT_STATUSES = {
  success: "success",
  validationFailure: "validation-failure",
  partial: "partial",
  failed: "failed"
} as const;

export type OpportunityPipelineResultStatus =
  (typeof OPPORTUNITY_PIPELINE_RESULT_STATUSES)[keyof typeof OPPORTUNITY_PIPELINE_RESULT_STATUSES];

export type OpportunityPipelineResultSuccess = {
  readonly status: typeof OPPORTUNITY_PIPELINE_RESULT_STATUSES.success;
  readonly metadata: OpportunityPipelineMetadata;
  readonly candidates: readonly PipelineCandidateOpportunity[];
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type OpportunityPipelineResultFailure = {
  readonly status: Exclude<OpportunityPipelineResultStatus, typeof OPPORTUNITY_PIPELINE_RESULT_STATUSES.success>;
  readonly metadata?: OpportunityPipelineMetadata;
  readonly issues: readonly OpportunityPipelineValidationIssue[];
  readonly error?: OpportunityPipelineErrorSafeDetails;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type OpportunityPipelineResult =
  | OpportunityPipelineResultSuccess
  | OpportunityPipelineResultFailure;
