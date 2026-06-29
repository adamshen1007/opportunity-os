import { describe, expect, expectTypeOf, it } from "vitest";

import {
  EVENT_CATEGORIES,
  createEventEnvelope,
  createEventMetadata,
  createEventVersion,
  type EventPublisher
} from "../index.js";

describe("event publisher contract", () => {
  it("allows transport-agnostic event publishing", async () => {
    const published: unknown[] = [];
    const publisher: EventPublisher<{ readonly value: string }> = {
      publish: (envelope) => {
        published.push(envelope);
        return { accepted: true };
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

    await expect(Promise.resolve(publisher.publish(envelope))).resolves.toEqual({
      accepted: true
    });
    expect(published).toEqual([envelope]);
  });

  it("does not require transport-specific fields", () => {
    expectTypeOf<EventPublisher>().toHaveProperty("publish");
  });
});
