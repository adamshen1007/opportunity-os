import { describe, expect, expectTypeOf, it } from "vitest";
import type {
  ApplicationQuery,
  ApplicationQueryHandler,
  ApplicationQueryInput
} from "../index.js";

type TestQuery = ApplicationQuery<
  "test.query",
  { readonly id: string }
>;

describe("application query contracts", () => {
  it("define generic query shape", () => {
    const input: ApplicationQueryInput<{ readonly id: string }> = {
      parameters: { id: "entity-id" },
      metadata: { correlationId: "correlation-id" }
    };

    const query: TestQuery = {
      name: "test.query",
      ...input
    };

    expect(query).toEqual({
      name: "test.query",
      parameters: { id: "entity-id" },
      metadata: { correlationId: "correlation-id" }
    });
  });

  it("defines query handler contracts without data access implementation", async () => {
    const handler: ApplicationQueryHandler<TestQuery, { readonly found: true }> = {
      queryName: "test.query",
      execute: async () => ({ found: true })
    };

    await expect(
      handler.execute({
        name: "test.query",
        parameters: { id: "entity-id" },
        metadata: { correlationId: "correlation-id" }
      })
    ).resolves.toEqual({ found: true });

    expectTypeOf(handler.queryName).toEqualTypeOf<"test.query">();
  });
});
