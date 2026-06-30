import { describe, expect, expectTypeOf, it } from "vitest";
import type {
  ApplicationService,
  ApplicationServiceOperation
} from "../index.js";

describe("application service contracts", () => {
  it("define generic application service operation shape", () => {
    const operation: ApplicationServiceOperation<{ readonly value: string }> = {
      input: { value: "example" },
      context: { correlationId: "correlation-id" }
    };

    expect(operation).toEqual({
      input: { value: "example" },
      context: { correlationId: "correlation-id" }
    });
  });

  it("defines service interface without concrete product services", async () => {
    const service: ApplicationService<
      { readonly value: string },
      { readonly accepted: true }
    > = {
      serviceName: "generic-test-service",
      execute: async () => ({ accepted: true })
    };

    await expect(
      service.execute({
        input: { value: "example" },
        context: { correlationId: "correlation-id" }
      })
    ).resolves.toEqual({ accepted: true });

    expectTypeOf(service.serviceName).toEqualTypeOf<string>();
  });
});
