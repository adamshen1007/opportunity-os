import { expectTypeOf, test } from "vitest";
import type { AggregateRoot } from "../aggregate/index.js";
import type { Entity } from "../entity/index.js";
import type { DomainEventReference } from "../events/index.js";
import type { DomainMetadata } from "../metadata/index.js";
import type {
  DomainId,
  DomainTimestamp,
  DomainVersion
} from "../primitives/index.js";
import type { ValueObject } from "../value-object/index.js";

type ExampleId = DomainId<"Example">;
type ExampleTimestamp = DomainTimestamp;
type ExampleVersion = DomainVersion;

type ExampleMetadata = {
  readonly createdAt: ExampleTimestamp;
  readonly updatedAt: ExampleTimestamp;
  readonly version: ExampleVersion;
};

test("metadata contracts describe created, updated, and version fields", () => {
  expectTypeOf<ExampleMetadata>().toExtend<DomainMetadata>();
  expectTypeOf<DomainMetadata>().toHaveProperty("createdAt");
  expectTypeOf<DomainMetadata>().toHaveProperty("updatedAt");
  expectTypeOf<DomainMetadata>().toHaveProperty("version");
});

test("value object contracts expose immutable properties", () => {
  type ExampleValue = ValueObject<{
    readonly label: string;
    readonly weight: number;
  }>;

  expectTypeOf<ExampleValue["properties"]>().toEqualTypeOf<{
    readonly label: string;
    readonly weight: number;
  }>();
  expectTypeOf<ExampleValue["properties"]>().toHaveProperty("label");
  expectTypeOf<ExampleValue["properties"]>().toHaveProperty("weight");
});

test("entity contracts include identity and metadata", () => {
  type ExampleEntity = Entity<ExampleId, ExampleMetadata>;

  expectTypeOf<ExampleEntity>().toHaveProperty("id");
  expectTypeOf<ExampleEntity>().toHaveProperty("metadata");
  expectTypeOf<ExampleEntity["id"]>().toEqualTypeOf<ExampleId>();
  expectTypeOf<ExampleEntity["metadata"]>().toExtend<DomainMetadata>();
});

test("aggregate root contracts include version and pending event references", () => {
  type ExamplePayload = { readonly changed: true };
  type ExampleEvent = DomainEventReference<ExamplePayload>;
  type ExampleEntity = Entity<ExampleId, ExampleMetadata>;
  type ExampleAggregate = AggregateRoot<ExampleEntity, ExampleEvent>;

  expectTypeOf<ExampleAggregate>().toHaveProperty("id");
  expectTypeOf<ExampleAggregate>().toHaveProperty("metadata");
  expectTypeOf<ExampleAggregate>().toHaveProperty("version");
  expectTypeOf<ExampleAggregate>().toHaveProperty("pendingEvents");
  expectTypeOf<ExampleAggregate["pendingEvents"]>().toEqualTypeOf<
    readonly ExampleEvent[]
  >();
});
