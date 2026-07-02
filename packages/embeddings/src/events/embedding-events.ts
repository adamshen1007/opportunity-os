import type { EventEnvelope, EventMetadata } from "@opportunity-os/events";
import type { EmbeddingRequest } from "../request/index.js";
import type { EmbeddingResult } from "../results/index.js";
import type { EmbeddingValidationIssue } from "../validation/index.js";

export const EMBEDDING_EVENT_NAMES = [
  "embedding.requested",
  "embedding.validated",
  "embedding.generated",
  "embedding.failed",
  "embedding.cached",
  "embedding.skipped"
] as const;

export type EmbeddingEventName = typeof EMBEDDING_EVENT_NAMES[number];

export type EmbeddingRequestedPayload = {
  readonly request: EmbeddingRequest;
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};

export type EmbeddingValidatedPayload = {
  readonly requestId: string;
  readonly issues: readonly EmbeddingValidationIssue[];
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};

export type EmbeddingGeneratedPayload = {
  readonly result: EmbeddingResult;
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};

export type EmbeddingFailedPayload = {
  readonly issues: readonly EmbeddingValidationIssue[];
  readonly safeMessage: string;
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};

export type EmbeddingCachedPayload = {
  readonly requestId: string;
  readonly cacheStatus: "hit" | "miss" | "stale" | "failure";
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};

export type EmbeddingSkippedPayload = {
  readonly requestId: string;
  readonly reasonCode: string;
  readonly safeMessage: string;
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};

export type EmbeddingEventPayload =
  | EmbeddingRequestedPayload
  | EmbeddingValidatedPayload
  | EmbeddingGeneratedPayload
  | EmbeddingFailedPayload
  | EmbeddingCachedPayload
  | EmbeddingSkippedPayload;

export type EmbeddingEventEnvelope<
  TPayload extends EmbeddingEventPayload = EmbeddingEventPayload
> = EventEnvelope<TPayload> & {
  readonly metadata: EventMetadata & {
    readonly eventName: EmbeddingEventName;
  };
};
