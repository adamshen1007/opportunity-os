import type { EventEnvelope } from "./event-envelope.js";

export type EventConsumeResult = {
  readonly handled: boolean;
};

export type EventConsumer<TPayload = unknown> = {
  readonly handle: (
    envelope: EventEnvelope<TPayload>
  ) => EventConsumeResult | Promise<EventConsumeResult>;
};
