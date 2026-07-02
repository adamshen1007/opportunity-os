import type { StructuredOutputContract } from "../structured-output/index.js";

export const PROMPT_SAFETY_CLASSIFICATIONS = {
  public: "public",
  internal: "internal",
  sensitive: "sensitive"
} as const;

export type PromptSafetyClassification =
  (typeof PROMPT_SAFETY_CLASSIFICATIONS)[keyof typeof PROMPT_SAFETY_CLASSIFICATIONS];

export type PromptId = string & { readonly __brand: "PromptId" };

export type PromptVersion = string & { readonly __brand: "PromptVersion" };

export type PromptInputShape = {
  readonly schemaName: string;
  readonly schemaVersion: string;
  readonly requiredKeys: readonly string[];
  readonly optionalKeys: readonly string[];
};

export type PromptOutputShape = {
  readonly schema: StructuredOutputContract;
};

export type PromptContract = {
  readonly id: PromptId;
  readonly name: string;
  readonly version: PromptVersion;
  readonly purpose: string;
  readonly inputShape: PromptInputShape;
  readonly outputShape: PromptOutputShape;
  readonly safetyClassification: PromptSafetyClassification;
};
