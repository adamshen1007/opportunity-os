import { describe, expect, it } from "vitest";
import type {
  ConfigCompositionContract,
  DatabaseCompositionContract,
  EventCompositionContract,
  FoundationPackageCompositionContract,
  LoggingCompositionContract
} from "../index.js";

const runtimeConfig = {
  application: {
    appName: "opportunity-os",
    nodeEnv: "local",
    port: 3000
  },
  services: {
    databaseUrl: "postgresql://user:pass@localhost:5432/app",
    redisUrl: "redis://localhost:6379"
  },
  aiProviders: {
    openAiApiKey: "test-openai-key",
    anthropicApiKey: "test-anthropic-key",
    openAiModel: "gpt-test",
    anthropicModel: "claude-test"
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
} as const;

describe("foundation package composition contracts", () => {
  it("references runtime configuration without reading ambient state", () => {
    const config: ConfigCompositionContract = {
      packageName: "@opportunity-os/config",
      runtimeConfig
    };

    expect(config.runtimeConfig.application.appName).toBe("opportunity-os");
  });

  it("references logging contracts without creating a singleton", () => {
    const logging: LoggingCompositionContract = {
      packageName: "@opportunity-os/shared",
      loggerConfig: {
        service: "infrastructure",
        environment: "local",
        logLevel: "info",
        pinoLevel: "info"
      }
    };

    expect(logging.logger).toBeUndefined();
    expect(logging.loggerFactory).toBeUndefined();
  });

  it("references event contracts without requiring a transport", () => {
    const events: EventCompositionContract = {
      packageName: "@opportunity-os/events",
      schemas: []
    };

    expect(events.publisher).toBeUndefined();
    expect(events.consumers).toBeUndefined();
  });

  it("references database contracts without creating a client", () => {
    const database: DatabaseCompositionContract = {
      packageName: "@opportunity-os/database",
      config: {
        databaseUrl: "postgresql://user:pass@localhost:5432/app"
      }
    };

    expect(database.createClient).toBeUndefined();
  });

  it("represents foundation package composition metadata", () => {
    const composition: FoundationPackageCompositionContract = {
      metadata: [
        {
          packageName: "@opportunity-os/config",
          moduleId: "configuration",
          enabled: true
        }
      ],
      config: {
        packageName: "@opportunity-os/config",
        runtimeConfig
      },
      domain: {
        packageName: "@opportunity-os/domain",
        contracts: ["metadata"]
      },
      application: {
        packageName: "@opportunity-os/application",
        ports: ["events"]
      }
    };

    expect(composition.metadata[0]?.enabled).toBe(true);
    expect(composition.domain?.contracts).toEqual(["metadata"]);
    expect(composition.application?.ports).toEqual(["events"]);
  });
});
