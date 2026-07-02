export type EmbeddingCacheKey = {
  readonly sourceId: string;
  readonly providerId: string;
  readonly modelId: string;
  readonly dimensions: number;
  readonly contentFingerprint: string;
};

export type EmbeddingCacheKeyMetadata = {
  readonly key: EmbeddingCacheKey;
  readonly version: "1.0.0";
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};
