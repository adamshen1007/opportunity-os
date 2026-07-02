import type { StructuredAnalysisConfidence } from "@opportunity-os/analysis";
import type { OpportunityEvidenceReference } from "../evidence/index.js";
import type { OpportunityId, OpportunitySafeMetadata } from "../opportunity/index.js";

export type OpportunityScoreValue = number & { readonly __brand: "OpportunityScoreValue" };

export const OPPORTUNITY_SCORE_DIMENSIONS = {
  evidenceStrength: "evidence-strength",
  sourceFrequency: "source-frequency",
  urgencySignal: "urgency-signal",
  clarity: "clarity",
  feasibilitySignal: "feasibility-signal"
} as const;

export type OpportunityScoreDimension =
  (typeof OPPORTUNITY_SCORE_DIMENSIONS)[keyof typeof OPPORTUNITY_SCORE_DIMENSIONS];

export type OpportunityScoreComponent = {
  readonly dimension: OpportunityScoreDimension;
  readonly value: OpportunityScoreValue;
  readonly rationale: string;
  readonly evidence: readonly OpportunityEvidenceReference[];
  readonly confidence?: StructuredAnalysisConfidence;
  readonly safeMetadata?: OpportunitySafeMetadata;
};

export type OpportunityScore = {
  readonly opportunityId: OpportunityId;
  readonly overall: OpportunityScoreValue;
  readonly components: readonly OpportunityScoreComponent[];
  readonly safeMetadata?: OpportunitySafeMetadata;
};
