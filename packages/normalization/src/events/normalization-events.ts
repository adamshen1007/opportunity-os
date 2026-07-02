import type { EventEnvelope, EventMetadata } from "@opportunity-os/events";
import type { RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type { NormalizationInput, NormalizationOutput } from "../pipeline/index.js";
import type { NormalizationResult } from "../results/index.js";
import type { NormalizationValidationIssue } from "../validation/index.js";

export const NORMALIZATION_EVENT_NAMES = [
  "normalization.requested",
  "normalization.completed",
  "normalization.rejected"
] as const;

export type NormalizationEventName =
  (typeof NORMALIZATION_EVENT_NAMES)[number];

export type NormalizationRequestedPayload = {
  readonly input: NormalizationInput;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type NormalizationCompletedPayload = {
  readonly output: NormalizationOutput;
  readonly result: NormalizationResult;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type NormalizationRejectedPayload = {
  readonly issues: readonly NormalizationValidationIssue[];
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type NormalizationEventPayload =
  | NormalizationRequestedPayload
  | NormalizationCompletedPayload
  | NormalizationRejectedPayload;

export type NormalizationEventEnvelope<
  TPayload extends NormalizationEventPayload = NormalizationEventPayload
> = EventEnvelope<TPayload> & {
  readonly metadata: EventMetadata & {
    readonly eventName: NormalizationEventName;
  };
};
