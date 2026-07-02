import type {
  CandidateOpportunityId,
  CandidateOpportunitySafeMetadata
} from "../candidate/index.js";
import type { CandidateResultStatus } from "../results/index.js";

export const CANDIDATE_EVENT_NAMES = {
  evidenceReviewed: "candidate.evidence_reviewed",
  confidenceAggregated: "candidate.confidence_aggregated",
  validated: "candidate.validated",
  accepted: "candidate.accepted",
  rejected: "candidate.rejected",
  failed: "candidate.failed"
} as const;

export type CandidateEventName =
  (typeof CANDIDATE_EVENT_NAMES)[keyof typeof CANDIDATE_EVENT_NAMES];

export type CandidateEventPayload = {
  readonly candidateId: CandidateOpportunityId;
  readonly status: CandidateResultStatus;
  readonly safeMetadata?: CandidateOpportunitySafeMetadata;
};

export type CandidateEventEnvelope = {
  readonly eventName: CandidateEventName;
  readonly payload: CandidateEventPayload;
};

