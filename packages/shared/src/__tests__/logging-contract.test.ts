import { describe, expect, expectTypeOf, it } from "vitest";

import {
  LOG_LEVELS,
  type LogEntry,
  type Logger,
  type LoggerFactory,
  type LogLevel,
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
    expectTypeOf<Logger["log"]>().parameters.toEqualTypeOf<[LogEntry]>();
    expectTypeOf<StructuredLogger>().toHaveProperty("debug");
    expectTypeOf<StructuredLogger>().toHaveProperty("info");
    expectTypeOf<StructuredLogger>().toHaveProperty("warn");
    expectTypeOf<StructuredLogger>().toHaveProperty("error");
    expectTypeOf<LoggerFactory>().returns.toEqualTypeOf<StructuredLogger>();
  });
});
