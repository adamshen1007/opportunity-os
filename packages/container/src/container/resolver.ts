import type { DependencyToken } from "../tokens/index.js";

export type DependencyResolver = {
  readonly has: (token: DependencyToken) => boolean;
  readonly resolve: <TValue>(token: DependencyToken<TValue>) => TValue;
  readonly resolveOptional: <TValue>(
    token: DependencyToken<TValue>
  ) => TValue | undefined;
};
