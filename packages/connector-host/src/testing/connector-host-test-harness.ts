import type { RuntimeConfig } from "@opportunity-os/config";
import type {
  FakeConnectorFixture
} from "@opportunity-os/connectors";
import type {
  ConnectorRuntimeContext,
  ConnectorRuntimeFakeConnectorFixture
} from "@opportunity-os/connector-runtime";
import type { EventPublisher } from "@opportunity-os/events";
import type { StructuredLogger } from "@opportunity-os/shared";
import type {
  ConnectorHostBindings,
  ConnectorHostEventPublisherBinding,
  ConnectorHostLoggerBinding
} from "../bindings/index.js";
import type { ConnectorHostResult } from "../results/index.js";

export type ConnectorHostFakeClock = {
  readonly now: () => string;
};

export type ConnectorHostFakeConfig = RuntimeConfig & {
  readonly fixtureName: string;
};

export type ConnectorHostFakeRuntimeContext = ConnectorRuntimeContext & {
  readonly fixtureName: string;
};

export type ConnectorHostFakeConnectorFixture = FakeConnectorFixture & {
  readonly runtimeFixture?: ConnectorRuntimeFakeConnectorFixture;
};

export type ConnectorHostFakeLoggerBinding = ConnectorHostLoggerBinding & {
  readonly logger: StructuredLogger;
};

export type ConnectorHostFakeEventPublisherBinding<TPayload = unknown> =
  ConnectorHostEventPublisherBinding<TPayload> & {
    readonly publisher: EventPublisher<TPayload>;
  };

export type ConnectorHostTestFixture = {
  readonly clock: ConnectorHostFakeClock;
  readonly config: ConnectorHostFakeConfig;
  readonly runtime: ConnectorHostFakeRuntimeContext;
  readonly connector: ConnectorHostFakeConnectorFixture;
  readonly bindings: ConnectorHostBindings;
};

export type ConnectorHostAssertionHelper = {
  readonly name: string;
  readonly assert: (result: ConnectorHostResult, fixture: ConnectorHostTestFixture) => void;
};

export type ConnectorHostTestHarnessContract = {
  readonly fixture: ConnectorHostTestFixture;
  readonly assertions: readonly ConnectorHostAssertionHelper[];
};
