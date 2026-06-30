import type { DependencyToken } from "../tokens/index.js";

export type ModuleId = string;

export type ModuleDefinition = {
  readonly id: ModuleId;
  readonly description?: string;
  readonly dependencies?: readonly ModuleId[];
  readonly exports?: readonly DependencyToken[];
};
