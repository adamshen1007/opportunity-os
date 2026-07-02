import type { EmbeddingCacheLookupStatus } from "../cache/index.js";
import type { ChunkEmbeddingContract } from "../chunk/index.js";
import type { EmbeddingValidationIssue } from "../validation/index.js";
import type { EmbeddingErrorSafeDetails } from "../errors/index.js";

export const EMBEDDING_RESULT_STATUSES = [
  "success",
  "partial-success",
  "validation-failure",
  "provider-failure",
  "cache-hit",
  "cache-miss",
  "skipped"
] as const;

export type EmbeddingResultStatus = typeof EMBEDDING_RESULT_STATUSES[number];

export type EmbeddingResultSuccess = {
  readonly ok: true;
  readonly status: "success" | "partial-success" | "cache-hit" | "cache-miss";
  readonly embeddings: readonly ChunkEmbeddingContract[];
  readonly cacheStatus?: EmbeddingCacheLookupStatus;
  readonly issues?: readonly EmbeddingValidationIssue[];
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};

export type EmbeddingResultFailure = {
  readonly ok: false;
  readonly status: "validation-failure" | "provider-failure" | "skipped";
  readonly issues: readonly EmbeddingValidationIssue[];
  readonly error?: EmbeddingErrorSafeDetails;
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};

export type EmbeddingResult =
  | EmbeddingResultSuccess
  | EmbeddingResultFailure;

export type BatchEmbeddingResult = {
  readonly batchId: string;
  readonly status: EmbeddingResultStatus;
  readonly results: readonly EmbeddingResult[];
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};
