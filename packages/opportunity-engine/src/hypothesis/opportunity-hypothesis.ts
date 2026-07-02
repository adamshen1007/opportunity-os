import type { StructuredAnalysisConfidence } from "@opportunity-os/analysis";
import type { RawContentProvenance, RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type { OpportunityEvidenceReference } from "../evidence/index.js";
import type { OpportunityId, OpportunityLifecycleMetadata } from "../opportunity/index.js";

export type OpportunityHypothesisId = string & { readonly __brand: "OpportunityHypothesisId" };

export const OPPORTUNITY_HYPOTHESIS_STATUSES = {
  proposed: "proposed",
  supported: "supported",
  needsReview: "needs-review",
  rejected: "rejected"
} as const;

export type OpportunityHypothesisStatus =
  (typeof OPPORTUNITY_HYPOTHESIS_STATUSES)[keyof typeof OPPORTUNITY_HYPOTHESIS_STATUSES];

export type OpportunityHypothesis = {
  readonly hypothesisId: OpportunityHypothesisId;
  readonly opportunityId: OpportunityId;
  readonly status: OpportunityHypothesisStatus;
  readonly statement: string;
  readonly assumptions: readonly string[];
  readonly evidence: readonly OpportunityEvidenceReference[];
  readonly confidence?: StructuredAnalysisConfidence;
  readonly provenance: RawContentProvenance;
  readonly lifecycle: OpportunityLifecycleMetadata;
  readonly safeMetadata?: RawContentSafeMetadata;
};
