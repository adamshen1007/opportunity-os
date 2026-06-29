import type { EventMetadata } from "./event-metadata.js";

export type EventPayload = Record<string, unknown>;

export type EventEnvelope<TPayload = EventPayload> = {
  readonly metadata: EventMetadata;
  readonly payload: TPayload;
};

export type EventEnvelopeInput<TPayload = EventPayload> =
  EventEnvelope<TPayload>;

export function createEventEnvelope<TPayload>(
  input: EventEnvelopeInput<TPayload>
): EventEnvelope<TPayload> {
  return {
    metadata: { ...input.metadata },
    payload: input.payload
  };
}
