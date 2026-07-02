import type { StructuredOutputContract } from "@opportunity-os/llm-analysis";
import type { StructuredAnalysisOutput } from "./analysis-output.js";
import type {
  StructuredAnalysisFieldPath,
  StructuredAnalysisParserId,
  StructuredAnalysisPrimitiveValue,
  StructuredAnalysisVersion
} from "./primitives.js";

export const STRUCTURED_ANALYSIS_PARSE_STATUSES = {
  parsed: "parsed",
  invalid: "invalid"
} as const;

export type StructuredAnalysisParseStatus =
  (typeof STRUCTURED_ANALYSIS_PARSE_STATUSES)[keyof typeof STRUCTURED_ANALYSIS_PARSE_STATUSES];

export type StructuredAnalysisParseIssue = {
  readonly path: StructuredAnalysisFieldPath;
  readonly code: string;
  readonly message: string;
};

export type StructuredAnalysisParseInput = {
  readonly rawOutput: StructuredAnalysisPrimitiveValue;
  readonly schema: StructuredOutputContract;
};

export type StructuredAnalysisParseResult = {
  readonly status: StructuredAnalysisParseStatus;
  readonly output?: StructuredAnalysisOutput;
  readonly issues: readonly StructuredAnalysisParseIssue[];
};

export type StructuredAnalysisParserContract = {
  readonly id: StructuredAnalysisParserId;
  readonly version: StructuredAnalysisVersion;
  readonly parse: (input: StructuredAnalysisParseInput) => StructuredAnalysisParseResult;
};

