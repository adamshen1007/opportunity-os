import { describe, expect, expectTypeOf, it } from "vitest";
import type {
  TransactionBoundaryPort,
  TransactionScope
} from "../index.js";

describe("application transaction port contracts", () => {
  it("defines transaction boundaries without database implementation", async () => {
    type Ports = { readonly value: string };

    const boundary: TransactionBoundaryPort<Ports> = {
      runInTransaction: async (operation) =>
        operation({
          ports: { value: "example" },
          context: { correlationId: "correlation-id" }
        })
    };

    const result = await boundary.runInTransaction(async (scope) => scope.ports);

    expect(result).toEqual({ value: "example" });
    expectTypeOf<Parameters<typeof boundary.runInTransaction>[0]>().toEqualTypeOf<
      (scope: TransactionScope<Ports>) => Promise<unknown>
    >();
  });
});
