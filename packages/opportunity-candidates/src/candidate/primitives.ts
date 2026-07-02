export type CandidateOpportunityId = string & { readonly __brand: "CandidateOpportunityId" };

export type CandidateOpportunityVersion = string & { readonly __brand: "CandidateOpportunityVersion" };

export type CandidateOpportunityTimestamp = string & { readonly __brand: "CandidateOpportunityTimestamp" };

export type CandidateOpportunityFieldPath = string & { readonly __brand: "CandidateOpportunityFieldPath" };

export type CandidateOpportunitySafeMetadata = Readonly<Record<string, string | number | boolean | null>>;

export const CANDIDATE_OPPORTUNITY_STATUSES = {
  draft: "draft",
  evidenceReview: "evidence-review",
  validationReady: "validation-ready",
  accepted: "accepted",
  rejected: "rejected",
  archived: "archived",
  superseded: "superseded"
} as const;

export type CandidateOpportunityStatus =
  (typeof CANDIDATE_OPPORTUNITY_STATUSES)[keyof typeof CANDIDATE_OPPORTUNITY_STATUSES];

