import type { StructuredAnalysisOutput } from "./analysis-output.js";
import type { StructuredAnalysisInput } from "./analysis-input.js";
import type { StructuredAnalysisFieldPath, StructuredAnalysisPrimitiveValue } from "./primitives.js";
import type { StructuredAnalysisSchemaContract } from "./schema.js";

export const STRUCTURED_ANALYSIS_NORMALIZATION_STAGES = {
  fieldSelection: "field-selection",
  valueCoercion: "value-coercion",
  metadataPreservation: "metadata-preservation"
} as const;

export type StructuredAnalysisNormalizationStage =
  (typeof STRUCTURED_ANALYSIS_NORMALIZATION_STAGES)[keyof typeof STRUCTURED_ANALYSIS_NORMALIZATION_STAGES];

export type StructuredAnalysisNormalizationRule = {
  readonly fieldPath: StructuredAnalysisFieldPath;
  readonly stage: StructuredAnalysisNormalizationStage;
  readonly description: string;
};

export type StructuredAnalysisNormalizationInput = {
  readonly input: StructuredAnalysisInput;
  readonly schema: StructuredAnalysisSchemaContract;
  readonly candidateValues: Readonly<Record<string, StructuredAnalysisPrimitiveValue>>;
};

export type StructuredAnalysisNormalizationResult = {
  readonly output: StructuredAnalysisOutput;
  readonly appliedRules: readonly StructuredAnalysisNormalizationRule[];
};

