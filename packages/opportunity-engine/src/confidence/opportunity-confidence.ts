import type { StructuredAnalysisConfidence } from "@opportunity-os/analysis";
import type { OpportunityEvidenceReference } from "../evidence/index.js";
import type { OpportunityId, OpportunitySafeMetadata } from "../opportunity/index.js";

export const OPPORTUNITY_CONFIDENCE_LEVELS = {
  low: "low",
  medium: "medium",
  high: "high",
  unknown: "unknown"
} as const;

export type OpportunityConfidenceLevel =
  (typeof OPPORTUNITY_CONFIDENCE_LEVELS)[keyof typeof OPPORTUNITY_CONFIDENCE_LEVELS];

export type OpportunityConfidence = {
  readonly opportunityId: OpportunityId;
  readonly level: OpportunityConfidenceLevel;
  readonly structuredAnalysis?: StructuredAnalysisConfidence;
  readonly evidence: readonly OpportunityEvidenceReference[];
  readonly rationale?: string;
  readonly safeMetadata?: OpportunitySafeMetadata;
};
