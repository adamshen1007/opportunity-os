import type { TextChunk } from "@opportunity-os/normalization";
import type { EmbeddingRequestContext } from "../request/index.js";

export type ChunkEmbeddingRequest = {
  readonly requestId: string;
  readonly providerId: string;
  readonly modelId: string;
  readonly chunks: readonly TextChunk[];
  readonly context: EmbeddingRequestContext;
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};
