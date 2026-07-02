export type EmbeddingDimensionCount = number;

export type EmbeddingDimensionRange = {
  readonly minimum: EmbeddingDimensionCount;
  readonly maximum: EmbeddingDimensionCount;
};

export type EmbeddingDimensionContract = {
  readonly dimensions: EmbeddingDimensionCount;
  readonly expectedRange?: EmbeddingDimensionRange;
};
