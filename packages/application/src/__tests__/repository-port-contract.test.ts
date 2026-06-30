import { describe, expectTypeOf, it } from "vitest";
import type {
  AggregateRoot,
  DomainId,
  DomainResult,
  Entity
} from "@opportunity-os/domain";
import type {
  ApplicationRepositoryPort,
  DomainRepositoryPort
} from "../index.js";

type TestId = DomainId<"Test">;

type TestEntity = Entity<TestId>;

type TestAggregate = AggregateRoot<TestEntity, never> & {
  readonly name: string;
};

describe("application repository port contracts", () => {
  it("uses domain repository contracts without persistence implementation", () => {
    type Repository = ApplicationRepositoryPort<TestAggregate, TestId>;
    type DomainPort = DomainRepositoryPort<TestAggregate, TestId>;

    expectTypeOf<Repository>().toMatchTypeOf<DomainPort>();
    expectTypeOf<ReturnType<Repository["findById"]>>().toEqualTypeOf<
      Promise<DomainResult<TestAggregate | null>>
    >();
    expectTypeOf<ReturnType<Repository["save"]>>().toEqualTypeOf<
      Promise<DomainResult<TestAggregate>>
    >();
  });
});
