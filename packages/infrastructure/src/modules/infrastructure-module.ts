import type {
  ModuleRegistration,
  ServiceDescriptor
} from "@opportunity-os/container";

export const INFRASTRUCTURE_MODULE_KINDS = [
  "configuration",
  "logging",
  "events",
  "database",
  "domain",
  "application",
  "container",
  "infrastructure"
] as const;

export type InfrastructureModuleKind =
  (typeof INFRASTRUCTURE_MODULE_KINDS)[number];

export type InfrastructureModuleId = string;

export type InfrastructureModuleDependency = {
  readonly id: InfrastructureModuleId;
  readonly optional?: boolean;
};

export type InfrastructureModule = {
  readonly id: InfrastructureModuleId;
  readonly kind: InfrastructureModuleKind;
  readonly description?: string;
  readonly dependencies?: readonly InfrastructureModuleDependency[];
  readonly containerModule?: ModuleRegistration;
  readonly registrations?: readonly ServiceDescriptor[];
  readonly tags?: readonly string[];
};
