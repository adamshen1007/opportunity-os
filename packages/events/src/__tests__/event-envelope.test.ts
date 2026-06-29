import { describe, expect, expectTypeOf, it } from "vitest";

import {
  EVENT_CATEGORIES,
  createEventEnvelope,
  createEventMetadata,
  createEventVersion,
  type EventEnvelope
} from "../index.js";

const metadata = createEventMetadata({
  eventId: "event-1",
  eventName: "infrastructure.event.recorded",
  category: EVENT_CATEGORIES.infrastructure,
  version: createEventVersion(1),
  timestamp: "2026-06-29T00:00:00.000Z",
  source: "events-test",
  correlationId: "correlation-1"
});

describe("event envelope", () => {
  it("contains metadata and a generic payload", () => {
    const envelope = createEventEnvelope({
      metadata,
      payload: {
        anyInfrastructureValue: "value",
        count: 1
      }
    });

    expect(envelope).toEqual({
      metadata,
      payload: {
        anyInfrastructureValue: "value",
        count: 1
      }
    });
  });

  it("keeps payload typing generic and business-agnostic", () => {
    type Payload = {
      readonly arbitrary: string;
      readonly nested: {
        readonly enabled: boolean;
      };
    };

    expectTypeOf<EventEnvelope<Payload>["payload"]>().toEqualTypeOf<Payload>();
    expectTypeOf<EventEnvelope>().toHaveProperty("metadata");
    expectTypeOf<EventEnvelope>().toHaveProperty("payload");
  });

  it("does not mutate metadata input", () => {
    const envelope = createEventEnvelope({
      metadata,
      payload: {}
    });

    expect(envelope.metadata).toEqual(metadata);
    expect(envelope.metadata).not.toBe(metadata);
  });
});
