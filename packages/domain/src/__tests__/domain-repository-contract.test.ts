import { expectTypeOf, test } from "vitest";
import type { AggregateRoot } from "../aggregate/index.js";
import type { Entity } from "../entity/index.js";
import type { DomainMetadata } from "../metadata/index.js";
import type { DomainId } from "../primitives/index.js";
import type {
  DomainRepositoryContext,
  DomainRepositoryContract
} from "../repository/index.js";
import type { DomainResult } from "../result/index.js";

type ExampleId = DomainId<"Example">;
type ExampleMetadata = DomainMetadata;
type ExampleEntity = Entity<ExampleId, ExampleMetadata>;
type ExampleAggregate = AggregateRoot<ExampleEntity>;

test("repository contracts return domain records", () => {
  type EntityRepository = DomainRepositoryContract<ExampleEntity, ExampleId>;
  type AggregateRepository = DomainRepositoryContract<
    ExampleAggregate,
    ExampleId
  >;

  expectTypeOf<EntityRepository["findById"]>().returns.resolves.toEqualTypeOf<
    DomainResult<ExampleEntity | null>
  >();
  expectTypeOf<EntityRepository["save"]>().returns.resolves.toEqualTypeOf<
    DomainResult<ExampleEntity>
  >();
  expectTypeOf<AggregateRepository["save"]>().returns.resolves.toEqualTypeOf<
    DomainResult<ExampleAggregate>
  >();
});

test("repository context remains generic", () => {
  expectTypeOf<DomainRepositoryContext>().toHaveProperty("correlationId");
  expectTypeOf<DomainRepositoryContext>().toHaveProperty("requestId");
});
