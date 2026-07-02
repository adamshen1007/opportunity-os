import type { EventEnvelope } from "@opportunity-os/events";
import type { RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type { OpportunityPipelineId, OpportunityPipelineRunId } from "../pipeline/index.js";
import type { OpportunityPipelineResultStatus } from "../results/index.js";

export const OPPORTUNITY_PIPELINE_EVENT_NAMES = {
  evidenceAggregated: "opportunity_pipeline.evidence_aggregated",
  hypothesisAssembled: "opportunity_pipeline.hypothesis_assembled",
  candidatePrepared: "opportunity_pipeline.candidate_prepared",
  validated: "opportunity_pipeline.validated",
  completed: "opportunity_pipeline.completed",
  failed: "opportunity_pipeline.failed"
} as const;

export type OpportunityPipelineEventName =
  (typeof OPPORTUNITY_PIPELINE_EVENT_NAMES)[keyof typeof OPPORTUNITY_PIPELINE_EVENT_NAMES];

export type OpportunityPipelineEventPayload = {
  readonly pipelineId: OpportunityPipelineId;
  readonly runId?: OpportunityPipelineRunId;
  readonly status: OpportunityPipelineResultStatus;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type OpportunityPipelineEventEnvelope = EventEnvelope<OpportunityPipelineEventPayload>;
