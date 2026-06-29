import type { LogLevel } from "./log-level.js";

export type LogEntryContext = {
  readonly [key: string]: unknown;
};

export type LogEntry = {
  readonly timestamp: string;
  readonly service: string;
  readonly environment: string;
  readonly severity: LogLevel;
  readonly correlationId: string;
  readonly requestId?: string;
  readonly eventName: string;
  readonly message: string;
  readonly context?: LogEntryContext;
  readonly error?: unknown;
};
