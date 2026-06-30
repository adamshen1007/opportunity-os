import type { InjectionToken } from "./injection-token.js";

export type ValueProvider<TValue = unknown> = {
  readonly kind: "value";
  readonly token: InjectionToken<TValue>;
  readonly value: TValue;
};

export type FactoryProvider<TValue = unknown> = {
  readonly kind: "factory";
  readonly token: InjectionToken<TValue>;
  readonly create: () => TValue | Promise<TValue>;
};

export type ApplicationProvider<TValue = unknown> =
  | ValueProvider<TValue>
  | FactoryProvider<TValue>;
