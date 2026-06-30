import type { InjectionToken } from "./injection-token.js";

export type ContainerContract = {
  readonly has: (token: InjectionToken) => boolean;
  readonly resolve: <TValue>(token: InjectionToken<TValue>) => TValue;
};
