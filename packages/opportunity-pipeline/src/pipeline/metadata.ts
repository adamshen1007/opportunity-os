import type {
  OpportunityPipelineId,
  OpportunityPipelineLifecycleMetadata,
  OpportunityPipelineRunId,
  OpportunityPipelineSafeMetadata,
  OpportunityPipelineTimestamp,
  OpportunityPipelineVersion
} from "./primitives.js";
import type { OpportunityPipelineStageRecord } from "./stages.js";

export type OpportunityPipelineDefinitionMetadata = {
  readonly pipelineId: OpportunityPipelineId;
  readonly name: string;
  readonly version: OpportunityPipelineVersion;
  readonly lifecycle: OpportunityPipelineLifecycleMetadata;
  readonly safeMetadata?: OpportunityPipelineSafeMetadata;
};

export type OpportunityPipelineRunMetadata = {
  readonly runId: OpportunityPipelineRunId;
  readonly pipelineId: OpportunityPipelineId;
  readonly startedAt?: OpportunityPipelineTimestamp;
  readonly completedAt?: OpportunityPipelineTimestamp;
  readonly stages: readonly OpportunityPipelineStageRecord[];
  readonly safeMetadata?: OpportunityPipelineSafeMetadata;
};

export type OpportunityPipelineMetadata = {
  readonly definition: OpportunityPipelineDefinitionMetadata;
  readonly run?: OpportunityPipelineRunMetadata;
};
