import type {
  EventEnvelope,
  EventPublishResult,
  EventPublisher
} from "@opportunity-os/events";

export type ApplicationEventPublisher<TPayload = unknown> = {
  readonly publish: (
    envelope: EventEnvelope<TPayload>
  ) => EventPublishResult | Promise<EventPublishResult>;
};

export type ApplicationEventPublisherPort<TPayload = unknown> =
  EventPublisher<TPayload>;
