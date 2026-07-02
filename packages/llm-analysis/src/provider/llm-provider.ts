import type { LlmProviderMetadata } from "./llm-provider-metadata.js";

export type LlmProviderContract = {
  readonly metadata: LlmProviderMetadata;
  readonly supportsStructuredOutput: boolean;
  readonly supportsSafetyClassification: boolean;
};
