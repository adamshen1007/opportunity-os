import type { EventConsumer } from "../event-consumer.js";
import type { EventEnvelope } from "../event-envelope.js";
import type { EventPublisher, EventPublishResult } from "../event-publisher.js";

export type InMemoryEventBus<TPayload = unknown> = EventPublisher<TPayload> & {
  readonly subscribe: (consumer: EventConsumer<TPayload>) => void;
  readonly readPublished: () => readonly EventEnvelope<TPayload>[];
  readonly clear: () => void;
};

export function createInMemoryEventBus<TPayload = unknown>(): InMemoryEventBus<TPayload> {
  const consumers: EventConsumer<TPayload>[] = [];
  const published: EventEnvelope<TPayload>[] = [];

  return {
    subscribe: (consumer: EventConsumer<TPayload>) => {
      consumers.push(consumer);
    },
    publish: async (
      envelope: EventEnvelope<TPayload>
    ): Promise<EventPublishResult> => {
      published.push(copyEnvelope(envelope));

      for (const consumer of consumers) {
        await consumer.handle(copyEnvelope(envelope));
      }

      return {
        accepted: true
      };
    },
    readPublished: () => published.map((envelope) => copyEnvelope(envelope)),
    clear: () => {
      published.length = 0;
    }
  };
}

function copyEnvelope<TPayload>(
  envelope: EventEnvelope<TPayload>
): EventEnvelope<TPayload> {
  return {
    metadata: { ...envelope.metadata },
    payload: envelope.payload
  };
}
