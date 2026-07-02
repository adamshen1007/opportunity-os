import type { ChunkEmbeddingReference } from "@opportunity-os/embeddings";
import type { NormalizationOutput } from "@opportunity-os/normalization";
import type { RawContentProvenance, RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type { RequestContext } from "@opportunity-os/shared";
import type { LlmProviderMetadata } from "../provider/index.js";
import type { PromptContract, PromptInput } from "../prompts/index.js";
import type { SafetyClassification } from "../safety/index.js";

export type AnalysisRequestId = string & { readonly __brand: "AnalysisRequestId" };

export type AnalysisRequestSource = {
  readonly normalizedContent?: NormalizationOutput;
  readonly embeddingReferences: readonly ChunkEmbeddingReference[];
  readonly provenance: RawContentProvenance;
  readonly safeMetadata: RawContentSafeMetadata;
};

export type AnalysisRequest = {
  readonly id: AnalysisRequestId;
  readonly prompt: PromptContract;
  readonly input: PromptInput;
  readonly source: AnalysisRequestSource;
  readonly provider: LlmProviderMetadata;
  readonly context: RequestContext;
  readonly safetyClassification: SafetyClassification;
};
