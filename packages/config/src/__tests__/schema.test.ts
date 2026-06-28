import { describe, expect, it } from "vitest";

import {
  DEFAULT_ENVIRONMENT_VALUES,
  OPTIONAL_ENVIRONMENT_VARIABLES,
  REQUIRED_ENVIRONMENT_VARIABLES,
  validateOptionalEnvironment,
  validateRequiredEnvironment
} from "../schema.js";

const validRequiredEnvironment = {
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

describe("environment variable contract", () => {
  it("lists the required environment variables deterministically", () => {
    expect(REQUIRED_ENVIRONMENT_VARIABLES).toEqual([
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
    ]);
  });

  it("lists the optional environment variables deterministically", () => {
    expect(OPTIONAL_ENVIRONMENT_VARIABLES).toEqual([
      "SENTRY_DSN",
      "LANGFUSE_API_KEY",
      "LANGSMITH_API_KEY"
    ]);
  });

  it("validates required environment values without reading a real .env file", () => {
    expect(validateRequiredEnvironment(validRequiredEnvironment)).toEqual({
      ...validRequiredEnvironment,
      PORT: 3000
    });
  });

  it("documents safe default environment values", () => {
    expect(DEFAULT_ENVIRONMENT_VALUES).toEqual({
      NODE_ENV: "local",
      PORT: 3000,
      LOG_LEVEL: "info"
    });
  });

  it("applies defaults only to safe operational values", () => {
    const {
      NODE_ENV: _nodeEnv,
      PORT: _port,
      LOG_LEVEL: _logLevel,
      ...environmentWithoutSafeDefaults
    } = validRequiredEnvironment;

    expect(validateRequiredEnvironment(environmentWithoutSafeDefaults)).toEqual({
      ...environmentWithoutSafeDefaults,
      NODE_ENV: "local",
      PORT: 3000,
      LOG_LEVEL: "info"
    });
  });

  it("fails when required values are missing", () => {
    const { APP_NAME: _appName, ...environmentWithoutAppName } = validRequiredEnvironment;

    expect(() => validateRequiredEnvironment(environmentWithoutAppName)).toThrow(
      "APP_NAME: APP_NAME is required"
    );
  });

  it("fails with clear messages for invalid required values", () => {
    expect(() =>
      validateRequiredEnvironment({
        ...validRequiredEnvironment,
        NODE_ENV: "preview",
        PORT: "not-a-port",
        DATABASE_URL: "not-a-url",
        LOG_LEVEL: "verbose"
      })
    ).toThrow(
      "NODE_ENV: NODE_ENV must be one of: local, development, staging, production"
    );
  });

  it("accepts only documented runtime environments", () => {
    for (const nodeEnv of ["local", "development", "staging", "production"]) {
      expect(validateRequiredEnvironment({ ...validRequiredEnvironment, NODE_ENV: nodeEnv }).NODE_ENV).toBe(nodeEnv);
    }

    expect(() => validateRequiredEnvironment({ ...validRequiredEnvironment, NODE_ENV: "preview" })).toThrow(
      "NODE_ENV: NODE_ENV must be one of: local, development, staging, production"
    );
  });

  it("parses PORT into a number and rejects invalid ports", () => {
    expect(validateRequiredEnvironment({ ...validRequiredEnvironment, PORT: "8080" }).PORT).toBe(8080);

    expect(() => validateRequiredEnvironment({ ...validRequiredEnvironment, PORT: "0" })).toThrow(
      "PORT: PORT must be an integer between 1 and 65535"
    );
    expect(() => validateRequiredEnvironment({ ...validRequiredEnvironment, PORT: "65536" })).toThrow(
      "PORT: PORT must be an integer between 1 and 65535"
    );
  });

  it("accepts only approved severity values for LOG_LEVEL", () => {
    for (const logLevel of ["trace", "debug", "info", "warn", "error", "fatal"]) {
      expect(validateRequiredEnvironment({ ...validRequiredEnvironment, LOG_LEVEL: logLevel }).LOG_LEVEL).toBe(logLevel);
    }

    expect(() => validateRequiredEnvironment({ ...validRequiredEnvironment, LOG_LEVEL: "verbose" })).toThrow(
      "LOG_LEVEL: LOG_LEVEL must be one of: trace, debug, info, warn, error, fatal"
    );
  });

  it("does not apply defaults for required secrets", () => {
    const {
      OPENAI_API_KEY: _openAiApiKey,
      ANTHROPIC_API_KEY: _anthropicApiKey,
      JWT_SECRET: _jwtSecret,
      ...environmentWithoutSecrets
    } = validRequiredEnvironment;

    expect(() => validateRequiredEnvironment(environmentWithoutSecrets)).toThrow(
      "OPENAI_API_KEY: OPENAI_API_KEY is required"
    );
  });

  it("does not include secret values in validation errors", () => {
    const secretValue = "sk-secret-value-that-must-not-leak";

    try {
      validateRequiredEnvironment({
        ...validRequiredEnvironment,
        OPENAI_API_KEY: "",
        ANTHROPIC_API_KEY: secretValue,
        JWT_SECRET: ""
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain("OPENAI_API_KEY");
      expect((error as Error).message).toContain("JWT_SECRET");
      expect((error as Error).message).not.toContain(secretValue);
      return;
    }

    throw new Error("Expected environment validation to fail");
  });

  it("allows optional environment values to be omitted", () => {
    expect(validateOptionalEnvironment({})).toEqual({});
  });

  it("validates present optional environment values", () => {
    expect(
      validateOptionalEnvironment({
        SENTRY_DSN: "https://example.sentry.io/123",
        LANGFUSE_API_KEY: "langfuse-secret-value",
        LANGSMITH_API_KEY: "langsmith-secret-value"
      })
    ).toEqual({
      SENTRY_DSN: "https://example.sentry.io/123",
      LANGFUSE_API_KEY: "langfuse-secret-value",
      LANGSMITH_API_KEY: "langsmith-secret-value"
    });
  });

  it("fails when present optional environment values are invalid", () => {
    expect(() =>
      validateOptionalEnvironment({
        SENTRY_DSN: "not-a-url",
        LANGFUSE_API_KEY: "",
        LANGSMITH_API_KEY: ""
      })
    ).toThrow("SENTRY_DSN: SENTRY_DSN must be a valid URL");
  });

  it("does not include optional secret-like values in validation errors", () => {
    const secretValue = "langfuse-secret-value-that-must-not-leak";

    try {
      validateOptionalEnvironment({
        LANGFUSE_API_KEY: "",
        LANGSMITH_API_KEY: secretValue,
        SENTRY_DSN: "not-a-url"
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain("LANGFUSE_API_KEY");
      expect((error as Error).message).toContain("SENTRY_DSN");
      expect((error as Error).message).not.toContain(secretValue);
      return;
    }

    throw new Error("Expected optional environment validation to fail");
  });
});
