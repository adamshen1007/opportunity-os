import type { AggregateRoot } from "../aggregate/index.js";
import type { Entity } from "../entity/index.js";
import type { DomainId } from "../primitives/index.js";
import type { DomainResult } from "../result/index.js";

export type DomainRepositoryContext = {
  readonly correlationId?: string;
  readonly requestId?: string;
};

export type DomainRepositoryContract<
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
