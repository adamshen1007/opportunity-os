import type { StructuredAnalysisConfidence, StructuredAnalysisEvidenceReference } from "@opportunity-os/analysis";
import type { RawContentProvenance, RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type { OpportunityFieldPath, OpportunityId } from "../opportunity/index.js";
import type { OpportunitySourceReference } from "../source/index.js";

export type OpportunityEvidenceId = string & { readonly __brand: "OpportunityEvidenceId" };

export const OPPORTUNITY_EVIDENCE_KINDS = {
  sourceSignal: "source-signal",
  structuredAnalysis: "structured-analysis",
  repeatedPattern: "repeated-pattern",
  supportingContext: "supporting-context"
} as const;

export type OpportunityEvidenceKind =
  (typeof OPPORTUNITY_EVIDENCE_KINDS)[keyof typeof OPPORTUNITY_EVIDENCE_KINDS];

export type OpportunityEvidenceReference = {
  readonly evidenceId: OpportunityEvidenceId;
  readonly opportunityId?: OpportunityId;
  readonly kind: OpportunityEvidenceKind;
  readonly source: OpportunitySourceReference;
  readonly structuredEvidence?: StructuredAnalysisEvidenceReference;
  readonly fieldPath?: OpportunityFieldPath;
  readonly confidence?: StructuredAnalysisConfidence;
  readonly provenance: RawContentProvenance;
  readonly safeMetadata?: RawContentSafeMetadata;
};
