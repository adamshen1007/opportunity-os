import { describe, expect, expectTypeOf, it } from "vitest";

import {
  createFixedLoggerClock,
  createInMemoryLoggerDestination,
  createLoggerConfig,
  createPinoLogger,
  LOG_LEVELS,
  normalizeLogError,
  normalizeLogEntry,
  PINO_LOG_LEVELS,
  type LoggerChildContext,
  type SafeLogEntry,
  type SafeLogError,
  type StructuredLogger
} from "../index.js";

describe("logging stability", () => {
  it("keeps workspace logging exports available from the shared root", () => {
    expect(LOG_LEVELS).toEqual({
      debug: "debug",
      info: "info",
      warn: "warn",
      error: "error"
    });
    expect(PINO_LOG_LEVELS).toEqual(LOG_LEVELS);
    expect(typeof createPinoLogger).toBe("function");
    expect(typeof createLoggerConfig).toBe("function");
    expect(typeof createInMemoryLoggerDestination).toBe("function");
    expect(typeof createFixedLoggerClock).toBe("function");
    expect(typeof normalizeLogEntry).toBe("function");
    expect(typeof normalizeLogError).toBe("function");
    expectTypeOf<StructuredLogger>().toHaveProperty("child");
    expectTypeOf<LoggerChildContext>().toMatchTypeOf<{
      readonly correlationId?: string;
      readonly requestId?: string;
      readonly context?: Record<string, unknown>;
    }>();
  });

  it("keeps the safe log entry schema stable", () => {
    const safeEntry = normalizeLogEntry({
      timestamp: "2026-06-29T00:00:00.000Z",
      service: "shared-test",
      environment: "test",
      severity: LOG_LEVELS.info,
      correlationId: "correlation-1",
      requestId: "request-1",
      eventName: "shared.logging.schema_stability",
      message: "schema checked",
      context: {
        apiKey: "raw-api-key"
      }
    });

    expect(Object.keys(safeEntry).toSorted()).toEqual([
      "context",
      "correlationId",
      "environment",
      "eventName",
      "message",
      "requestId",
      "service",
      "severity",
      "timestamp"
    ]);
    expect(safeEntry).toEqual({
      timestamp: "2026-06-29T00:00:00.000Z",
      service: "shared-test",
      environment: "test",
      severity: "info",
      correlationId: "correlation-1",
      requestId: "request-1",
      eventName: "shared.logging.schema_stability",
      message: "schema checked",
      context: {
        apiKey: "[REDACTED]"
      }
    } satisfies SafeLogEntry);
  });

  it("keeps the safe error schema stack-free and secret-safe", () => {
    const safeError = normalizeLogError(
      new Error("authorization=raw-auth password=raw-password")
    );

    expect(Object.keys(safeError).toSorted()).toEqual(["message", "name"]);
    expect(safeError).toEqual({
      name: "Error",
      message: "authorization=[REDACTED] password=[REDACTED]"
    } satisfies SafeLogError);
    expect(JSON.stringify(safeError)).not.toContain("raw-auth");
    expect(JSON.stringify(safeError)).not.toContain("raw-password");
    expect(JSON.stringify(safeError)).not.toContain("stack");
  });

  it("keeps the workspace logger build path operational", () => {
    const destination = createInMemoryLoggerDestination();
    const logger = createPinoLogger({
      config: createLoggerConfig({
        service: "shared-test",
        environment: "test",
        logLevel: LOG_LEVELS.debug
      }),
      destination,
      clock: createFixedLoggerClock("2026-06-29T00:00:00.000Z")
    });

    logger.child({ correlationId: "correlation-1" }).debug({
      eventName: "shared.logging.workspace_export",
      message: "workspace export checked"
    });

    const [line] = destination.read();

    expect(line).toContain("shared.logging.workspace_export");
    expect(line).toContain("correlation-1");
  });
});
