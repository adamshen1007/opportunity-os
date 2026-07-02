export const LLM_PROVIDER_CAPABILITIES = {
  textAnalysis: "text-analysis",
  structuredOutput: "structured-output",
  safetyClassification: "safety-classification"
} as const;

export const LLM_PROVIDER_STABILITY_STATUSES = {
  experimental: "experimental",
  stable: "stable",
  deprecated: "deprecated"
} as const;

export type LlmProviderCapability =
  (typeof LLM_PROVIDER_CAPABILITIES)[keyof typeof LLM_PROVIDER_CAPABILITIES];

export type LlmProviderStabilityStatus =
  (typeof LLM_PROVIDER_STABILITY_STATUSES)[keyof typeof LLM_PROVIDER_STABILITY_STATUSES];

export type LlmProviderId = string & { readonly __brand: "LlmProviderId" };

export type LlmModelId = string & { readonly __brand: "LlmModelId" };

export type LlmProviderModel = {
  readonly id: LlmModelId;
  readonly name: string;
  readonly contextWindowTokens?: number;
  readonly supportedCapabilities: readonly LlmProviderCapability[];
};

export type LlmProviderMetadata = {
  readonly id: LlmProviderId;
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly stability: LlmProviderStabilityStatus;
  readonly capabilities: readonly LlmProviderCapability[];
  readonly models: readonly LlmProviderModel[];
};
