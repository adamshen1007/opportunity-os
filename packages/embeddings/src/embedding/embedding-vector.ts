import type { EmbeddingDimensionCount } from "./embedding-dimensions.js";

export type EmbeddingVectorValue = number;

export type EmbeddingVector = readonly EmbeddingVectorValue[];

export type EmbeddingVectorContract = {
  readonly values: EmbeddingVector;
  readonly dimensions: EmbeddingDimensionCount;
  readonly normalized: boolean;
};
