import type { ServiceDescriptor } from "../registration/index.js";
import type { ModuleDefinition } from "./module-definition.js";

export type ModuleRegistration = ModuleDefinition & {
  readonly registrations: readonly ServiceDescriptor[];
};
