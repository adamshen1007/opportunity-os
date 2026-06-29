import { describe, expect, expectTypeOf, it } from "vitest";

import {
  createFixedLoggerClock,
  createLoggerConfig,
  LOG_LEVELS,
  PINO_LOG_LEVELS,
  toPinoLogLevel,
  type LogEntry,
  type Logger,
  type LoggerConfig,
  type LoggerFactory,
  type LogLevel,
  type PinoLogLevel,
  type StructuredLogger
} from "../index.js";

describe("logging contracts", () => {
  it("defines stable log levels for structured logging", () => {
    expect(LOG_LEVELS).toEqual({
      debug: "debug",
      info: "info",
      warn: "warn",
      error: "error"
    });
  });

  it("requires the canonical structured log entry fields", () => {
    const entry = {
      timestamp: "2026-06-29T00:00:00.000Z",
      service: "shared-test",
      environment: "test",
      severity: LOG_LEVELS.info,
      correlationId: "correlation-1",
      requestId: "request-1",
      eventName: "shared.logging.contract.checked",
      message: "Logging contract checked"
    } satisfies LogEntry;

    expect(entry).toEqual({
      timestamp: "2026-06-29T00:00:00.000Z",
      service: "shared-test",
      environment: "test",
      severity: "info",
      correlationId: "correlation-1",
      requestId: "request-1",
      eventName: "shared.logging.contract.checked",
      message: "Logging contract checked"
    });
  });

  it("supports future structured logger implementations as types only", () => {
    expectTypeOf<LogLevel>().toEqualTypeOf<
      "debug" | "info" | "warn" | "error"
    >();
    expectTypeOf<PinoLogLevel>().toEqualTypeOf<
      "debug" | "info" | "warn" | "error"
    >();
    expectTypeOf<Logger["log"]>().parameters.toEqualTypeOf<[LogEntry]>();
    expectTypeOf<StructuredLogger>().toHaveProperty("debug");
    expectTypeOf<StructuredLogger>().toHaveProperty("info");
    expectTypeOf<StructuredLogger>().toHaveProperty("warn");
    expectTypeOf<StructuredLogger>().toHaveProperty("error");
    expectTypeOf<LoggerFactory>().returns.toEqualTypeOf<StructuredLogger>();
  });

  it("creates reusable logger configuration without reading process env", () => {
    const config = createLoggerConfig({
      service: "shared-test",
      environment: "test",
      logLevel: LOG_LEVELS.info,
      baseContext: {
        release: "local"
      }
    });

    expect(config).toEqual({
      service: "shared-test",
      environment: "test",
      logLevel: "info",
      pinoLevel: "info",
      baseContext: {
        release: "local"
      }
    } satisfies LoggerConfig);
  });

  it("maps supported log levels to Pino levels deterministically", () => {
    expect(PINO_LOG_LEVELS).toEqual({
      debug: "debug",
      info: "info",
      warn: "warn",
      error: "error"
    });
    expect(toPinoLogLevel(LOG_LEVELS.debug)).toBe("debug");
    expect(toPinoLogLevel(LOG_LEVELS.info)).toBe("info");
    expect(toPinoLogLevel(LOG_LEVELS.warn)).toBe("warn");
    expect(toPinoLogLevel(LOG_LEVELS.error)).toBe("error");
    expect(() => toPinoLogLevel("trace")).toThrow(
      "Unsupported log level: trace"
    );
  });

  it("supports deterministic injectable logger clocks", () => {
    const clock = createFixedLoggerClock("2026-06-29T00:00:00.000Z");

    expect(clock.nowIso()).toBe("2026-06-29T00:00:00.000Z");
    expect(clock.nowIso()).toBe("2026-06-29T00:00:00.000Z");
    expect(() => createFixedLoggerClock("not-a-date")).toThrow(
      "Logger clock requires a valid timestamp"
    );
  });
});
