import { describe, expect, it } from "vitest";

import {
  EVENT_CATEGORIES,
  createEventEnvelope,
  createEventMetadata,
  createEventVersion,
  deserializeEventEnvelope,
  serializeEventEnvelope
} from "../index.js";

const envelope = createEventEnvelope({
  metadata: createEventMetadata({
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
  }),
  payload: {
    zed: "last",
    alpha: "first",
    nested: {
      beta: 2,
      alpha: 1
    }
  }
});

describe("event serialization", () => {
  it("serializes event envelopes as deterministic JSON", () => {
    expect(serializeEventEnvelope(envelope)).toBe(
      '{"metadata":{"category":"infrastructure","causationId":"event-0","correlationId":"correlation-1","eventId":"event-1","eventName":"infrastructure.event.recorded","idempotencyKey":"idempotency-1","requestId":"request-1","source":"events-test","timestamp":"2026-06-29T00:00:00.000Z","version":"v1"},"payload":{"alpha":"first","nested":{"alpha":1,"beta":2},"zed":"last"}}'
    );
  });

  it("deserializes event envelopes while preserving metadata and payload", () => {
    const result = deserializeEventEnvelope(serializeEventEnvelope(envelope));

    expect(result).toEqual({
      success: true,
      value: envelope
    });
  });

  it("fails safely for invalid serialized input", () => {
    const result = deserializeEventEnvelope(
      '{"password":"raw-password","token":"raw-token"'
    );

    expect(result).toEqual({
      success: false,
      error: {
        code: "INVALID_SERIALIZED_EVENT",
        message: "Serialized event is not valid JSON"
      }
    });
    expect(JSON.stringify(result)).not.toContain("raw-password");
    expect(JSON.stringify(result)).not.toContain("raw-token");
  });

  it("fails safely when required envelope fields are missing", () => {
    const result = deserializeEventEnvelope(
      JSON.stringify({
        metadata: {
          eventName: "infrastructure.event.recorded",
          token: "raw-token"
        },
        payload: {
          apiKey: "raw-api-key"
        }
      })
    );

    expect(result).toEqual({
      success: false,
      error: {
        code: "INVALID_EVENT_ENVELOPE",
        message: "Serialized event envelope is missing required fields"
      }
    });
    expect(JSON.stringify(result)).not.toContain("raw-token");
    expect(JSON.stringify(result)).not.toContain("raw-api-key");
  });
});
