import type {
  AggregateRoot,
  DomainId,
  DomainRepositoryContext,
  DomainResult,
  Entity
} from "@opportunity-os/domain";

export type DomainRepositoryPort<
  TRecord extends Entity | AggregateRoot,
  TId extends DomainId = TRecord["id"]
> = {
  readonly findById: (
    id: TId,
    context?: DomainRepositoryContext
  ) => Promise<DomainResult<TRecord | null>>;
  readonly save: (
    record: TRecord,
    context?: DomainRepositoryContext
  ) => Promise<DomainResult<TRecord>>;
};
