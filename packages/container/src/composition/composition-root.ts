import type { ModuleRegistration } from "../modules/index.js";
import type { CompositionResult } from "./composition-result.js";

export type CompositionRootInput = {
  readonly modules: readonly ModuleRegistration[];
};

export type CompositionRoot = {
  readonly compose: (input: CompositionRootInput) => CompositionResult;
};
