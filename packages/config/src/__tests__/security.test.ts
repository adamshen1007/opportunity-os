import { describe, expect, it } from "vitest";

import { loadRuntimeConfig } from "../config.js";
import { EnvironmentValidationError } from "../errors.js";

const validEnvironment = {
  APP_NAME: "opportunity-os",
  NODE_ENV: "local",
  PORT: "3000",
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
} as const;

describe("configuration error security", () => {
  it("includes variable names and reason codes for invalid configuration", () => {
    const error = captureEnvironmentValidationError({
      ...validEnvironment,
      APP_NAME: "",
      PORT: "not-a-port"
    });

    expect(error.code).toBe("CONFIG_REQUIRED_ENVIRONMENT_INVALID");
    expect(error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "CONFIG_REQUIRED_ENVIRONMENT_INVALID",
          variableName: "APP_NAME"
        }),
        expect.objectContaining({
          code: "CONFIG_REQUIRED_ENVIRONMENT_INVALID",
          variableName: "PORT"
        })
      ])
    );
  });

  it("keeps error messages useful for local development and CI", () => {
    const error = captureEnvironmentValidationError({
      ...validEnvironment,
      NODE_ENV: "preview",
      LOG_LEVEL: "verbose"
    });

    expect(error.message).toContain("Invalid environment configuration");
    expect(error.message).toContain("NODE_ENV");
    expect(error.message).toContain("LOG_LEVEL");
    expect(error.message).toContain("must be one of");
  });

  it("does not include raw secret-like values in error messages", () => {
    const rawValues = [
      "openai-provider-key-that-must-not-leak",
      "anthropic-provider-key-that-must-not-leak",
      "jwt-secret-that-must-not-leak",
      "sentry-dsn-token-that-must-not-leak",
      "langfuse-token-that-must-not-leak",
      "langsmith-token-that-must-not-leak"
    ];

    const error = captureEnvironmentValidationError({
      ...validEnvironment,
      OPENAI_API_KEY: rawValues[0],
      ANTHROPIC_API_KEY: rawValues[1],
      JWT_SECRET: rawValues[2],
      SENTRY_DSN: rawValues[3],
      LANGFUSE_API_KEY: rawValues[4],
      LANGSMITH_API_KEY: rawValues[5]
    });

    expect(error.message).toContain("SENTRY_DSN");
    for (const rawValue of rawValues) {
      expect(error.message).not.toContain(rawValue);
    }
  });

  it("does not include raw secret-like values in structured issues", () => {
    const rawPassword = "postgres-password-that-must-not-leak";
    const rawToken = "otel-token-that-must-not-leak";
    const error = captureEnvironmentValidationError({
      ...validEnvironment,
      DATABASE_URL: `postgresql://user:${rawPassword}`,
      OTEL_EXPORTER_ENDPOINT: rawToken
    });

    const serializedIssues = JSON.stringify(error.issues);

    expect(serializedIssues).toContain("DATABASE_URL");
    expect(serializedIssues).toContain("OTEL_EXPORTER_ENDPOINT");
    expect(serializedIssues).not.toContain(rawPassword);
    expect(serializedIssues).not.toContain(rawToken);
  });
});

function captureEnvironmentValidationError(environment: Record<string, unknown>): EnvironmentValidationError {
  try {
    loadRuntimeConfig(environment);
  } catch (error) {
    expect(error).toBeInstanceOf(EnvironmentValidationError);
    return error as EnvironmentValidationError;
  }

  throw new Error("Expected environment validation to fail");
}
