import type {
  EventEnvelope,
  EventMetadata,
  EventName,
  EventPayload,
  EventVersion
} from "@opportunity-os/events";

export type DomainEventName = EventName;
export type DomainEventVersion = EventVersion;
export type DomainEventMetadata = EventMetadata;
export type DomainEventPayload = EventPayload;

export type DomainEventReference<
  TPayload extends DomainEventPayload = DomainEventPayload
> = EventEnvelope<TPayload>;
