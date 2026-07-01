import type {
  ConnectorConfig,
  ConnectorContext,
  ConnectorMetadata
} from "@opportunity-os/connectors";
import type {
  InfrastructureModuleId,
  PackageRegistrationMetadata
} from "@opportunity-os/infrastructure";
import type {
  CorrelationId,
  RequestId,
  StructuredLogger
} from "@opportunity-os/shared";

export type ConnectorRuntimeInfrastructureMetadata = {
  readonly moduleId?: InfrastructureModuleId;
  readonly packageRegistration?: PackageRegistrationMetadata;
  readonly service?: string;
  readonly environment?: string;
};

export type ConnectorRuntimeConnectorReference = {
  readonly metadata: ConnectorMetadata;
  readonly config: ConnectorConfig;
  readonly context: ConnectorContext;
};

export type ConnectorRuntimeContext = {
  readonly correlationId: CorrelationId;
  readonly requestId?: RequestId;
  readonly logger: StructuredLogger;
  readonly connector: ConnectorRuntimeConnectorReference;
  readonly infrastructure: ConnectorRuntimeInfrastructureMetadata;
};
