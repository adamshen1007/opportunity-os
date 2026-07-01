import type {
  ConfigBinding,
  ContainerContract,
  ModuleRegistration
} from "@opportunity-os/container";
import type { ConnectorRuntimeContext } from "@opportunity-os/connector-runtime";
import type {
  InfrastructureBootstrapValidationResult,
  InfrastructureModuleId
} from "@opportunity-os/infrastructure";
import type { StructuredLogger } from "@opportunity-os/shared";

export const CONNECTOR_HOST_BOOTSTRAP_STATUSES = [
  "ready",
  "invalid"
] as const;

export type ConnectorHostBootstrapStatus =
  (typeof CONNECTOR_HOST_BOOTSTRAP_STATUSES)[number];

export type ConnectorHostBootstrapInfrastructure = {
  readonly moduleId?: InfrastructureModuleId;
  readonly validation?: InfrastructureBootstrapValidationResult;
};

export type ConnectorHostBootstrapInput = {
  readonly hostId: string;
  readonly config: ConfigBinding;
  readonly container: ContainerContract;
  readonly runtime: ConnectorRuntimeContext;
  readonly logger: StructuredLogger;
  readonly modules?: readonly ModuleRegistration[];
  readonly infrastructure?: ConnectorHostBootstrapInfrastructure;
};

export type ConnectorHostBootstrapOutput = {
  readonly status: ConnectorHostBootstrapStatus;
  readonly hostId: string;
  readonly safeMessage?: string;
  readonly infrastructure?: ConnectorHostBootstrapInfrastructure;
};

export type ConnectorHostBootstrapContract = {
  readonly input: ConnectorHostBootstrapInput;
  readonly output?: ConnectorHostBootstrapOutput;
};
