import { describe, expect, it } from "vitest";
import {
  createApplicationContext,
  createRequestContext,
  type ApplicationContext
} from "../index.js";

describe("application context contracts", () => {
  it("requires correlation ID and supports optional request ID", () => {
    const requestContext = createRequestContext({
      correlationId: "correlation-id",
      requestId: "request-id"
    });

    expect(requestContext).toEqual({
      correlationId: "correlation-id",
      requestId: "request-id"
    });
  });

  it("supports shared logger references without creating a logger", () => {
    const context: ApplicationContext = createApplicationContext({
      correlationId: "correlation-id"
    });

    expect(context).toEqual({
      correlationId: "correlation-id"
    });
  });
});
