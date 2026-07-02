import type { EmbeddingContract } from "../embedding/index.js";
import type { EmbeddingInputId } from "../request/index.js";

export const EMBEDDING_RESPONSE_STATUSES = [
  "success",
  "partial-success",
  "failure"
] as const;

export type EmbeddingResponseStatus = typeof EMBEDDING_RESPONSE_STATUSES[number];

export type EmbeddingUsageMetadata = {
  readonly inputCount: number;
  readonly outputCount: number;
  readonly inputTokens?: number;
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};

export type EmbeddingResponseWarning = {
  readonly code: string;
  readonly message: string;
  readonly inputId?: EmbeddingInputId;
};

export type EmbeddingResponseFailure = {
  readonly code: string;
  readonly message: string;
  readonly inputId?: EmbeddingInputId;
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};

export type EmbeddingResponse = {
  readonly status: EmbeddingResponseStatus;
  readonly embeddings: readonly EmbeddingContract[];
  readonly usage: EmbeddingUsageMetadata;
  readonly warnings?: readonly EmbeddingResponseWarning[];
  readonly failures?: readonly EmbeddingResponseFailure[];
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};
