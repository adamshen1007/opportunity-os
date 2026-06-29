import type { EventCategory } from "./event-category.js";
import type { EventVersion } from "./event-version.js";

export type EventId = string;
export type EventName = string;
export type EventSource = string;
export type CorrelationId = string;
export type CausationId = string;
export type IdempotencyKey = string;

export type EventMetadata = {
  readonly eventId: EventId;
  readonly eventName: EventName;
  readonly category: EventCategory;
  readonly version: EventVersion;
  readonly timestamp: string;
  readonly source: EventSource;
  readonly correlationId: CorrelationId;
  readonly causationId?: CausationId;
  readonly requestId?: string;
  readonly idempotencyKey?: IdempotencyKey;
};

export type EventMetadataInput = EventMetadata;

export function createEventMetadata(
  input: EventMetadataInput
): EventMetadata {
  return {
    eventId: input.eventId,
    eventName: input.eventName,
    category: input.category,
    version: input.version,
    timestamp: input.timestamp,
    source: input.source,
    correlationId: input.correlationId,
    ...(input.causationId === undefined
      ? {}
      : { causationId: input.causationId }),
    ...(input.requestId === undefined ? {} : { requestId: input.requestId }),
    ...(input.idempotencyKey === undefined
      ? {}
      : { idempotencyKey: input.idempotencyKey })
  };
}
