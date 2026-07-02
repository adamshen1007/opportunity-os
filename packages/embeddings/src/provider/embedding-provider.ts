import type {
  EmbeddingDimensionContract,
  EmbeddingModelId,
  EmbeddingProviderId
} from "../embedding/index.js";

export const EMBEDDING_PROVIDER_STABILITY_STATUSES = [
  "experimental",
  "stable",
  "deprecated"
] as const;

export const EMBEDDING_PROVIDER_CAPABILITIES = [
  "single-input",
  "batch-input",
  "chunk-input",
  "usage-metadata",
  "dimension-selection"
] as const;

export type EmbeddingProviderStabilityStatus = typeof EMBEDDING_PROVIDER_STABILITY_STATUSES[number];

export type EmbeddingProviderCapability = typeof EMBEDDING_PROVIDER_CAPABILITIES[number];

export type EmbeddingProviderModel = {
  readonly modelId: EmbeddingModelId;
  readonly dimensions: EmbeddingDimensionContract;
  readonly maximumInputTokens?: number;
  readonly maximumBatchSize?: number;
};

export type EmbeddingProviderMetadata = {
  readonly providerId: EmbeddingProviderId;
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly stability: EmbeddingProviderStabilityStatus;
  readonly capabilities: readonly EmbeddingProviderCapability[];
  readonly models: readonly EmbeddingProviderModel[];
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};

export type EmbeddingProviderContract = {
  readonly metadata: EmbeddingProviderMetadata;
};
