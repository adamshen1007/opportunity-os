import type { UseCaseResult } from "./use-case-result.js";

export type UseCaseContext = {
  readonly correlationId: string;
  readonly requestId?: string;
};

export type UseCaseInput<TInput = unknown> = {
  readonly input: TInput;
  readonly context: UseCaseContext;
};

export type UseCase<
  TInput = unknown,
  TValue = unknown,
  TError = unknown
> = {
  execute(input: UseCaseInput<TInput>): Promise<UseCaseResult<TValue, TError>>;
};
