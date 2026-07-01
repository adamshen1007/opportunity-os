import type { ConnectorCapabilitySet } from "../capabilities/index.js";
import type { ConnectorConfig } from "../configuration/index.js";
import type { ConnectorContext } from "../context/index.js";
import type { ConnectorMetadata } from "../metadata/index.js";
import type { ConnectorResult } from "../results/index.js";

export type FakeConnectorMetadata = ConnectorMetadata & {
  readonly fixtureName: string;
};

export type FakeConnectorContext = ConnectorContext & {
  readonly fixtureName: string;
};

export type FakeConnectorFixture = {
  readonly metadata: FakeConnectorMetadata;
  readonly capabilities: ConnectorCapabilitySet;
  readonly config: ConnectorConfig;
  readonly context: FakeConnectorContext;
};

export type ConnectorAssertionContext<TValue = unknown, TError = unknown> = {
  readonly result: ConnectorResult<TValue, TError>;
  readonly fixture: FakeConnectorFixture;
};

export type ConnectorAssertionHelper<TValue = unknown, TError = unknown> = {
  readonly name: string;
  readonly assert: (
    context: ConnectorAssertionContext<TValue, TError>
  ) => void | Promise<void>;
};
