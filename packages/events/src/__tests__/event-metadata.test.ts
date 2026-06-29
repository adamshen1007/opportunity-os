import { describe, expect, expectTypeOf, it } from "vitest";

import {
  EVENT_CATEGORIES,
  createEventMetadata,
  createEventVersion,
  type EventMetadata
} from "../index.js";

describe("event metadata", () => {
  it("preserves required and optional event metadata fields", () => {
    const metadata = createEventMetadata({
      eventId: "event-1",
      eventName: "infrastructure.event.recorded",
      category: EVENT_CATEGORIES.infrastructure,
      version: createEventVersion(1),
      timestamp: "2026-06-29T00:00:00.000Z",
      source: "events-test",
      correlationId: "correlation-1",
      causationId: "event-0",
      requestId: "request-1",
      idempotencyKey: "idempotency-1"
    });

    expect(metadata).toEqual({
      eventId: "event-1",
      eventName: "infrastructure.event.recorded",
      category: "infrastructure",
      version: "v1",
      timestamp: "2026-06-29T00:00:00.000Z",
      source: "events-test",
      correlationId: "correlation-1",
      causationId: "event-0",
      requestId: "request-1",
      idempotencyKey: "idempotency-1"
    } satisfies EventMetadata);
  });

  it("allows optional causation, request, and idempotency metadata to be omitted", () => {
    const metadata = createEventMetadata({
      eventId: "event-1",
      eventName: "infrastructure.event.recorded",
      category: EVENT_CATEGORIES.infrastructure,
      version: createEventVersion(1),
      timestamp: "2026-06-29T00:00:00.000Z",
      source: "events-test",
      correlationId: "correlation-1"
    });

    expect(metadata).toEqual({
      eventId: "event-1",
      eventName: "infrastructure.event.recorded",
      category: "infrastructure",
      version: "v1",
      timestamp: "2026-06-29T00:00:00.000Z",
      source: "events-test",
      correlationId: "correlation-1"
    });
  });

  it("keeps metadata payload-free", () => {
    expectTypeOf<EventMetadata>().not.toHaveProperty("payload");
    expectTypeOf<EventMetadata>().toHaveProperty("eventId");
    expectTypeOf<EventMetadata>().toHaveProperty("eventName");
    expectTypeOf<EventMetadata>().toHaveProperty("category");
    expectTypeOf<EventMetadata>().toHaveProperty("version");
    expectTypeOf<EventMetadata>().toHaveProperty("timestamp");
    expectTypeOf<EventMetadata>().toHaveProperty("source");
    expectTypeOf<EventMetadata>().toHaveProperty("correlationId");
    expectTypeOf<EventMetadata>().toHaveProperty("causationId");
    expectTypeOf<EventMetadata>().toHaveProperty("requestId");
    expectTypeOf<EventMetadata>().toHaveProperty("idempotencyKey");
  });
});
