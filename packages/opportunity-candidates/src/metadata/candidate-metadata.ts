import type {
  OpportunityPipelineId,
  OpportunityPipelineRunId,
  OpportunityPipelineStageId
} from "@opportunity-os/opportunity-pipeline";
import type {
  CandidateOpportunitySafeMetadata,
  CandidateOpportunityTimestamp,
  CandidateOpportunityVersion
} from "../candidate/index.js";

export type CandidateOpportunitySourceMetadata = {
  readonly pipelineId: OpportunityPipelineId;
  readonly runId: OpportunityPipelineRunId;
  readonly stageId?: OpportunityPipelineStageId;
};

export type CandidateOpportunityMetadata = {
  readonly source: CandidateOpportunitySourceMetadata;
  readonly version: CandidateOpportunityVersion;
  readonly createdAt: CandidateOpportunityTimestamp;
  readonly updatedAt?: CandidateOpportunityTimestamp;
  readonly tags?: readonly string[];
  readonly safeMetadata?: CandidateOpportunitySafeMetadata;
};

