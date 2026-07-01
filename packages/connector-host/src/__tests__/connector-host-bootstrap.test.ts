import { describe, expect, it } from "vitest";
import {
  CONNECTOR_HOST_BOOTSTRAP_STATUSES,
  type ConnectorHostBootstrapContract
} from "../index.js";
import type { RuntimeConfig } from "@opportunity-os/config";
import type { StructuredLogger } from "@opportunity-os/shared";

describe("connector host bootstrap contracts", () => {
  it("defines bootstrap status vocabulary", () => {
    expect(CONNECTOR_HOST_BOOTSTRAP_STATUSES).toEqual(["ready", "invalid"]);
  });

  it("models bootstrap inputs without startup behavior", () => {
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
    const contract: ConnectorHostBootstrapContract = {
      input: {
        hostId: "host-1",
        config: {
          kind: "config",
          token: {
            id: "connector-host.config"
          },
          config: runtimeConfig
        },
        container: {
          registrations: [],
          has: () => false,
          resolve: () => {
            throw new Error("Resolver is not available in contract tests.");
          },
          resolveOptional: () => undefined
        },
        runtime: {
          correlationId: "correlation-1",
          logger,
          connector: {
            metadata: {
              id: "generic-source",
              name: "Generic Source",
              version: "1.0.0",
              description: "Generic connector.",
              provider: "generic",
              category: "source",
              tags: ["generic"],
              stability: "experimental"
            },
            config: {
              fields: []
            },
            context: {
              correlationId: "correlation-1",
              logger,
              config: {
                fields: []
              },
              execution: {
                connectorId: "generic-source"
              }
            }
          },
          infrastructure: {
            moduleId: "connector-host"
          }
        },
        logger,
        infrastructure: {
          moduleId: "connector-host"
        }
      },
      output: {
        status: "ready",
        hostId: "host-1",
        safeMessage: "Host boundary is ready."
      }
    };

    expect(contract.output?.status).toBe("ready");
  });
});
