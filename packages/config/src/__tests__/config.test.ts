import { describe, expect, it } from "vitest";

import {
  CONFIG_PACKAGE_NAME,
  CONFIG_PACKAGE_SCOPE,
  createRuntimeConfig,
  loadRuntimeConfig,
  type ResolvedRuntimeConfig
} from "../config.js";
import { EnvironmentValidationError } from "../errors.js";
import type { OptionalEnvironment, RequiredEnvironment, RuntimeConfig } from "../types.js";

const requiredEnvironment: RequiredEnvironment = {
  APP_NAME: "opportunity-os",
  NODE_ENV: "local",
  PORT: 3000,
  DATABASE_URL: "postgresql://opportunity:opportunity@localhost:5432/opportunity_os",
  REDIS_URL: "redis://localhost:6379",
  OPENAI_API_KEY: "openai-secret-value",
  ANTHROPIC_API_KEY: "anthropic-secret-value",
  OPENAI_MODEL: "gpt-4.1",
  ANTHROPIC_MODEL: "claude-3-5-sonnet",
  JWT_SECRET: "jwt-secret-value",
  JWT_EXPIRES_IN: "1h",
  LOG_LEVEL: "info",
  OTEL_EXPORTER_ENDPOINT: "http://localhost:4318"
};

const optionalEnvironment: OptionalEnvironment = {
  SENTRY_DSN: "https://example.sentry.io/123",
  LANGFUSE_API_KEY: "langfuse-secret-value",
  LANGSMITH_API_KEY: "langsmith-secret-value",
  OPPORTUNITY_OS_API_URL: "https://api.example.com",
  OPPORTUNITY_OS_WEB_URL: "https://app.example.com",
  NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL: "https://api.example.com",
  AUTH_SECRET_PEPPER: "auth-pepper-secret-value",
  AUTH_INVITE_TTL_MS: 604800000,
  AUTH_SESSION_TTL_MS: 28800000,
  LLM_PROVIDER: "openai",
  LLM_MODEL: "gpt-4.1-mini",
  LLM_LIVE_ANALYSIS_ENABLED: "true",
  LLM_PROVIDER_TIMEOUT_MS: 30000
};

const processLikeGlobal = globalThis as typeof globalThis & {
  process: {
    env: Record<string, string | undefined>;
  };
};

describe("config package scaffold", () => {
  it("exposes package identity without reading process.env", () => {
    expect(CONFIG_PACKAGE_NAME).toBe("@opportunity-os/config");
    expect(CONFIG_PACKAGE_SCOPE).toBe("runtime-configuration");
  });

  it("creates a typed runtime config grouped by responsibility", () => {
    expect(createRuntimeConfig(requiredEnvironment, optionalEnvironment)).toEqual({
      application: {
        appName: "opportunity-os",
        nodeEnv: "local",
        port: 3000
      },
      services: {
        databaseUrl: "postgresql://opportunity:opportunity@localhost:5432/opportunity_os",
        redisUrl: "redis://localhost:6379"
      },
      aiProviders: {
        openAiApiKey: "openai-secret-value",
        anthropicApiKey: "anthropic-secret-value",
        openAiModel: "gpt-4.1",
        anthropicModel: "claude-3-5-sonnet"
      },
      authentication: {
        jwtSecret: "jwt-secret-value",
        jwtExpiresIn: "1h"
      },
      observability: {
        logLevel: "info",
        otelExporterEndpoint: "http://localhost:4318"
      },
      optionalIntegrations: {
        sentryDsn: "https://example.sentry.io/123",
        langfuseApiKey: "langfuse-secret-value",
        langsmithApiKey: "langsmith-secret-value",
        apiUrl: "https://api.example.com",
        webUrl: "https://app.example.com",
        publicApiBaseUrl: "https://api.example.com",
        authSecretPepper: "auth-pepper-secret-value",
        authInviteTtlMs: 604800000,
        authSessionTtlMs: 28800000,
        llmProvider: "openai",
        llmModel: "gpt-4.1-mini",
        liveLlmAnalysisEnabled: true,
        llmProviderTimeoutMs: 30000
      }
    });
  });

  it("does not require optional integrations", () => {
    expect(createRuntimeConfig(requiredEnvironment).optionalIntegrations).toEqual({});
  });

  it("exports inferred TypeScript config types", () => {
    const config: ResolvedRuntimeConfig = createRuntimeConfig(requiredEnvironment);
    const runtimeConfig: RuntimeConfig = config;

    expect(runtimeConfig.application.appName).toBe("opportunity-os");
  });

  it("loads runtime config from an explicit environment source", () => {
    expect(loadRuntimeConfig({ ...requiredEnvironment, ...optionalEnvironment })).toEqual(
      createRuntimeConfig(requiredEnvironment, optionalEnvironment)
    );
  });

  it("defaults to process.env as the runtime environment source", () => {
    const previousEnvironment = { ...processLikeGlobal.process.env };

    try {
      processLikeGlobal.process.env = {
        ...previousEnvironment,
        ...stringifyEnvironment(requiredEnvironment),
        ...stringifyEnvironment(optionalEnvironment)
      };

      expect(loadRuntimeConfig()).toEqual(createRuntimeConfig(requiredEnvironment, optionalEnvironment));
    } finally {
      processLikeGlobal.process.env = previousEnvironment;
    }
  });

  it("throws a typed configuration error for invalid explicit environment sources", () => {
    expect(() =>
      loadRuntimeConfig({
        ...requiredEnvironment,
        APP_NAME: "",
        DATABASE_URL: "not-a-url"
      })
    ).toThrow(EnvironmentValidationError);
  });

  it("identifies invalid keys without leaking secret values", () => {
    const secretValue = "jwt-secret-value-that-must-not-leak";

    try {
      loadRuntimeConfig({
        ...requiredEnvironment,
        OPENAI_API_KEY: "",
        JWT_SECRET: secretValue,
        SENTRY_DSN: "not-a-url"
      });
    } catch (error) {
      expect(error).toBeInstanceOf(EnvironmentValidationError);
      expect((error as Error).message).toContain("OPENAI_API_KEY");
      expect((error as Error).message).not.toContain(secretValue);
      return;
    }

    throw new Error("Expected runtime config loading to fail");
  });
});

function stringifyEnvironment(environment: object): Record<string, string> {
  return Object.fromEntries(
    Object.entries(environment).map(([key, value]) => [key, String(value)])
  );
}
