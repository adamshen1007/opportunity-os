import type { DomainMetadata } from "../metadata/index.js";
import type { DomainId } from "../primitives/index.js";

export type Entity<
  TId extends DomainId = DomainId,
  TMetadata extends DomainMetadata = DomainMetadata
> = {
  readonly id: TId;
  readonly metadata: TMetadata;
};

export type EntityIdentity<TEntity extends Entity> = TEntity["id"];
