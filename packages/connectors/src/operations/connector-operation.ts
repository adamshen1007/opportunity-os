export type ConnectorPaginationMetadata = {
  readonly cursor?: string;
  readonly nextCursor?: string;
  readonly hasMore: boolean;
  readonly limit?: number;
};

export type ConnectorOperationExecutionMetadata = {
  readonly startedAt?: string;
  readonly completedAt?: string;
  readonly durationMs?: number;
  readonly attempt?: number;
};

export type ConnectorOperationInput<TInput = unknown> = {
  readonly value: TInput;
  readonly pagination?: ConnectorPaginationMetadata;
  readonly metadata?: ConnectorOperationExecutionMetadata;
};

export type ConnectorOperationOutput<TOutput = unknown> = {
  readonly value: TOutput;
  readonly pagination?: ConnectorPaginationMetadata;
  readonly metadata?: ConnectorOperationExecutionMetadata;
};

export type ConnectorOperationContract<TInput = unknown, TOutput = unknown> = {
  readonly name: string;
  readonly input?: ConnectorOperationInput<TInput>;
  readonly output?: ConnectorOperationOutput<TOutput>;
};
