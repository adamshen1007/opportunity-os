import { describe, expect, expectTypeOf, it } from "vitest";
import {
  applicationSuccess,
  type ApplicationHandler,
  type HandlerExecutionContext,
  type HandlerExecutionInput
} from "../index.js";

describe("application handler contracts", () => {
  it("defines handler execution context with optional dependencies", () => {
    const context: HandlerExecutionContext<{ readonly clock: "fixed" }> = {
      correlationId: "correlation-id",
      requestId: "request-id",
      dependencies: {
        clock: "fixed"
      }
    };

    expect(context).toEqual({
      correlationId: "correlation-id",
      requestId: "request-id",
      dependencies: {
        clock: "fixed"
      }
    });
  });

  it("defines handler execution contracts without registry or dispatch behavior", async () => {
    type Input = { readonly value: string };
    type Output = { readonly handled: string };
    type ErrorShape = { readonly code: string };
    type Dependencies = { readonly dependencyName: string };

    const handler: ApplicationHandler<Input, Output, ErrorShape, Dependencies> = {
      handlerName: "generic-test-handler",
      execute: async (input) =>
        applicationSuccess({ handled: input.input.value })
    };

    const input: HandlerExecutionInput<Input, Dependencies> = {
      input: { value: "example" },
      context: {
        correlationId: "correlation-id",
        dependencies: {
          dependencyName: "generic"
        }
      }
    };

    await expect(handler.execute(input)).resolves.toEqual({
      success: true,
      value: { handled: "example" }
    });
    expectTypeOf(handler.handlerName).toEqualTypeOf<string>();
  });
});
