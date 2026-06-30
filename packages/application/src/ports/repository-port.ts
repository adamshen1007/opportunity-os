import type {
  AggregateRoot,
  DomainId,
  DomainRepositoryContract,
  Entity
} from "@opportunity-os/domain";

export type ApplicationRepositoryPort<
  TRecord extends Entity | AggregateRoot,
  TId extends DomainId = TRecord["id"]
> = DomainRepositoryContract<TRecord, TId>;
