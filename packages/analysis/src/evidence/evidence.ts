import type { RawContentProvenance, RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type {
  StructuredAnalysisFieldPath,
  StructuredAnalysisId,
  StructuredAnalysisPrimitiveValue
} from "../analysis/index.js";
import type { StructuredAnalysisConfidence } from "../confidence/index.js";

export type StructuredAnalysisEvidenceId = string & { readonly __brand: "StructuredAnalysisEvidenceId" };

export const STRUCTURED_ANALYSIS_EVIDENCE_KINDS = {
  sourceExcerpt: "source-excerpt",
  normalizedSegment: "normalized-segment",
  embeddingReference: "embedding-reference",
  structuredField: "structured-field"
} as const;

export type StructuredAnalysisEvidenceKind =
  (typeof STRUCTURED_ANALYSIS_EVIDENCE_KINDS)[keyof typeof STRUCTURED_ANALYSIS_EVIDENCE_KINDS];

export type StructuredAnalysisEvidenceReference = {
  readonly evidenceId: StructuredAnalysisEvidenceId;
  readonly analysisId: StructuredAnalysisId;
  readonly kind: StructuredAnalysisEvidenceKind;
  readonly fieldPath?: StructuredAnalysisFieldPath;
  readonly value?: StructuredAnalysisPrimitiveValue;
  readonly confidence?: StructuredAnalysisConfidence;
  readonly provenance: RawContentProvenance;
  readonly safeMetadata?: RawContentSafeMetadata;
};

