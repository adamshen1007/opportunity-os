import { describe, expect, it } from "vitest";
import type { RuntimeConfig } from "@opportunity-os/config";
import type {
  ConnectorHostFakeConfig,
  ConnectorHostFakeConnectorFixture,
  ConnectorHostFakeRuntimeContext,
  ConnectorHostTestHarnessContract
} from "../index.js";
import type { StructuredLogger } from "@opportunity-os/shared";

const logger: StructuredLogger = {
  log: () => undefined,
  debug: () => undefined,
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
  child: () => logger
};

const runtimeConfig: RuntimeConfig = {
  application: {
    appName: "Opportunity OS",
    nodeEnv: "local",
    port: 3000
  },
  services: {
    databaseUrl: "postgresql://local.example/opportunity_os",
    redisUrl: "redis://localhost:6379"
  },
  aiProviders: {
    openAiApiKey: "test-openai-key",
    anthropicApiKey: "test-anthropic-key",
    openAiModel: "test-openai-model",
    anthropicModel: "test-anthropic-model"
  },
  authentication: {
    jwtSecret: "test-jwt-secret",
    jwtExpiresIn: "1h"
  },
  observability: {
    logLevel: "info",
    otelExporterEndpoint: "http://localhost:4318"
  },
  optionalIntegrations: {}
};

const fakeConfig: ConnectorHostFakeConfig = {
  ...runtimeConfig,
  fixtureName: "local-host"
};

const connector: ConnectorHostFakeConnectorFixture = {
  metadata: {
    fixtureName: "generic-source",
    id: "generic-source",
    name: "Generic Source",
    version: "1.0.0",
    description: "Generic fixture.",
    provider: "generic",
    category: "source",
    tags: ["generic"],
    stability: "experimental"
  },
  capabilities: {
    capabilities: []
  },
  config: {
    fields: []
  },
  context: {
    fixtureName: "generic-context",
    correlationId: "correlation-1",
    logger,
    config: {
      fields: []
    },
    execution: {
      connectorId: "generic-source"
    }
  }
};

const runtime: ConnectorHostFakeRuntimeContext = {
  fixtureName: "runtime",
  correlationId: "correlation-1",
  logger,
  connector: {
    metadata: connector.metadata,
    config: connector.config,
    context: connector.context
  },
  infrastructure: {
    moduleId: "connector-host"
  }
};

describe("connector host test harness contracts", () => {
  it("models deterministic host fixtures and assertions", () => {
    const harness: ConnectorHostTestHarnessContract = {
      fixture: {
        clock: {
          now: () => "2026-07-01T00:00:00.000Z"
        },
        config: fakeConfig,
        runtime,
        connector,
        bindings: {
          config: {
            kind: "config",
            token: {
              id: "config.runtime"
            },
            config: runtimeConfig
          },
          dependencies: {
            container: {
              registrations: [],
              has: () => false,
              resolve: () => {
                throw new Error("Resolver is not available in contract tests.");
              },
              resolveOptional: () => undefined
            }
          },
          logger: {
            binding: {
              kind: "logger",
              token: {
                id: "logger.structured"
              },
              logger
            },
            logger,
            correlationId: "correlation-1"
          },
          context: {
            correlationId: "correlation-1"
          }
        }
      },
      assertions: [
        {
          name: "safe-result",
          assert: (result) => {
            expect(result.metadata.correlationId).toBe("correlation-1");
          }
        }
      ]
    };

    expect(harness.fixture.clock.now()).toBe("2026-07-01T00:00:00.000Z");
    expect(harness.assertions[0]?.name).toBe("safe-result");
  });
});
