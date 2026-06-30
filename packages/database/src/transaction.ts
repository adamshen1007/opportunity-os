export type TransactionIsolationLevel =
  | "read_uncommitted"
  | "read_committed"
  | "repeatable_read"
  | "serializable";

export type TransactionOptions = Readonly<{
  isolationLevel?: TransactionIsolationLevel;
  timeoutMs?: number;
}>;

export type TransactionHandler<TTransaction, TResult> = (transaction: TTransaction) => Promise<TResult>;

export type TransactionRunner<TTransaction> = <TResult>(
  handler: TransactionHandler<TTransaction, TResult>,
  options?: TransactionOptions
) => Promise<TResult>;

export type TransactionBoundary<TTransaction> = Readonly<{
  runInTransaction: <TResult>(
    handler: TransactionHandler<TTransaction, TResult>,
    options?: TransactionOptions
  ) => Promise<TResult>;
}>;

export function createTransactionBoundary<TTransaction>(
  runTransaction: TransactionRunner<TTransaction>
): TransactionBoundary<TTransaction> {
  return {
    runInTransaction: (handler, options) => runTransaction(handler, options)
  };
}
