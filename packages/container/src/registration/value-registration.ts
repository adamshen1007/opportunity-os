import type { DependencyToken } from "../tokens/index.js";

export type ValueRegistration<TValue = unknown> = {
  readonly kind: "value";
  readonly token: DependencyToken<TValue>;
  readonly lifetime: "singleton";
  readonly value: TValue;
};
