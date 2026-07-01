import type {
  ConnectorCapabilitySet
} from "../capabilities/index.js";
import type { ConnectorConfig } from "../configuration/index.js";
import type { ConnectorContext } from "../context/index.js";
import type {
  ConnectorLifecycle,
  ConnectorLifecycleState
} from "../lifecycle/index.js";
import type { ConnectorMetadata } from "../metadata/index.js";
import type { ConnectorOperationContract } from "../operations/index.js";

export type Connector<TInput = unknown, TOutput = unknown> = {
  readonly metadata: ConnectorMetadata;
  readonly capabilities: ConnectorCapabilitySet;
  readonly config: ConnectorConfig;
  readonly lifecycle: ConnectorLifecycle;
  readonly validate: (
    context: ConnectorContext
  ) => ConnectorLifecycleState | Promise<ConnectorLifecycleState>;
  readonly operation: ConnectorOperationContract<TInput, TOutput>;
};
