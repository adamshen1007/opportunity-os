import type { ConnectorConfig } from "../configuration/index.js";
import type { Connector } from "../connector/index.js";
import type { ConnectorContext } from "../context/index.js";
import type { ConnectorError } from "../errors/index.js";
import type { ConnectorMetadata } from "../metadata/index.js";
import type { ConnectorResult } from "../results/index.js";

export type ConnectorFactoryInput = {
  readonly metadata?: ConnectorMetadata;
  readonly config: ConnectorConfig;
  readonly context: ConnectorContext;
};

export type ConnectorFactoryResult<TConnector extends Connector = Connector> =
  ConnectorResult<TConnector, ConnectorError>;

export type ConnectorFactory<TConnector extends Connector = Connector> = {
  readonly create: (
    input: ConnectorFactoryInput
  ) =>
    | ConnectorFactoryResult<TConnector>
    | Promise<ConnectorFactoryResult<TConnector>>;
};
