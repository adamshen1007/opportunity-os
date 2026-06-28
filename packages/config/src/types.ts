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
