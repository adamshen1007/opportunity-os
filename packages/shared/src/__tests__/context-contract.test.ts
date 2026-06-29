import { describe, expect, expectTypeOf, it } from "vitest";

import {
  createCorrelationContext,
  createRequestContext,
  withCorrelationContext,
  withRequestContext,
  type CorrelationContext,
  type CorrelationId,
  type RequestContext,
  type RequestId
} from "../index.js";

describe("context contracts", () => {
  it("creates deterministic correlation contexts from explicit input", () => {
    const context = createCorrelationContext("correlation-1");

    expect(context).toEqual({ correlationId: "correlation-1" });
  });

  it("creates request contexts with optional request identifiers", () => {
    const withoutRequestId = createRequestContext({
      correlationId: "correlation-1"
    });
    const withRequestId = createRequestContext({
      correlationId: "correlation-1",
      requestId: "request-1"
    });

    expect(withoutRequestId).toEqual({ correlationId: "correlation-1" });
    expect(withoutRequestId).not.toHaveProperty("requestId");
    expect(withRequestId).toEqual({
      correlationId: "correlation-1",
      requestId: "request-1"
    });
  });

  it("adds correlation context without mutating the input", () => {
    const value = { eventName: "shared.context.checked" };
    const context = createCorrelationContext("correlation-1");

    const result = withCorrelationContext(value, context);

    expect(result).toEqual({
      eventName: "shared.context.checked",
      correlationId: "correlation-1"
    });
    expect(result).not.toBe(value);
    expect(value).toEqual({ eventName: "shared.context.checked" });
  });

  it("adds request context without mutating the input", () => {
    const value = { eventName: "shared.context.checked" };
    const context = createRequestContext({
      correlationId: "correlation-1",
      requestId: "request-1"
    });

    const result = withRequestContext(value, context);

    expect(result).toEqual({
      eventName: "shared.context.checked",
      correlationId: "correlation-1",
      requestId: "request-1"
    });
    expect(result).not.toBe(value);
    expect(value).toEqual({ eventName: "shared.context.checked" });
  });

  it("keeps context contracts transport agnostic", () => {
    expectTypeOf<CorrelationId>().toEqualTypeOf<string>();
    expectTypeOf<RequestId>().toEqualTypeOf<string>();
    expectTypeOf<CorrelationContext>().toEqualTypeOf<{
      readonly correlationId: string;
    }>();
    expectTypeOf<RequestContext>().toMatchTypeOf<{
      readonly correlationId: string;
      readonly requestId?: string;
    }>();
  });
});
