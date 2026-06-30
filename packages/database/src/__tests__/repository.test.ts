import { describe, expectTypeOf, it } from "vitest";
import type { RepositoryContract, RepositoryOperationContext } from "../repository.js";

type TestEntity = Readonly<{
  id: string;
  value: string;
}>;

describe("repository contracts", () => {
  it("defines generic repository methods without domain-specific operations", () => {
    expectTypeOf<RepositoryContract<TestEntity, string>>().toHaveProperty("findById");
    expectTypeOf<RepositoryContract<TestEntity, string>>().toHaveProperty("save");
    expectTypeOf<RepositoryContract<TestEntity, string>>().toHaveProperty("deleteById");
    expectTypeOf<RepositoryContract<TestEntity, string>>().not.toHaveProperty("findRawContent");
    expectTypeOf<RepositoryContract<TestEntity, string>>().not.toHaveProperty("persistConnectorResult");
  });

  it("supports optional transaction context generically", () => {
    type Transaction = Readonly<{ id: string }>;

    expectTypeOf<RepositoryOperationContext<Transaction>>().toMatchTypeOf<{
      readonly transaction?: Transaction;
    }>();
  });
});
