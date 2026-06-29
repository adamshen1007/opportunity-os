import { describe, expect, expectTypeOf, it } from "vitest";

import {
  EVENT_CATEGORIES,
  createEventEnvelope,
  createEventMetadata,
  createEventVersion,
  type EventConsumer
} from "../index.js";

describe("event consumer contract", () => {
  it("allows transport-agnostic event handling", async () => {
    const handled: unknown[] = [];
    const consumer: EventConsumer<{ readonly value: string }> = {
      handle: (envelope) => {
        handled.push(envelope.payload);
        return { handled: true };
      }
    };
    const envelope = createEventEnvelope({
      metadata: createEventMetadata({
        eventId: "event-1",
        eventName: "infrastructure.event.recorded",
        category: EVENT_CATEGORIES.infrastructure,
        version: createEventVersion(1),
        timestamp: "2026-06-29T00:00:00.000Z",
        source: "events-test",
        correlationId: "correlation-1"
      }),
      payload: {
        value: "ok"
      }
    });

    await expect(Promise.resolve(consumer.handle(envelope))).resolves.toEqual({
      handled: true
    });
    expect(handled).toEqual([{ value: "ok" }]);
  });

  it("does not require queue, stream, database, connector, workflow, or API fields", () => {
    expectTypeOf<EventConsumer>().toHaveProperty("handle");
  });
});
