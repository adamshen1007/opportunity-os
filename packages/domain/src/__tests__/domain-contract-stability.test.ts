import { describe, expectTypeOf, test } from "vitest";
import type { EventEnvelope } from "@opportunity-os/events";
import type { AggregateRoot } from "../aggregate/index.js";
import type { Entity } from "../entity/index.js";
import type { DomainEventReference } from "../events/index.js";
import type { DomainError } from "../errors/index.js";
import type { DomainMetadata } from "../metadata/index.js";
import type { DomainId } from "../primitives/index.js";
import type { DomainRepositoryContract } from "../repository/index.js";
import type { ValueObject } from "../value-object/index.js";

type StableId = DomainId<"Stable">;
type StableMetadata = DomainMetadata;
type StableEntity = Entity<StableId, StableMetadata>;
type StableAggregate = AggregateRoot<StableEntity>;
type StablePayload = { readonly stable: true };

describe("domain contract stability", () => {
  test("primitive and metadata contracts expose stable keys", () => {
    expectTypeOf<StableMetadata>().toHaveProperty("createdAt");
    expectTypeOf<StableMetadata>().toHaveProperty("updatedAt");
    expectTypeOf<StableMetadata>().toHaveProperty("version");
  });

  test("value object, entity, and aggregate contracts expose stable keys", () => {
    expectTypeOf<ValueObject<{ readonly value: string }>>().toHaveProperty(
      "properties"
    );
    expectTypeOf<StableEntity>().toHaveProperty("id");
    expectTypeOf<StableEntity>().toHaveProperty("metadata");
    expectTypeOf<StableAggregate>().toHaveProperty("version");
    expectTypeOf<StableAggregate>().toHaveProperty("pendingEvents");
  });

  test("domain event and error contracts remain compatible with foundation packages", () => {
    expectTypeOf<DomainEventReference<StablePayload>>().toEqualTypeOf<
      EventEnvelope<StablePayload>
    >();
    expectTypeOf<DomainError>().toHaveProperty("code");
    expectTypeOf<DomainError>().toHaveProperty("category");
    expectTypeOf<DomainError>().toHaveProperty("toSafeDetails");
  });

  test("repository contracts expose stable generic methods", () => {
    type StableRepository = DomainRepositoryContract<StableAggregate, StableId>;

    expectTypeOf<StableRepository>().toHaveProperty("findById");
    expectTypeOf<StableRepository>().toHaveProperty("save");
  });
});
