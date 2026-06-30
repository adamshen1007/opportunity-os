import type { DomainEventReference } from "../events/index.js";
import type { Entity } from "../entity/index.js";
import type { DomainVersion } from "../primitives/index.js";

export type AggregateRoot<
  TEntity extends Entity = Entity,
  TEvent extends DomainEventReference = DomainEventReference
> = TEntity & {
  readonly version: DomainVersion;
  readonly pendingEvents: readonly TEvent[];
};

export type AggregateIdentity<TAggregateRoot extends AggregateRoot> =
  TAggregateRoot["id"];
