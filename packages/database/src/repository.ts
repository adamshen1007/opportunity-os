export type RepositoryOperationContext<TTransaction = unknown> = Readonly<{
  transaction?: TTransaction;
}>;

export type RepositoryFindOptions<TTransaction = unknown> = RepositoryOperationContext<TTransaction>;

export type RepositoryWriteOptions<TTransaction = unknown> = RepositoryOperationContext<TTransaction>;

export type RepositoryDeleteOptions<TTransaction = unknown> = RepositoryOperationContext<TTransaction>;

export type RepositoryContract<TEntity, TId, TTransaction = unknown> = Readonly<{
  findById: (id: TId, options?: RepositoryFindOptions<TTransaction>) => Promise<TEntity | null>;
  save: (entity: TEntity, options?: RepositoryWriteOptions<TTransaction>) => Promise<TEntity>;
  deleteById: (id: TId, options?: RepositoryDeleteOptions<TTransaction>) => Promise<void>;
}>;

export type ReadRepositoryContract<TEntity, TId, TTransaction = unknown> = Pick<
  RepositoryContract<TEntity, TId, TTransaction>,
  "findById"
>;

export type WriteRepositoryContract<TEntity, TId, TTransaction = unknown> = Pick<
  RepositoryContract<TEntity, TId, TTransaction>,
  "save" | "deleteById"
>;
