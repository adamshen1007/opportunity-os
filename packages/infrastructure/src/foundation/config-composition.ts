import type { RuntimeConfig } from "@opportunity-os/config";
import type { StartupValidationResult } from "../startup/index.js";

export type ConfigCompositionContract = {
  readonly packageName: "@opportunity-os/config";
  readonly runtimeConfig: RuntimeConfig;
  readonly validation?: StartupValidationResult;
};
