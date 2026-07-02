export type StructuredAnalysisId = string & { readonly __brand: "StructuredAnalysisId" };

export type StructuredAnalysisSchemaId = string & { readonly __brand: "StructuredAnalysisSchemaId" };

export type StructuredAnalysisParserId = string & { readonly __brand: "StructuredAnalysisParserId" };

export type StructuredAnalysisVersion = string & { readonly __brand: "StructuredAnalysisVersion" };

export type StructuredAnalysisFieldPath = string & { readonly __brand: "StructuredAnalysisFieldPath" };

export type StructuredAnalysisTimestamp = string & { readonly __brand: "StructuredAnalysisTimestamp" };

export const STRUCTURED_ANALYSIS_VALUE_KINDS = {
  string: "string",
  number: "number",
  boolean: "boolean",
  object: "object",
  array: "array",
  null: "null"
} as const;

export type StructuredAnalysisValueKind =
  (typeof STRUCTURED_ANALYSIS_VALUE_KINDS)[keyof typeof STRUCTURED_ANALYSIS_VALUE_KINDS];

export type StructuredAnalysisPrimitiveValue =
  | string
  | number
  | boolean
  | null
  | readonly StructuredAnalysisPrimitiveValue[]
  | { readonly [key: string]: StructuredAnalysisPrimitiveValue };

