import { z } from "zod";

import { EnvironmentValidationError, type ConfigValidationIssue } from "./errors.js";
import type { OptionalEnvironment, RequiredEnvironment } from "./types.js";

export const REQUIRED_ENVIRONMENT_VARIABLES = [
  "APP_NAME",
  "NODE_ENV",
  "PORT",
  "DATABASE_URL",
  "REDIS_URL",
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "OPENAI_MODEL",
  "ANTHROPIC_MODEL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "LOG_LEVEL",
  "OTEL_EXPORTER_ENDPOINT"
] as const;

export const OPTIONAL_ENVIRONMENT_VARIABLES = [
  "SENTRY_DSN",
  "LANGFUSE_API_KEY",
  "LANGSMITH_API_KEY",
  "OPPORTUNITY_OS_API_URL",
  "OPPORTUNITY_OS_WEB_URL",
  "NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL",
  "API_PERSISTENCE_MODE",
  "API_LIVE_SCAN_ACCESS_TOKEN",
  "LLM_PROVIDER",
  "LLM_MODEL",
  "LLM_LIVE_ANALYSIS_ENABLED",
  "LLM_PROVIDER_TIMEOUT_MS",
  "GEMINI_API_KEY",
  "GEMINI_MODEL",
  "STACK_EXCHANGE_LIVE_SCAN_ENABLED",
  "STACK_EXCHANGE_API_BASE_URL",
  "STACK_EXCHANGE_DEFAULT_SITE",
  "STACK_EXCHANGE_API_KEY",
  "STACK_EXCHANGE_TIMEOUT_MS",
  "STACK_EXCHANGE_QUERY"
] as const;

export type RequiredEnvironmentVariable = (typeof REQUIRED_ENVIRONMENT_VARIABLES)[number];
export type OptionalEnvironmentVariable = (typeof OPTIONAL_ENVIRONMENT_VARIABLES)[number];
export type EnvironmentVariableName = RequiredEnvironmentVariable | OptionalEnvironmentVariable;

export const DEFAULT_ENVIRONMENT_VALUES = {
  NODE_ENV: "local",
  PORT: 3000,
  LOG_LEVEL: "info"
} as const;

const runtimeEnvironmentSchema = z.enum(["local", "development", "staging", "production"]);
const logLevelSchema = z.enum(["trace", "debug", "info", "warn", "error", "fatal"]);
const llmProviderSchema = z.enum(["openai", "anthropic", "gemini"]);
const booleanStringSchema = z.enum(["true", "false"]);
const persistenceModeSchema = z.enum(["memory", "database"]);

const nonEmptyStringSchema = z.string().trim().min(1);
const urlStringSchema = nonEmptyStringSchema.url();

export const requiredEnvironmentSchema = z.object({
  APP_NAME: nonEmptyStringSchema,
  NODE_ENV: runtimeEnvironmentSchema.default(DEFAULT_ENVIRONMENT_VALUES.NODE_ENV),
  PORT: z.coerce.number().int().min(1).max(65535).default(DEFAULT_ENVIRONMENT_VALUES.PORT),
  DATABASE_URL: urlStringSchema,
  REDIS_URL: urlStringSchema,
  OPENAI_API_KEY: nonEmptyStringSchema,
  ANTHROPIC_API_KEY: nonEmptyStringSchema,
  OPENAI_MODEL: nonEmptyStringSchema,
  ANTHROPIC_MODEL: nonEmptyStringSchema,
  JWT_SECRET: nonEmptyStringSchema,
  JWT_EXPIRES_IN: nonEmptyStringSchema,
  LOG_LEVEL: logLevelSchema.default(DEFAULT_ENVIRONMENT_VALUES.LOG_LEVEL),
  OTEL_EXPORTER_ENDPOINT: urlStringSchema
});

export const optionalEnvironmentSchema = z.object({
  SENTRY_DSN: urlStringSchema.optional(),
  LANGFUSE_API_KEY: nonEmptyStringSchema.optional(),
  LANGSMITH_API_KEY: nonEmptyStringSchema.optional(),
  OPPORTUNITY_OS_API_URL: urlStringSchema.optional(),
  OPPORTUNITY_OS_WEB_URL: urlStringSchema.optional(),
  NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL: urlStringSchema.optional(),
  API_PERSISTENCE_MODE: persistenceModeSchema.optional(),
  API_LIVE_SCAN_ACCESS_TOKEN: nonEmptyStringSchema.optional(),
  LLM_PROVIDER: llmProviderSchema.optional(),
  LLM_MODEL: nonEmptyStringSchema.optional(),
  LLM_LIVE_ANALYSIS_ENABLED: booleanStringSchema.optional(),
  LLM_PROVIDER_TIMEOUT_MS: z.coerce.number().int().min(1).max(120000).optional(),
  GEMINI_API_KEY: nonEmptyStringSchema.optional(),
  GEMINI_MODEL: nonEmptyStringSchema.optional(),
  STACK_EXCHANGE_LIVE_SCAN_ENABLED: booleanStringSchema.optional(),
  STACK_EXCHANGE_API_BASE_URL: urlStringSchema.optional(),
  STACK_EXCHANGE_DEFAULT_SITE: nonEmptyStringSchema.optional(),
  STACK_EXCHANGE_API_KEY: nonEmptyStringSchema.optional(),
  STACK_EXCHANGE_TIMEOUT_MS: z.coerce.number().int().min(1000).max(30000).optional(),
  STACK_EXCHANGE_QUERY: nonEmptyStringSchema.optional()
});

export function validateRequiredEnvironment(input: Record<string, unknown>): RequiredEnvironment {
  const result = requiredEnvironmentSchema.safeParse(input);

  if (!result.success) {
    throw new EnvironmentValidationError(formatEnvironmentIssues(result.error.issues));
  }

  return result.data;
}

export function validateOptionalEnvironment(input: Record<string, unknown>): OptionalEnvironment {
  const result = optionalEnvironmentSchema.safeParse(input);

  if (!result.success) {
    throw new EnvironmentValidationError(formatEnvironmentIssues(result.error.issues));
  }

  return result.data;
}

function formatEnvironmentIssues(issues: readonly z.ZodIssue[]): ConfigValidationIssue[] {
  return issues.map((issue) => {
    const variableName = getIssueVariableName(issue);
    return {
      code: "CONFIG_REQUIRED_ENVIRONMENT_INVALID",
      variableName,
      message: getIssueMessage(variableName, issue)
    };
  });
}

function getIssueVariableName(issue: z.ZodIssue): EnvironmentVariableName {
  const candidate = String(issue.path[0] ?? "UNKNOWN");

  if (REQUIRED_ENVIRONMENT_VARIABLES.includes(candidate as RequiredEnvironmentVariable)) {
    return candidate as RequiredEnvironmentVariable;
  }

  if (OPTIONAL_ENVIRONMENT_VARIABLES.includes(candidate as OptionalEnvironmentVariable)) {
    return candidate as OptionalEnvironmentVariable;
  }

  return "APP_NAME";
}

function getIssueMessage(variableName: EnvironmentVariableName, issue: z.ZodIssue): string {
  if (issue.code === "invalid_type") {
    return `${variableName} is required`;
  }

  if (variableName === "NODE_ENV") {
    return "NODE_ENV must be one of: local, development, staging, production";
  }

  if (variableName === "LOG_LEVEL") {
    return "LOG_LEVEL must be one of: trace, debug, info, warn, error, fatal";
  }

  if (variableName === "PORT") {
    return "PORT must be an integer between 1 and 65535";
  }

  if (variableName === "DATABASE_URL" || variableName === "REDIS_URL" || variableName === "OTEL_EXPORTER_ENDPOINT") {
    return `${variableName} must be a valid URL`;
  }

  if (variableName === "SENTRY_DSN") {
    return "SENTRY_DSN must be a valid URL";
  }

  if (
    variableName === "OPPORTUNITY_OS_API_URL" ||
    variableName === "OPPORTUNITY_OS_WEB_URL" ||
    variableName === "NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL"
  ) {
    return `${variableName} must be a valid URL`;
  }

  if (variableName === "LLM_PROVIDER") {
    return "LLM_PROVIDER must be one of: openai, anthropic, gemini";
  }

  if (variableName === "LLM_LIVE_ANALYSIS_ENABLED") {
    return "LLM_LIVE_ANALYSIS_ENABLED must be one of: true, false";
  }

  if (variableName === "LLM_PROVIDER_TIMEOUT_MS") {
    return "LLM_PROVIDER_TIMEOUT_MS must be an integer between 1 and 120000";
  }

  return `${variableName} must be a non-empty string`;
}
