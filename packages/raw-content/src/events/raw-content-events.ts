import type { EventEnvelope, EventMetadata } from "@opportunity-os/events";
import type { RawContentEnvelope } from "../content/index.js";
import type { RawContentDeduplicationDecision } from "../deduplication/index.js";
import type { RawContentSafeMetadata } from "../source/index.js";
import type { RawContentValidationIssue } from "../validation/index.js";

export const RAW_CONTENT_EVENT_NAMES = [
  "raw-content.received",
  "raw-content.validated",
  "raw-content.rejected",
  "raw-content.deduplication-decided"
] as const;

export type RawContentEventName = (typeof RAW_CONTENT_EVENT_NAMES)[number];

export type RawContentReceivedPayload = {
  readonly envelope: RawContentEnvelope;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type RawContentValidatedPayload = {
  readonly envelope: RawContentEnvelope;
  readonly issues: readonly [];
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type RawContentRejectedPayload = {
  readonly envelope?: RawContentEnvelope;
  readonly issues: readonly RawContentValidationIssue[];
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type RawContentDeduplicationDecidedPayload = {
  readonly envelope: RawContentEnvelope;
  readonly decision: RawContentDeduplicationDecision;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type RawContentEventPayload =
  | RawContentReceivedPayload
  | RawContentValidatedPayload
  | RawContentRejectedPayload
  | RawContentDeduplicationDecidedPayload;

export type RawContentEventEnvelope<TPayload extends RawContentEventPayload = RawContentEventPayload> =
  EventEnvelope<TPayload> & {
    readonly metadata: EventMetadata & {
      readonly eventName: RawContentEventName;
    };
  };
