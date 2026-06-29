import pino, { type DestinationStream, type LoggerOptions } from "pino";

import type { LogEntry, LogEntryContext } from "./log-entry.js";
import { type LoggerConfig } from "./logger-config.js";
import {
  createSystemLoggerClock,
  type LoggerClock
} from "./logger-clock.js";
import type { LoggerDestination } from "./logger-destination.js";
import {
  type LoggerChildContext,
  type LogInput,
  type StructuredLogger
} from "./logger.js";
import { LOG_LEVELS, type LogLevel } from "./log-level.js";
import { toPinoLogLevel } from "./pino-level.js";
import { normalizeLogEntry } from "./safe-log-entry.js";

export type PinoLoggerFactoryInput = {
  readonly config: LoggerConfig;
  readonly destination?: LoggerDestination;
  readonly clock?: LoggerClock;
};

export function createPinoLogger(
  input: PinoLoggerFactoryInput
): StructuredLogger {
  const clock = input.clock ?? createSystemLoggerClock();
  const pinoLogger = pino(createPinoOptions(input.config), input.destination);

  return createStructuredLogger({
    clock,
    config: input.config,
    inheritedContext: freezeLoggerChildContext({}),
    pinoLogger
  });
}

type StructuredLoggerInput = {
  readonly clock: LoggerClock;
  readonly config: LoggerConfig;
  readonly inheritedContext: NormalizedLoggerChildContext;
  readonly pinoLogger: pino.Logger;
};

type NormalizedLoggerChildContext = {
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly context: LogEntryContext;
};

type InternalLogEntry = Omit<LogEntry, "correlationId"> & {
  readonly correlationId?: string;
};

function createStructuredLogger(input: StructuredLoggerInput): StructuredLogger {
  const writeEntry = (entry: InternalLogEntry): void => {
    const mergedEntry = withInheritedContext(entry, input.inheritedContext);
    const safeEntry = normalizeLogEntry(mergedEntry, input.config.baseContext);

    input.pinoLogger[toPinoLogLevel(safeEntry.severity)](
      safeEntry,
      safeEntry.message
    );
  };

  const writeMethodEntry = (severity: LogLevel, entry: LogInput): void => {
    writeEntry({
      ...entry,
      environment: entry.environment ?? input.config.environment,
      service: entry.service ?? input.config.service,
      severity,
      timestamp: entry.timestamp ?? input.clock.nowIso()
    });
  };

  return {
    log: writeEntry,
    debug: (entry: LogInput) => writeMethodEntry(LOG_LEVELS.debug, entry),
    info: (entry: LogInput) => writeMethodEntry(LOG_LEVELS.info, entry),
    warn: (entry: LogInput) => writeMethodEntry(LOG_LEVELS.warn, entry),
    error: (entry: LogInput) => writeMethodEntry(LOG_LEVELS.error, entry),
    child: (context: LoggerChildContext) =>
      createStructuredLogger({
        ...input,
        inheritedContext: mergeLoggerChildContext(
          input.inheritedContext,
          context
        )
      })
  };
}

function withInheritedContext(
  entry: InternalLogEntry,
  inheritedContext: NormalizedLoggerChildContext
): LogEntry {
  const correlationId = entry.correlationId ?? inheritedContext.correlationId;

  if (correlationId === undefined || correlationId.length === 0) {
    throw new TypeError("Logger requires a correlationId");
  }

  return {
    ...entry,
    correlationId,
    ...(entry.requestId === undefined && inheritedContext.requestId !== undefined
      ? { requestId: inheritedContext.requestId }
      : {}),
    context: {
      ...inheritedContext.context,
      ...(entry.context ?? {})
    }
  };
}

function mergeLoggerChildContext(
  parentContext: NormalizedLoggerChildContext,
  childContext: LoggerChildContext
): NormalizedLoggerChildContext {
  return freezeLoggerChildContext({
    correlationId: childContext.correlationId ?? parentContext.correlationId,
    requestId: childContext.requestId ?? parentContext.requestId,
    context: {
      ...parentContext.context,
      ...(childContext.context ?? {})
    }
  });
}

function freezeLoggerChildContext(
  context: LoggerChildContext
): NormalizedLoggerChildContext {
  return Object.freeze({
    ...(context.correlationId === undefined
      ? {}
      : { correlationId: context.correlationId }),
    ...(context.requestId === undefined ? {} : { requestId: context.requestId }),
    context: Object.freeze({ ...(context.context ?? {}) })
  });
}

function createPinoOptions(config: LoggerConfig): LoggerOptions {
  return {
    level: config.pinoLevel,
    base: null,
    messageKey: "message",
    timestamp: false
  };
}

export type PinoLoggerDestination = DestinationStream;
