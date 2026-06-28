import type { OptionalEnvironment, OptionalIntegrationConfig, RequiredEnvironment, RuntimeConfig } from "./types.js";
import { validateOptionalEnvironment, validateRequiredEnvironment } from "./schema.js";

declare const process:
  | {
      readonly env: Record<string, string | undefined>;
    }
  | undefined;

export const CONFIG_PACKAGE_NAME = "@opportunity-os/config";
export const CONFIG_PACKAGE_SCOPE = "runtime-configuration";

export type ResolvedRuntimeConfig = ReturnType<typeof createRuntimeConfig>;

export function loadRuntimeConfig(environmentSource: Record<string, unknown> = getRuntimeEnvironmentSource()): RuntimeConfig {
  return createRuntimeConfig(
    validateRequiredEnvironment(environmentSource),
    validateOptionalEnvironment(environmentSource)
  );
}

export function createRuntimeConfig(
  requiredEnvironment: RequiredEnvironment,
  optionalEnvironment: OptionalEnvironment = {}
): RuntimeConfig {
  return {
    application: {
      appName: requiredEnvironment.APP_NAME,
      nodeEnv: requiredEnvironment.NODE_ENV,
      port: requiredEnvironment.PORT
    },
    services: {
      databaseUrl: requiredEnvironment.DATABASE_URL,
      redisUrl: requiredEnvironment.REDIS_URL
    },
    aiProviders: {
      openAiApiKey: requiredEnvironment.OPENAI_API_KEY,
      anthropicApiKey: requiredEnvironment.ANTHROPIC_API_KEY,
      openAiModel: requiredEnvironment.OPENAI_MODEL,
      anthropicModel: requiredEnvironment.ANTHROPIC_MODEL
    },
    authentication: {
      jwtSecret: requiredEnvironment.JWT_SECRET,
      jwtExpiresIn: requiredEnvironment.JWT_EXPIRES_IN
    },
    observability: {
      logLevel: requiredEnvironment.LOG_LEVEL,
      otelExporterEndpoint: requiredEnvironment.OTEL_EXPORTER_ENDPOINT
    },
    optionalIntegrations: createOptionalIntegrationConfig(optionalEnvironment)
  };
}

function createOptionalIntegrationConfig(optionalEnvironment: OptionalEnvironment): OptionalIntegrationConfig {
  return {
    ...(optionalEnvironment.SENTRY_DSN === undefined ? {} : { sentryDsn: optionalEnvironment.SENTRY_DSN }),
    ...(optionalEnvironment.LANGFUSE_API_KEY === undefined ? {} : { langfuseApiKey: optionalEnvironment.LANGFUSE_API_KEY }),
    ...(optionalEnvironment.LANGSMITH_API_KEY === undefined ? {} : { langsmithApiKey: optionalEnvironment.LANGSMITH_API_KEY })
  };
}

function getRuntimeEnvironmentSource(): Record<string, unknown> {
  if (typeof process === "undefined") {
    return {};
  }

  return process.env;
}
