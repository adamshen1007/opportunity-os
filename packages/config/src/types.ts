export type RuntimeEnvironment = "local" | "development" | "staging" | "production";
export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export interface RequiredEnvironment {
  readonly APP_NAME: string;
  readonly NODE_ENV: RuntimeEnvironment;
  readonly PORT: number;
  readonly DATABASE_URL: string;
  readonly REDIS_URL: string;
  readonly OPENAI_API_KEY: string;
  readonly ANTHROPIC_API_KEY: string;
  readonly OPENAI_MODEL: string;
  readonly ANTHROPIC_MODEL: string;
  readonly JWT_SECRET: string;
  readonly JWT_EXPIRES_IN: string;
  readonly LOG_LEVEL: LogLevel;
  readonly OTEL_EXPORTER_ENDPOINT: string;
}

export interface OptionalEnvironment {
  readonly SENTRY_DSN?: string;
  readonly LANGFUSE_API_KEY?: string;
  readonly LANGSMITH_API_KEY?: string;
  readonly OPPORTUNITY_OS_API_URL?: string;
  readonly OPPORTUNITY_OS_WEB_URL?: string;
  readonly NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL?: string;
  readonly API_PERSISTENCE_MODE?: "memory" | "database";
  readonly API_LIVE_SCAN_ACCESS_TOKEN?: string;
  readonly LLM_PROVIDER?: "openai" | "anthropic" | "gemini";
  readonly LLM_MODEL?: string;
  readonly LLM_LIVE_ANALYSIS_ENABLED?: "true" | "false";
  readonly LLM_PROVIDER_TIMEOUT_MS?: number;
  readonly GEMINI_API_KEY?: string;
  readonly GEMINI_MODEL?: string;
  readonly STACK_EXCHANGE_LIVE_SCAN_ENABLED?: "true" | "false";
  readonly STACK_EXCHANGE_API_BASE_URL?: string;
  readonly STACK_EXCHANGE_DEFAULT_SITE?: string;
  readonly STACK_EXCHANGE_API_KEY?: string;
  readonly STACK_EXCHANGE_TIMEOUT_MS?: number;
  readonly STACK_EXCHANGE_QUERY?: string;
}

export interface DefaultEnvironmentValues {
  readonly NODE_ENV: RuntimeEnvironment;
  readonly PORT: number;
  readonly LOG_LEVEL: LogLevel;
}

export interface ApplicationConfig {
  readonly appName: string;
  readonly nodeEnv: RuntimeEnvironment;
  readonly port: number;
}

export interface ServiceConfig {
  readonly databaseUrl: string;
  readonly redisUrl: string;
}

export interface AiProviderConfig {
  readonly openAiApiKey: string;
  readonly anthropicApiKey: string;
  readonly openAiModel: string;
  readonly anthropicModel: string;
}

export interface AuthenticationConfig {
  readonly jwtSecret: string;
  readonly jwtExpiresIn: string;
}

export interface ObservabilityConfig {
  readonly logLevel: LogLevel;
  readonly otelExporterEndpoint: string;
}

export interface OptionalIntegrationConfig {
  readonly sentryDsn?: string;
  readonly langfuseApiKey?: string;
  readonly langsmithApiKey?: string;
  readonly apiUrl?: string;
  readonly webUrl?: string;
  readonly publicApiBaseUrl?: string;
  readonly apiPersistenceMode?: "memory" | "database";
  readonly apiLiveScanAccessToken?: string;
  readonly llmProvider?: "openai" | "anthropic" | "gemini";
  readonly llmModel?: string;
  readonly liveLlmAnalysisEnabled?: boolean;
  readonly llmProviderTimeoutMs?: number;
  readonly geminiApiKey?: string;
  readonly geminiModel?: string;
  readonly stackExchangeLiveScanEnabled?: boolean;
  readonly stackExchangeApiBaseUrl?: string;
  readonly stackExchangeDefaultSite?: string;
  readonly stackExchangeApiKey?: string;
  readonly stackExchangeTimeoutMs?: number;
  readonly stackExchangeQuery?: string;
}

export interface RuntimeConfig {
  readonly application: ApplicationConfig;
  readonly services: ServiceConfig;
  readonly aiProviders: AiProviderConfig;
  readonly authentication: AuthenticationConfig;
  readonly observability: ObservabilityConfig;
  readonly optionalIntegrations: OptionalIntegrationConfig;
}

export type RuntimeConfigGroup = keyof RuntimeConfig;
