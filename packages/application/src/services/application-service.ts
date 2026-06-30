import type { UseCaseContext } from "../use-cases/index.js";

export type ApplicationServiceOperation<TInput = unknown> = {
  readonly input: TInput;
  readonly context: UseCaseContext;
};

export type ApplicationService<
  TInput = unknown,
  TResult = unknown
> = {
  readonly serviceName: string;
  execute(operation: ApplicationServiceOperation<TInput>): Promise<TResult>;
};
