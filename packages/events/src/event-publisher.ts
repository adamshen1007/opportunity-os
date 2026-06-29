import type { EventEnvelope } from "./event-envelope.js";

export type EventPublishResult = {
  readonly accepted: boolean;
};

export type EventPublisher<TPayload = unknown> = {
  readonly publish: (
    envelope: EventEnvelope<TPayload>
  ) => EventPublishResult | Promise<EventPublishResult>;
};
