import type { LogEntry, LogEntryContext } from "./log-entry.js";
import type { LogLevel } from "./log-level.js";

export type LogInput = Omit<LogEntry, "timestamp"> & {
  readonly timestamp?: string;
};

export type Logger = {
  readonly log: (entry: LogEntry) => void | Promise<void>;
};

export type StructuredLogger = Logger & {
  readonly debug: (entry: LogInput) => void | Promise<void>;
  readonly info: (entry: LogInput) => void | Promise<void>;
  readonly warn: (entry: LogInput) => void | Promise<void>;
  readonly error: (entry: LogInput) => void | Promise<void>;
};

export type LoggerFactoryOptions = {
  readonly service: string;
  readonly environment: string;
  readonly defaultContext?: LogEntryContext;
};

export type LoggerFactory = (
  options: LoggerFactoryOptions
) => StructuredLogger;

export type LogMethodInput = {
  readonly severity: LogLevel;
  readonly correlationId: string;
  readonly requestId: string;
  readonly eventName: string;
  readonly message: string;
  readonly context?: LogEntryContext;
};
