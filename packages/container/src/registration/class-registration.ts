import type { ContainerLifetime } from "../lifetime/index.js";
import type { DependencyToken } from "../tokens/index.js";

export type ServiceConstructor<TValue = unknown> = abstract new (
  ...args: never[]
) => TValue;

export type ClassRegistration<TValue = unknown> = {
  readonly kind: "class";
  readonly token: DependencyToken<TValue>;
  readonly lifetime: ContainerLifetime;
  readonly dependencies?: readonly DependencyToken[];
  readonly useClass: ServiceConstructor<TValue>;
};
