import type { StructuredOutputValue } from "../structured-output/index.js";
import type { SafetyMetadata } from "./safety-classification.js";

export type SafeAnalysisPayload = {
  readonly values: Readonly<Record<string, StructuredOutputValue>>;
  readonly safety: SafetyMetadata;
  readonly redacted: boolean;
};
