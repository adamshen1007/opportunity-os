import type { PromptId, PromptSafetyClassification, PromptVersion } from "./prompt-contract.js";
import type { PromptTemplateVariable } from "./prompt-template-variable.js";

export type PromptTemplate = {
  readonly promptId: PromptId;
  readonly version: PromptVersion;
  readonly templateId: string;
  readonly placeholders: readonly string[];
  readonly variables: readonly PromptTemplateVariable[];
  readonly safetyMetadata: {
    readonly classification: PromptSafetyClassification;
    readonly redactionRequired: boolean;
    readonly allowedInputKeys: readonly string[];
  };
};
