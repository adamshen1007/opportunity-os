import type {
  OpportunityConfidence,
  OpportunityEvidenceReference,
  OpportunityHypothesis,
  OpportunityId
} from "@opportunity-os/opportunity-engine";
import type { PipelineCandidateOpportunityId } from "@opportunity-os/opportunity-pipeline";
import type { CandidateOpportunityLifecycle } from "../lifecycle/index.js";
import type { CandidateOpportunityMetadata } from "../metadata/index.js";
import type { CandidateOpportunityProvenance } from "../provenance/index.js";
import type { CandidateOpportunityId, CandidateOpportunitySafeMetadata } from "./primitives.js";

export type CandidateOpportunity = {
  readonly candidateId: CandidateOpportunityId;
  readonly upstreamCandidateId?: PipelineCandidateOpportunityId;
  readonly opportunityId?: OpportunityId;
  readonly hypothesis: OpportunityHypothesis;
  readonly evidence: readonly OpportunityEvidenceReference[];
  readonly confidence?: OpportunityConfidence;
  readonly lifecycle: CandidateOpportunityLifecycle;
  readonly metadata: CandidateOpportunityMetadata;
  readonly provenance: CandidateOpportunityProvenance;
  readonly safeMetadata?: CandidateOpportunitySafeMetadata;
};

export type CandidateOpportunityInput = {
  readonly upstreamCandidateId: PipelineCandidateOpportunityId;
  readonly safeMetadata?: CandidateOpportunitySafeMetadata;
};

export type CandidateOpportunityContract = {
  readonly input: CandidateOpportunityInput;
  readonly candidate: CandidateOpportunity;
};

