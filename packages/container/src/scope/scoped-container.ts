import type { ContainerContract } from "../container/index.js";
import type { ContainerScope } from "./scope.js";

export type ScopedContainer = ContainerContract & {
  readonly scope: ContainerScope;
};

export type ScopeFactory = {
  readonly createScope: (id: string) => ContainerScope;
  readonly createScopedContainer: (
    scope: ContainerScope
  ) => ScopedContainer;
};
