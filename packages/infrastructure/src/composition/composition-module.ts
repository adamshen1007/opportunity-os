import type {
  CompositionRootInput,
  CompositionResult,
  ModuleRegistration
} from "@opportunity-os/container";
import type { InfrastructureModule } from "../modules/index.js";

export type InfrastructureCompositionInput = {
  readonly infrastructureModules: readonly InfrastructureModule[];
  readonly containerModules: readonly ModuleRegistration[];
};

export type InfrastructureCompositionModule = {
  readonly id: string;
  readonly description?: string;
  readonly input: InfrastructureCompositionInput;
  readonly containerCompositionInput: CompositionRootInput;
};

export type InfrastructureCompositionResult = {
  readonly module: InfrastructureCompositionModule;
  readonly composition: CompositionResult;
};
