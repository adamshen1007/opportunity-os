import { describe, expect, it } from "vitest";

import {
  EVENT_CATEGORIES,
  createEventEnvelope,
  createEventMetadata,
  createEventVersion,
  createInMemoryEventBus
} from "../index.js";

function createTestEnvelope(eventId: string, order: number) {
  return createEventEnvelope({
    metadata: createEventMetadata({
      eventId,
      eventName: "infrastructure.event.recorded",
      category: EVENT_CATEGORIES.infrastructure,
      version: createEventVersion(1),
      timestamp: "2026-06-29T00:00:00.000Z",
      source: "events-test",
      correlationId: "correlation-1"
    }),
    payload: {
      order
    }
  });
}

describe("test-only in-memory event bus", () => {
  it("publishes to registered consumers in deterministic order", async () => {
    const bus = createInMemoryEventBus<{ readonly order: number }>();
    const handled: number[] = [];

    bus.subscribe({
      handle: (envelope) => {
        handled.push(envelope.payload.order);
        return { handled: true };
      }
    });

    await bus.publish(createTestEnvelope("event-1", 1));
    await bus.publish(createTestEnvelope("event-2", 2));

    expect(handled).toEqual([1, 2]);
    expect(bus.readPublished().map((envelope) => envelope.metadata.eventId)).toEqual([
      "event-1",
      "event-2"
    ]);
  });

  it("supports multiple consumers without implementing transport", async () => {
    const bus = createInMemoryEventBus<{ readonly order: number }>();
    const firstConsumer: number[] = [];
    const secondConsumer: number[] = [];

    bus.subscribe({
      handle: (envelope) => {
        firstConsumer.push(envelope.payload.order);
        return { handled: true };
      }
    });
    bus.subscribe({
      handle: async (envelope) => {
        secondConsumer.push(envelope.payload.order);
        return { handled: true };
      }
    });

    await expect(bus.publish(createTestEnvelope("event-1", 1))).resolves.toEqual({
      accepted: true
    });

    expect(firstConsumer).toEqual([1]);
    expect(secondConsumer).toEqual([1]);
  });

  it("does not persist events beyond the test-owned bus instance", async () => {
    const bus = createInMemoryEventBus<{ readonly order: number }>();

    await bus.publish(createTestEnvelope("event-1", 1));
    expect(bus.readPublished()).toHaveLength(1);

    bus.clear();
    expect(bus.readPublished()).toEqual([]);
  });

  it("does not mutate published envelope metadata", async () => {
    const bus = createInMemoryEventBus<{ readonly order: number }>();
    const envelope = createTestEnvelope("event-1", 1);

    await bus.publish(envelope);
    const [published] = bus.readPublished();

    expect(published).toEqual(envelope);
    expect(published?.metadata).not.toBe(envelope.metadata);
  });
});
