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
    ...(optionalEnvironment.LANGSMITH_API_KEY === undefined ? {} : { langsmithApiKey: optionalEnvironment.LANGSMITH_API_KEY }),
    ...(optionalEnvironment.OPPORTUNITY_OS_API_URL === undefined ? {} : { apiUrl: optionalEnvironment.OPPORTUNITY_OS_API_URL }),
    ...(optionalEnvironment.OPPORTUNITY_OS_WEB_URL === undefined ? {} : { webUrl: optionalEnvironment.OPPORTUNITY_OS_WEB_URL }),
    ...(optionalEnvironment.OPPORTUNITY_OS_WEB_ORIGINS === undefined ? {} : { webOrigins: optionalEnvironment.OPPORTUNITY_OS_WEB_ORIGINS }),
    ...(optionalEnvironment.NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL === undefined
      ? {}
      : { publicApiBaseUrl: optionalEnvironment.NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL }),
    ...(optionalEnvironment.API_PERSISTENCE_MODE === undefined
      ? {}
      : { apiPersistenceMode: optionalEnvironment.API_PERSISTENCE_MODE }),
    ...(optionalEnvironment.API_LIVE_SCAN_ACCESS_TOKEN === undefined
      ? {}
      : { apiLiveScanAccessToken: optionalEnvironment.API_LIVE_SCAN_ACCESS_TOKEN }),
    ...(optionalEnvironment.API_AUTH_REQUIRED === undefined
      ? {}
      : { apiAuthRequired: optionalEnvironment.API_AUTH_REQUIRED === "true" }),
    ...(optionalEnvironment.API_ADMIN_ACCESS_TOKEN === undefined
      ? {}
      : { apiAdminAccessToken: optionalEnvironment.API_ADMIN_ACCESS_TOKEN }),
    ...(optionalEnvironment.LLM_PROVIDER === undefined ? {} : { llmProvider: optionalEnvironment.LLM_PROVIDER }),
    ...(optionalEnvironment.LLM_MODEL === undefined ? {} : { llmModel: optionalEnvironment.LLM_MODEL }),
    ...(optionalEnvironment.LLM_LIVE_ANALYSIS_ENABLED === undefined
      ? {}
      : { liveLlmAnalysisEnabled: optionalEnvironment.LLM_LIVE_ANALYSIS_ENABLED === "true" }),
    ...(optionalEnvironment.LLM_PROVIDER_TIMEOUT_MS === undefined
      ? {}
      : { llmProviderTimeoutMs: optionalEnvironment.LLM_PROVIDER_TIMEOUT_MS }),
    ...(optionalEnvironment.GEMINI_API_KEY === undefined ? {} : { geminiApiKey: optionalEnvironment.GEMINI_API_KEY }),
    ...(optionalEnvironment.GEMINI_MODEL === undefined ? {} : { geminiModel: optionalEnvironment.GEMINI_MODEL }),
    ...(optionalEnvironment.STACK_EXCHANGE_LIVE_SCAN_ENABLED === undefined
      ? {}
      : { stackExchangeLiveScanEnabled: optionalEnvironment.STACK_EXCHANGE_LIVE_SCAN_ENABLED === "true" }),
    ...(optionalEnvironment.STACK_EXCHANGE_API_BASE_URL === undefined
      ? {}
      : { stackExchangeApiBaseUrl: optionalEnvironment.STACK_EXCHANGE_API_BASE_URL }),
    ...(optionalEnvironment.STACK_EXCHANGE_DEFAULT_SITE === undefined
      ? {}
      : { stackExchangeDefaultSite: optionalEnvironment.STACK_EXCHANGE_DEFAULT_SITE }),
    ...(optionalEnvironment.STACK_EXCHANGE_API_KEY === undefined
      ? {}
      : { stackExchangeApiKey: optionalEnvironment.STACK_EXCHANGE_API_KEY }),
    ...(optionalEnvironment.STACK_EXCHANGE_TIMEOUT_MS === undefined
      ? {}
      : { stackExchangeTimeoutMs: optionalEnvironment.STACK_EXCHANGE_TIMEOUT_MS }),
    ...(optionalEnvironment.STACK_EXCHANGE_QUERY === undefined
      ? {}
      : { stackExchangeQuery: optionalEnvironment.STACK_EXCHANGE_QUERY })
  };
}

function getRuntimeEnvironmentSource(): Record<string, unknown> {
  if (typeof process === "undefined") {
    return {};
  }

  return process.env;
}
