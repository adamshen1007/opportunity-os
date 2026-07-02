import type {
  OpportunityPipelineFieldPath,
  OpportunityPipelineSafeMetadata,
  OpportunityPipelineStageId,
  OpportunityPipelineTimestamp
} from "./primitives.js";

export const OPPORTUNITY_PIPELINE_STAGE_KINDS = {
  evidenceAggregation: "evidence-aggregation",
  hypothesisAssembly: "hypothesis-assembly",
  candidateOpportunity: "candidate-opportunity",
  validation: "validation",
  resultAssembly: "result-assembly"
} as const;

export type OpportunityPipelineStageKind =
  (typeof OPPORTUNITY_PIPELINE_STAGE_KINDS)[keyof typeof OPPORTUNITY_PIPELINE_STAGE_KINDS];

export const OPPORTUNITY_PIPELINE_STAGE_STATUSES = {
  pending: "pending",
  ready: "ready",
  completed: "completed",
  skipped: "skipped",
  failed: "failed"
} as const;

export type OpportunityPipelineStageStatus =
  (typeof OPPORTUNITY_PIPELINE_STAGE_STATUSES)[keyof typeof OPPORTUNITY_PIPELINE_STAGE_STATUSES];

export type OpportunityPipelineStageDependency = {
  readonly stageId: OpportunityPipelineStageId;
  readonly required: boolean;
  readonly fieldPaths?: readonly OpportunityPipelineFieldPath[];
};

export type OpportunityPipelineStageDefinition = {
  readonly stageId: OpportunityPipelineStageId;
  readonly kind: OpportunityPipelineStageKind;
  readonly name: string;
  readonly dependsOn?: readonly OpportunityPipelineStageDependency[];
  readonly safeMetadata?: OpportunityPipelineSafeMetadata;
};

export type OpportunityPipelineStageRecord = {
  readonly stageId: OpportunityPipelineStageId;
  readonly kind: OpportunityPipelineStageKind;
  readonly status: OpportunityPipelineStageStatus;
  readonly recordedAt: OpportunityPipelineTimestamp;
  readonly safeMetadata?: OpportunityPipelineSafeMetadata;
};
