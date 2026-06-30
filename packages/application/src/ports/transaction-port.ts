import type { ApplicationContext } from "../context/index.js";

export type TransactionScope<TPorts = unknown> = {
  readonly ports: TPorts;
  readonly context: ApplicationContext;
};

export type TransactionBoundaryPort<TPorts = unknown> = {
  readonly runInTransaction: <TResult>(
    operation: (scope: TransactionScope<TPorts>) => Promise<TResult>
  ) => Promise<TResult>;
};
