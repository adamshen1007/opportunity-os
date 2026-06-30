import type { ApplicationResult } from "../results/index.js";
import type { HandlerExecutionContext } from "./handler-context.js";

export type HandlerExecutionInput<TInput = unknown, TDependencies = unknown> = {
  readonly input: TInput;
  readonly context: HandlerExecutionContext<TDependencies>;
};

export type ApplicationHandler<
  TInput = unknown,
  TValue = unknown,
  TError = unknown,
  TDependencies = unknown
> = {
  readonly handlerName: string;
  readonly execute: (
    input: HandlerExecutionInput<TInput, TDependencies>
  ) => Promise<ApplicationResult<TValue, TError>>;
};
