import type { FakeConnectorFixture } from "@opportunity-os/connectors";
import type { ConnectorRuntimeCheckpoint } from "../checkpoint/index.js";
import type { ConnectorRuntimeContext } from "../context/index.js";
import type { ConnectorRuntimeExecutionMetrics } from "../observability/index.js";
import type { ConnectorRuntimeExecutionPipeline } from "../pipeline/index.js";

export type ConnectorRuntimeFakeClock = {
  readonly now: () => string;
};

export type ConnectorRuntimeFakeConnectorFixture = FakeConnectorFixture & {
  readonly runtimeContext: ConnectorRuntimeContext;
};

export type ConnectorRuntimeAssertionHelper = {
  readonly name: string;
  readonly assert: (fixture: ConnectorRuntimePipelineFixture) => void;
};

export type ConnectorRuntimePipelineFixture<
  TInput = unknown,
  TOutput = unknown
> = {
  readonly clock: ConnectorRuntimeFakeClock;
  readonly connector: ConnectorRuntimeFakeConnectorFixture;
  readonly pipeline: ConnectorRuntimeExecutionPipeline<TInput, TOutput>;
  readonly metrics?: ConnectorRuntimeExecutionMetrics;
  readonly checkpoints?: readonly ConnectorRuntimeCheckpoint[];
};

export type ConnectorRuntimeTestHarnessContract = {
  readonly clock: ConnectorRuntimeFakeClock;
  readonly connectors: readonly ConnectorRuntimeFakeConnectorFixture[];
  readonly assertions: readonly ConnectorRuntimeAssertionHelper[];
};
