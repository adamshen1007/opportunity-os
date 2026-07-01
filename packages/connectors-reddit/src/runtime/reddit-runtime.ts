import {
  CONNECTOR_LIFECYCLE_PHASES,
  type ConnectorLifecycle,
  type ConnectorLifecycleState
} from "@opportunity-os/connectors";
import {
  REDDIT_CONNECTOR_CAPABILITIES,
  type RedditConnectorCapabilitySet
} from "../capabilities/index.js";
import type { RedditConnectorConfig } from "../configuration/index.js";
import { REDDIT_CONNECTOR_METADATA } from "../metadata/index.js";
import {
  REDDIT_OPERATION_NAMES,
  type RedditOperationName,
  type RedditOperationContract
} from "../operations/index.js";
import type { RedditDataEnvelope } from "../data/index.js";
import type { RedditFakeProvider } from "./fake-provider.js";
import { createRedditFixtureProvider } from "./fixture-provider.js";
import { createRedditLifecycleReadiness } from "./lifecycle-runtime.js";
import { readRedditFixtureOperation } from "./read-router.js";
import { validateRedditRuntimeConfig } from "./config-validator.js";

export type RedditRuntimeConnector = {
  readonly metadata: typeof REDDIT_CONNECTOR_METADATA;
  readonly capabilities: RedditConnectorCapabilitySet;
  readonly config: RedditConnectorConfig;
  readonly lifecycle: ConnectorLifecycle;
  readonly provider: RedditFakeProvider;
  readonly operations: readonly RedditOperationContract[];
  readonly validate: () => ConnectorLifecycleState;
  readonly read: (operationName: RedditOperationName) => RedditDataEnvelope;
};

export type RedditRuntimeConnectorInput = {
  readonly config: RedditConnectorConfig;
  readonly provider?: RedditFakeProvider;
};

const redditOperations = REDDIT_OPERATION_NAMES.map((name) => ({
  name
})) satisfies readonly RedditOperationContract[];

export function createRedditRuntimeConnector(
  input: RedditRuntimeConnectorInput
): RedditRuntimeConnector {
  const provider = input.provider ?? createRedditFixtureProvider();

  return {
    metadata: REDDIT_CONNECTOR_METADATA,
    capabilities: {
      capabilities: REDDIT_CONNECTOR_CAPABILITIES
    },
    config: input.config,
    lifecycle: {
      phases: CONNECTOR_LIFECYCLE_PHASES
    },
    provider,
    operations: redditOperations,
    read: (operationName) => readRedditFixtureOperation(provider, operationName),
    validate: () => {
      const readiness = createRedditLifecycleReadiness(
        validateRedditRuntimeConfig(input.config)
      );
      return readiness.states[0] ?? {
        phase: "validate",
        ready: false,
        safeMessage: "Reddit fixture runtime is not ready."
      };
    }
  };
}
