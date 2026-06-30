import type { ContainerLifetime } from "../lifetime/index.js";
import type { DependencyToken } from "../tokens/index.js";

export type FactoryResolutionContext = {
  readonly resolve: <TValue>(token: DependencyToken<TValue>) => TValue;
};

export type DependencyFactory<TValue = unknown> = (
  context: FactoryResolutionContext
) => TValue | Promise<TValue>;

export type FactoryRegistration<TValue = unknown> = {
  readonly kind: "factory";
  readonly token: DependencyToken<TValue>;
  readonly lifetime: ContainerLifetime;
  readonly dependencies?: readonly DependencyToken[];
  readonly create: DependencyFactory<TValue>;
};
