import type {
  InfrastructureModule,
  InfrastructureModuleId
} from "./infrastructure-module.js";

export const INFRASTRUCTURE_PACKAGE_NAMES = [
  "@opportunity-os/config",
  "@opportunity-os/shared",
  "@opportunity-os/events",
  "@opportunity-os/database",
  "@opportunity-os/domain",
  "@opportunity-os/application",
  "@opportunity-os/container"
] as const;

export type InfrastructurePackageName =
  (typeof INFRASTRUCTURE_PACKAGE_NAMES)[number];

export type PackageRegistrationMetadata = {
  readonly packageName: InfrastructurePackageName;
  readonly moduleId: InfrastructureModuleId;
  readonly version?: string;
  readonly provides: readonly string[];
  readonly requires?: readonly InfrastructureModuleId[];
  readonly optional?: boolean;
};

export type PackageRegistrationModule = InfrastructureModule & {
  readonly packageRegistration: PackageRegistrationMetadata;
};
