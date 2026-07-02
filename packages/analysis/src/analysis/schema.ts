import type { StructuredOutputContract, StructuredOutputField } from "@opportunity-os/llm-analysis";
import type {
  StructuredAnalysisSchemaId,
  StructuredAnalysisValueKind,
  StructuredAnalysisVersion
} from "./primitives.js";

export const STRUCTURED_ANALYSIS_SCHEMA_VALIDATION_MODES = {
  strict: "strict",
  passthrough: "passthrough"
} as const;

export type StructuredAnalysisSchemaValidationMode =
  (typeof STRUCTURED_ANALYSIS_SCHEMA_VALIDATION_MODES)[keyof typeof STRUCTURED_ANALYSIS_SCHEMA_VALIDATION_MODES];

export type StructuredAnalysisSchemaField = StructuredOutputField & {
  readonly path: string;
  readonly acceptedKinds: readonly StructuredAnalysisValueKind[];
};

export type StructuredAnalysisSchemaContract = {
  readonly id: StructuredAnalysisSchemaId;
  readonly name: string;
  readonly version: StructuredAnalysisVersion;
  readonly sourceContract: StructuredOutputContract;
  readonly fields: readonly StructuredAnalysisSchemaField[];
  readonly requiredFieldPaths: readonly string[];
  readonly optionalFieldPaths: readonly string[];
  readonly validationMode: StructuredAnalysisSchemaValidationMode;
};

