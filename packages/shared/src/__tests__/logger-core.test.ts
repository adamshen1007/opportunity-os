import {
  ERROR_CATEGORIES,
  ERROR_CODES,
  OpportunityError
} from "@opportunity-os/errors";
import { describe, expect, it } from "vitest";

import {
  createFixedLoggerClock,
  createInMemoryLoggerDestination,
  createLoggerConfig,
  createPinoLogger,
  LOG_LEVELS,
  normalizeLogEntry
} from "../index.js";

const loggerConfig = createLoggerConfig({
  service: "shared-test",
  environment: "test",
  logLevel: LOG_LEVELS.debug,
  baseContext: {
    release: "local",
    authorization: "Bearer raw-base-auth"
  }
});

describe("logger core", () => {
  it("normalizes log entries without leaking secret-like values", () => {
    const safeEntry = normalizeLogEntry(
      {
        timestamp: "2026-06-29T00:00:00.000Z",
        service: "shared-test",
        environment: "test",
        severity: LOG_LEVELS.info,
        correlationId: "correlation-1",
        requestId: "request-1",
        eventName: "shared.logger.normalized",
        message:
          "providerKey=provider-secret token=raw-token dsn=postgres://user:pass@example.test/db",
        context: {
          apiKey: "raw-api-key",
          password: "raw-password",
          authHeader: "Bearer raw-auth",
          nested: {
            token: "raw-nested-token",
            note: "plain note"
          }
        }
      },
      {
        base: "value"
      }
    );

    expect(safeEntry).toEqual({
      timestamp: "2026-06-29T00:00:00.000Z",
      service: "shared-test",
      environment: "test",
      severity: "info",
      correlationId: "correlation-1",
      requestId: "request-1",
      eventName: "shared.logger.normalized",
      message:
        "providerKey=[REDACTED] token=[REDACTED] dsn=[REDACTED]",
      context: {
        base: "value",
        apiKey: "[REDACTED]",
        password: "[REDACTED]",
        authHeader: "[REDACTED]",
        nested: {
          token: "[REDACTED]",
          note: "plain note"
        }
      }
    });

    expect(JSON.stringify(safeEntry)).not.toContain("provider-secret");
    expect(JSON.stringify(safeEntry)).not.toContain("raw-token");
    expect(JSON.stringify(safeEntry)).not.toContain("raw-api-key");
    expect(JSON.stringify(safeEntry)).not.toContain("raw-password");
    expect(JSON.stringify(safeEntry)).not.toContain("raw-auth");
    expect(JSON.stringify(safeEntry)).not.toContain("raw-nested-token");
    expect(JSON.stringify(safeEntry)).not.toContain("user:pass");
  });

  it("writes deterministic Pino logs to an injectable destination", () => {
    const destination = createInMemoryLoggerDestination();
    const logger = createPinoLogger({
      config: loggerConfig,
      destination,
      clock: createFixedLoggerClock("2026-06-29T00:00:00.000Z")
    });

    logger.info({
      service: "shared-test",
      environment: "test",
      correlationId: "correlation-1",
      requestId: "request-1",
      eventName: "shared.logger.created",
      message: "Created logger with password=raw-password",
      context: {
        token: "raw-token",
        safe: "visible"
      }
    });

    const [line] = destination.read();
    const parsed = JSON.parse(line ?? "{}") as Record<string, unknown>;

    expect(destination.read()).toHaveLength(1);
    expect(parsed).toMatchObject({
      level: 30,
      timestamp: "2026-06-29T00:00:00.000Z",
      service: "shared-test",
      environment: "test",
      severity: "info",
      correlationId: "correlation-1",
      requestId: "request-1",
      eventName: "shared.logger.created",
      message: "Created logger with password=[REDACTED]",
      context: {
        release: "local",
        authorization: "[REDACTED]",
        token: "[REDACTED]",
        safe: "visible"
      }
    });
    expect(line).not.toContain("raw-password");
    expect(line).not.toContain("raw-token");
    expect(line).not.toContain("raw-base-auth");
  });

  it("does not use a singleton logger instance", () => {
    const firstDestination = createInMemoryLoggerDestination();
    const secondDestination = createInMemoryLoggerDestination();
    const firstLogger = createPinoLogger({
      config: loggerConfig,
      destination: firstDestination,
      clock: createFixedLoggerClock("2026-06-29T00:00:00.000Z")
    });
    const secondLogger = createPinoLogger({
      config: loggerConfig,
      destination: secondDestination,
      clock: createFixedLoggerClock("2026-06-29T00:00:01.000Z")
    });

    firstLogger.warn({
      service: "shared-test",
      environment: "test",
      correlationId: "correlation-1",
      requestId: "request-1",
      eventName: "shared.logger.first",
      message: "first"
    });
    secondLogger.error({
      service: "shared-test",
      environment: "test",
      correlationId: "correlation-2",
      requestId: "request-2",
      eventName: "shared.logger.second",
      message: "second"
    });

    expect(firstDestination.read()).toHaveLength(1);
    expect(secondDestination.read()).toHaveLength(1);
    expect(firstDestination.read()[0]).toContain("shared.logger.first");
    expect(secondDestination.read()[0]).toContain("shared.logger.second");
  });

  it("requires correlation IDs and allows request IDs to be omitted", () => {
    const destination = createInMemoryLoggerDestination();
    const logger = createPinoLogger({
      config: loggerConfig,
      destination,
      clock: createFixedLoggerClock("2026-06-29T00:00:00.000Z")
    });

    expect(() =>
      logger.info({
        eventName: "shared.logger.missing_correlation",
        message: "missing correlation"
      })
    ).toThrow("Logger requires a correlationId");

    logger.info({
      correlationId: "correlation-only",
      eventName: "shared.logger.optional_request",
      message: "request ID omitted"
    });

    const [line] = destination.read();
    const parsed = JSON.parse(line ?? "{}") as Record<string, unknown>;

    expect(parsed.correlationId).toBe("correlation-only");
    expect(parsed).not.toHaveProperty("requestId");
  });

  it("creates immutable child loggers that inherit parent context", () => {
    const destination = createInMemoryLoggerDestination();
    const logger = createPinoLogger({
      config: loggerConfig,
      destination,
      clock: createFixedLoggerClock("2026-06-29T00:00:00.000Z")
    });
    const childContext: Record<string, unknown> = {
      tenant: "tenant-1"
    };
    const childLogger = logger.child({
      correlationId: "child-correlation",
      requestId: "child-request",
      context: childContext
    });

    childContext.tenant = "mutated";

    childLogger.debug({
      eventName: "shared.logger.child",
      message: "child logger",
      context: {
        operation: "test"
      }
    });

    const [line] = destination.read();
    const parsed = JSON.parse(line ?? "{}") as Record<string, unknown>;

    expect(parsed).toMatchObject({
      correlationId: "child-correlation",
      requestId: "child-request",
      eventName: "shared.logger.child",
      context: {
        release: "local",
        authorization: "[REDACTED]",
        tenant: "tenant-1",
        operation: "test"
      }
    });
    expect(line).not.toContain("mutated");
    expect(line).not.toContain("raw-base-auth");
  });

  it("normalizes OpportunityError values without leaking secrets or stacks", () => {
    const destination = createInMemoryLoggerDestination();
    const logger = createPinoLogger({
      config: loggerConfig,
      destination,
      clock: createFixedLoggerClock("2026-06-29T00:00:00.000Z")
    });

    logger.error({
      correlationId: "correlation-1",
      eventName: "shared.logger.opportunity_error",
      message: "OpportunityError captured",
      error: new OpportunityError({
        code: ERROR_CODES.infrastructureUnavailable,
        category: ERROR_CATEGORIES.infrastructure,
        message: "providerKey=raw-provider-key token=raw-token",
        correlationId: "error-correlation",
        requestId: "error-request"
      })
    });

    const [line] = destination.read();
    const parsed = JSON.parse(line ?? "{}") as {
      readonly context?: {
        readonly error?: Record<string, unknown>;
      };
    };

    expect(parsed.context?.error).toEqual({
      name: "OpportunityError",
      message: "[REDACTED] [REDACTED]",
      code: "INFRASTRUCTURE_UNAVAILABLE",
      category: "infrastructure",
      correlationId: "error-correlation",
      requestId: "error-request"
    });
    expect(line).not.toContain("raw-provider-key");
    expect(line).not.toContain("raw-token");
    expect(line).not.toContain("stack");
    expect(line).not.toContain("cause");
  });

  it("normalizes unknown Error values without leaking secrets or stacks", () => {
    const destination = createInMemoryLoggerDestination();
    const logger = createPinoLogger({
      config: loggerConfig,
      destination,
      clock: createFixedLoggerClock("2026-06-29T00:00:00.000Z")
    });

    logger.error({
      correlationId: "correlation-1",
      eventName: "shared.logger.unknown_error",
      message: "Unknown error captured",
      error: new Error("password=raw-password dsn=postgres://user:pass@test/db")
    });

    const [line] = destination.read();
    const parsed = JSON.parse(line ?? "{}") as {
      readonly context?: {
        readonly error?: Record<string, unknown>;
      };
    };

    expect(parsed.context?.error).toEqual({
      name: "Error",
      message: "password=[REDACTED] dsn=[REDACTED]"
    });
    expect(line).not.toContain("raw-password");
    expect(line).not.toContain("user:pass");
    expect(line).not.toContain("stack");
    expect(line).not.toContain("cause");
  });
});
