import { describe, expect, expectTypeOf, it } from "vitest";

import {
  createEventContext,
  type EventContext
} from "../index.js";

describe("event context", () => {
  it("requires correlation ID", () => {
    const context = createEventContext({
      correlationId: "correlation-1"
    });

    expect(context).toEqual({
      correlationId: "correlation-1"
    });
    expectTypeOf<EventContext>().toHaveProperty("correlationId");
  });

  it("preserves optional causation and request IDs", () => {
    expect(
      createEventContext({
        correlationId: "correlation-1",
        causationId: "event-0",
        requestId: "request-1"
      })
    ).toEqual({
      correlationId: "correlation-1",
      causationId: "event-0",
      requestId: "request-1"
    });
  });

  it("keeps optional fields optional at the type level", () => {
    expectTypeOf<EventContext>().toMatchTypeOf<{
      readonly correlationId: string;
      readonly causationId?: string;
      readonly requestId?: string;
    }>();
  });
});
