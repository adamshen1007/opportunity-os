export type OpportunityPipelineId = string & { readonly __brand: "OpportunityPipelineId" };

export type OpportunityPipelineRunId = string & { readonly __brand: "OpportunityPipelineRunId" };

export type OpportunityPipelineStageId = string & { readonly __brand: "OpportunityPipelineStageId" };

export type OpportunityPipelineVersion = string & { readonly __brand: "OpportunityPipelineVersion" };

export type OpportunityPipelineTimestamp = string & { readonly __brand: "OpportunityPipelineTimestamp" };

export type OpportunityPipelineFieldPath = string & { readonly __brand: "OpportunityPipelineFieldPath" };

export type OpportunityPipelineSafeMetadata = Readonly<Record<string, string | number | boolean | null>>;

export const OPPORTUNITY_PIPELINE_STATUSES = {
  draft: "draft",
  ready: "ready",
  completed: "completed",
  failed: "failed",
  archived: "archived"
} as const;

export type OpportunityPipelineStatus =
  (typeof OPPORTUNITY_PIPELINE_STATUSES)[keyof typeof OPPORTUNITY_PIPELINE_STATUSES];

export type OpportunityPipelineLifecycleMetadata = {
  readonly createdAt: OpportunityPipelineTimestamp;
  readonly updatedAt?: OpportunityPipelineTimestamp;
  readonly version: OpportunityPipelineVersion;
  readonly status: OpportunityPipelineStatus;
};
