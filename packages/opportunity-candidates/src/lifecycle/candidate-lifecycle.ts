import type {
  CandidateOpportunityStatus,
  CandidateOpportunityTimestamp,
  CandidateOpportunityVersion
} from "../candidate/index.js";

export const CANDIDATE_OPPORTUNITY_LIFECYCLE_STATES = {
  draft: "draft",
  evidenceIncomplete: "evidence-incomplete",
  evidenceReview: "evidence-review",
  validationReady: "validation-ready",
  accepted: "accepted",
  rejected: "rejected",
  archived: "archived",
  superseded: "superseded"
} as const;

export type CandidateOpportunityLifecycleState =
  (typeof CANDIDATE_OPPORTUNITY_LIFECYCLE_STATES)[keyof typeof CANDIDATE_OPPORTUNITY_LIFECYCLE_STATES];

export type CandidateOpportunityLifecycle = {
  readonly state: CandidateOpportunityLifecycleState;
  readonly status: CandidateOpportunityStatus;
  readonly version: CandidateOpportunityVersion;
  readonly createdAt: CandidateOpportunityTimestamp;
  readonly updatedAt?: CandidateOpportunityTimestamp;
  readonly reviewedAt?: CandidateOpportunityTimestamp;
  readonly supersededAt?: CandidateOpportunityTimestamp;
};

export type CandidateOpportunityLifecycleTransition = {
  readonly from: CandidateOpportunityLifecycleState;
  readonly to: CandidateOpportunityLifecycleState;
  readonly reasonCode: string;
  readonly recordedAt: CandidateOpportunityTimestamp;
};

