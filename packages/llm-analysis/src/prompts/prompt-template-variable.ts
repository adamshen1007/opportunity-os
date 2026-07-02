import type { PromptSafetyClassification } from "./prompt-contract.js";

export const PROMPT_TEMPLATE_VARIABLE_KINDS = {
  text: "text",
  number: "number",
  boolean: "boolean",
  object: "object",
  list: "list"
} as const;

export type PromptTemplateVariableKind =
  (typeof PROMPT_TEMPLATE_VARIABLE_KINDS)[keyof typeof PROMPT_TEMPLATE_VARIABLE_KINDS];

export type PromptTemplateVariable = {
  readonly name: string;
  readonly placeholder: string;
  readonly kind: PromptTemplateVariableKind;
  readonly required: boolean;
  readonly safetyClassification: PromptSafetyClassification;
  readonly description?: string;
};
