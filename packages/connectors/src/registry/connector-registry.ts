import type { Connector } from "../connector/index.js";
import type { ConnectorId, ConnectorMetadata } from "../metadata/index.js";
import type { ConnectorResult } from "../results/index.js";
import type { ConnectorValidationResult } from "../validation/index.js";

export type ConnectorRegistryRegistrationResult<
  TConnector extends Connector = Connector
> = ConnectorResult<TConnector>;

export type ConnectorRegistryLookupResult<
  TConnector extends Connector = Connector
> = ConnectorResult<TConnector | undefined>;

export type ConnectorRegistryListResult<
  TConnector extends Connector = Connector
> = ConnectorResult<readonly ConnectorMetadata[]>;

export type ConnectorRegistry<TConnector extends Connector = Connector> = {
  readonly register: (
    connector: TConnector
  ) =>
    | ConnectorRegistryRegistrationResult<TConnector>
    | Promise<ConnectorRegistryRegistrationResult<TConnector>>;
  readonly lookup: (
    connectorId: ConnectorId
  ) =>
    | ConnectorRegistryLookupResult<TConnector>
    | Promise<ConnectorRegistryLookupResult<TConnector>>;
  readonly list: () =>
    | ConnectorRegistryListResult<TConnector>
    | Promise<ConnectorRegistryListResult<TConnector>>;
  readonly validate: () =>
    | ConnectorValidationResult
    | Promise<ConnectorValidationResult>;
};
