import type {
  EmbeddingModelId,
  EmbeddingProviderId
} from "../embedding/index.js";
import type { EmbeddingInput } from "./embedding-input.js";

export type EmbeddingRequestContext = {
  readonly correlationId: string;
  readonly requestId?: string;
  readonly service?: string;
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};

export type EmbeddingRequestOptions = {
  readonly dimensions?: number;
  readonly normalizeOutput?: boolean;
  readonly timeoutMilliseconds?: number;
};

export type EmbeddingRequest<TInput extends EmbeddingInput = EmbeddingInput> = {
  readonly requestId: string;
  readonly providerId: EmbeddingProviderId;
  readonly modelId: EmbeddingModelId;
  readonly inputs: readonly TInput[];
  readonly context: EmbeddingRequestContext;
  readonly options?: EmbeddingRequestOptions;
};
