import type {
  Connector,
  ConnectorFactory,
  ConnectorFactoryInput,
  ConnectorFactoryResult
} from "@opportunity-os/connectors";
import type {
  ConnectorHostBindingContext,
  ConnectorHostTestHarnessContract
} from "@opportunity-os/connector-host";
import type {
  RedditConnectorConfig,
  RedditConnectorMetadata
} from "../index.js";

export type RedditConnectorFactoryInput = ConnectorFactoryInput & {
  readonly metadata: RedditConnectorMetadata;
  readonly config: RedditConnectorConfig;
  readonly hostContext: ConnectorHostBindingContext;
};

export type RedditConnectorFactoryResult =
  ConnectorFactoryResult<Connector<RedditConnectorFactoryInput, unknown>>;

export type RedditConnectorFactory =
  ConnectorFactory<Connector<RedditConnectorFactoryInput, unknown>> & {
    readonly create: (
      input: RedditConnectorFactoryInput
    ) => RedditConnectorFactoryResult | Promise<RedditConnectorFactoryResult>;
  };

export type RedditConnectorFactoryShape = {
  readonly factory: RedditConnectorFactory;
  readonly testHarness?: ConnectorHostTestHarnessContract;
};
