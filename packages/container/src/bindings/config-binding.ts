import type { RuntimeConfig, RuntimeConfigGroup } from "@opportunity-os/config";
import type { DependencyToken } from "../tokens/index.js";

export type ConfigBinding<TValue = RuntimeConfig> = {
  readonly kind: "config";
  readonly token: DependencyToken<TValue>;
  readonly config: TValue;
  readonly group?: RuntimeConfigGroup;
};

export type ConfigBindingInput<TValue = RuntimeConfig> = {
  readonly token: DependencyToken<TValue>;
  readonly config: TValue;
  readonly group?: RuntimeConfigGroup;
};
