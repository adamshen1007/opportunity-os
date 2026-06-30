import type { DomainEventReference } from "./domain-event.js";

export type DomainEventCollection<
  TEvent extends DomainEventReference = DomainEventReference
> = {
  readonly pendingEvents: readonly TEvent[];
};

export type DomainEventCollectionSnapshot<
  TEvent extends DomainEventReference = DomainEventReference
> = readonly TEvent[];
