import { describe, expect, it } from "vitest";
import type { RuntimeConfig } from "@opportunity-os/config";
import { createDependencyToken } from "@opportunity-os/container";
import type { EventPublisher } from "@opportunity-os/events";
import type { StructuredLogger } from "@opportunity-os/shared";
import type { ConnectorHostBindings } from "../index.js";

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

describe("connector host binding contracts", () => {
  it("models explicit config, container, logger, and event publisher bindings", () => {
    const logger: StructuredLogger = {
      log: () => undefined,
      debug: () => undefined,
      info: () => undefined,
      warn: () => undefined,
      error: () => undefined,
      child: () => logger
    };
    const eventPublisher: EventPublisher = {
      publish: () => ({ accepted: true })
    };

    const bindings: ConnectorHostBindings = {
      config: {
        kind: "config",
        token: createDependencyToken<RuntimeConfig>("config.runtime"),
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
          token: createDependencyToken<StructuredLogger>("logger.structured"),
          logger
        },
        logger,
        correlationId: "correlation-1",
        requestId: "request-1"
      },
      events: {
        kind: "event-publisher",
        token: createDependencyToken<EventPublisher>("events.publisher"),
        publisher: eventPublisher,
        correlationId: "correlation-1"
      },
      context: {
        correlationId: "correlation-1",
        requestId: "request-1"
      }
    };

    expect(bindings.config.config.application.nodeEnv).toBe("local");
    expect(bindings.context.correlationId).toBe("correlation-1");
    expect(bindings.events?.kind).toBe("event-publisher");
  });
});
