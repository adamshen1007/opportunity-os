import type { ApplicationContext } from "../context/index.js";

export type HandlerExecutionContext<TDependencies = unknown> =
  ApplicationContext & {
    readonly dependencies?: TDependencies;
  };
