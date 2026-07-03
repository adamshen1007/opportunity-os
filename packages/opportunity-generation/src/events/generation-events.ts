import type { CandidateOpportunityId } from "@opportunity-os/opportunity-candidates";
import type { OpportunityId } from "@opportunity-os/opportunity-engine";
import type {
  OpportunityGenerationOutputId,
  OpportunityGenerationRunId,
  OpportunityGenerationSafeMetadata
} from "../generation/index.js";
import type { GenerationResultStatus } from "../results/index.js";

export const GENERATION_EVENT_NAMES = {
  evidenceAssembled: "generation.evidence_assembled",
  candidateValidated: "generation.candidate_validated",
  confidenceAggregated: "generation.confidence_aggregated",
  opportunityGenerated: "generation.opportunity_generated",
  failed: "generation.failed"
} as const;

export type GenerationEventName =
  (typeof GENERATION_EVENT_NAMES)[keyof typeof GENERATION_EVENT_NAMES];

export type GenerationEventPayload = {
  readonly runId: OpportunityGenerationRunId;
  readonly outputId?: OpportunityGenerationOutputId;
  readonly candidateId?: CandidateOpportunityId;
  readonly opportunityId?: OpportunityId;
  readonly status: GenerationResultStatus;
  readonly safeMetadata?: OpportunityGenerationSafeMetadata;
};

export type GenerationEventEnvelope = {
  readonly eventName: GenerationEventName;
  readonly payload: GenerationEventPayload;
};
