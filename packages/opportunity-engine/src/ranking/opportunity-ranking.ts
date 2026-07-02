import type { OpportunityConfidence } from "../confidence/index.js";
import type { OpportunityEvidenceReference } from "../evidence/index.js";
import type { OpportunityId, OpportunitySafeMetadata } from "../opportunity/index.js";
import type { OpportunityScore } from "../scoring/index.js";

export type OpportunityRankPosition = number & { readonly __brand: "OpportunityRankPosition" };

export const OPPORTUNITY_RANKING_STATUSES = {
  unranked: "unranked",
  candidate: "candidate",
  included: "included",
  excluded: "excluded"
} as const;

export type OpportunityRankingStatus =
  (typeof OPPORTUNITY_RANKING_STATUSES)[keyof typeof OPPORTUNITY_RANKING_STATUSES];

export type OpportunityRankingInput = {
  readonly opportunityId: OpportunityId;
  readonly score?: OpportunityScore;
  readonly confidence?: OpportunityConfidence;
  readonly evidence: readonly OpportunityEvidenceReference[];
  readonly safeMetadata?: OpportunitySafeMetadata;
};

export type OpportunityRanking = {
  readonly opportunityId: OpportunityId;
  readonly status: OpportunityRankingStatus;
  readonly position?: OpportunityRankPosition;
  readonly input: OpportunityRankingInput;
  readonly explanation?: string;
  readonly safeMetadata?: OpportunitySafeMetadata;
};
