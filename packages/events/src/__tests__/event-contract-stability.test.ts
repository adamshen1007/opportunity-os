import { describe, expect, it } from "vitest";

import {
  EVENT_CATEGORIES,
  EVENT_VERSION_PATTERN,
  IDEMPOTENCY_STATUSES,
  createEventEnvelope,
  createEventMetadata,
  createEventVersion,
  type ReplayCheckpoint,
  type ReplayEligibility,
  type ReplayMetadata
} from "../index.js";

describe("event contract stability", () => {
  it("locks event envelope keys", () => {
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
      payload: {}
    });

    expect(Object.keys(envelope).toSorted()).toEqual(["metadata", "payload"]);
  });

  it("locks event metadata keys", () => {
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

    expect(Object.keys(metadata).toSorted()).toEqual([
      "category",
      "causationId",
      "correlationId",
      "eventId",
      "eventName",
      "idempotencyKey",
      "requestId",
      "source",
      "timestamp",
      "version"
    ]);
  });

  it("locks category values and version format", () => {
    expect(EVENT_CATEGORIES).toEqual({
      infrastructure: "infrastructure",
      integration: "integration",
      lifecycle: "lifecycle",
      observability: "observability",
      security: "security"
    });
    expect(EVENT_VERSION_PATTERN.source).toBe("^v[1-9]\\d*$");
  });

  it("locks idempotency and replay contract keys", () => {
    expect(IDEMPOTENCY_STATUSES).toEqual({
      new: "new",
      processed: "processed",
      duplicate: "duplicate",
      conflict: "conflict"
    });

    const replayMetadata = {
      replayId: "replay-1",
      startedAt: "2026-06-29T00:00:00.000Z",
      reason: "verification",
      requestedBy: "test"
    } satisfies ReplayMetadata;
    const checkpoint = {
      checkpointId: "checkpoint-1",
      eventId: "event-1",
      eventVersion: "v1",
      position: "1",
      recordedAt: "2026-06-29T00:00:00.000Z"
    } satisfies ReplayCheckpoint;
    const eligibility = {
      eligible: true,
      reason: "eligible"
    } satisfies ReplayEligibility;

    expect(Object.keys(replayMetadata).toSorted()).toEqual([
      "reason",
      "replayId",
      "requestedBy",
      "startedAt"
    ]);
    expect(Object.keys(checkpoint).toSorted()).toEqual([
      "checkpointId",
      "eventId",
      "eventVersion",
      "position",
      "recordedAt"
    ]);
    expect(Object.keys(eligibility).toSorted()).toEqual([
      "eligible",
      "reason"
    ]);
  });
});
