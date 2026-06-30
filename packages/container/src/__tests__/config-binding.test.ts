import { describe, expect, expectTypeOf, it } from "vitest";
import type { RuntimeConfig } from "@opportunity-os/config";
import {
  createDependencyToken,
  type ConfigBinding,
  type ConfigBindingInput
} from "../index.js";

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

describe("configuration binding contracts", () => {
  it("binds explicit runtime configuration without reading process environment", () => {
    const token = createDependencyToken<RuntimeConfig>("config.runtime");
    const input: ConfigBindingInput = {
      token,
      config: runtimeConfig,
      group: "application"
    };
    const binding: ConfigBinding = {
      kind: "config",
      ...input
    };

    expect(binding.kind).toBe("config");
    expect(binding.config.application.appName).toBe("Opportunity OS");
    expect(binding.group).toBe("application");
    expectTypeOf(binding).toMatchTypeOf<ConfigBinding<RuntimeConfig>>();
  });
});
