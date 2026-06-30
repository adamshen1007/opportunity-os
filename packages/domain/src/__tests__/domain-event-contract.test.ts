import { expectTypeOf, test } from "vitest";
import type { EventEnvelope, EventMetadata } from "@opportunity-os/events";
import type {
  DomainEventCollection,
  DomainEventCollectionSnapshot,
  DomainEventMetadata,
  DomainEventName,
  DomainEventReference,
  DomainEventVersion
} from "../events/index.js";

test("domain event contracts reuse event foundation concepts", () => {
  type ExamplePayload = { readonly changed: true };
  type ExampleEvent = DomainEventReference<ExamplePayload>;

  expectTypeOf<DomainEventName>().toExtend<string>();
  expectTypeOf<DomainEventVersion>().toExtend<`v${number}`>();
  expectTypeOf<DomainEventMetadata>().toEqualTypeOf<EventMetadata>();
  expectTypeOf<ExampleEvent>().toEqualTypeOf<EventEnvelope<ExamplePayload>>();
});

test("domain event collection contracts expose immutable pending events", () => {
  type ExampleEvent = DomainEventReference<{ readonly changed: true }>;
  type ExampleCollection = DomainEventCollection<ExampleEvent>;
  type ExampleSnapshot = DomainEventCollectionSnapshot<ExampleEvent>;

  expectTypeOf<ExampleCollection>().toHaveProperty("pendingEvents");
  expectTypeOf<ExampleCollection["pendingEvents"]>().toEqualTypeOf<
    readonly ExampleEvent[]
  >();
  expectTypeOf<ExampleSnapshot>().toEqualTypeOf<readonly ExampleEvent[]>();
});
