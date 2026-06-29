import { isLogLevel, type LogLevel } from "./log-level.js";

export const PINO_LOG_LEVELS = {
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error"
} as const;

export type PinoLogLevel =
  (typeof PINO_LOG_LEVELS)[keyof typeof PINO_LOG_LEVELS];

export function toPinoLogLevel(logLevel: unknown): PinoLogLevel {
  if (!isLogLevel(logLevel)) {
    throw new TypeError(`Unsupported log level: ${String(logLevel)}`);
  }

  return PINO_LOG_LEVELS[logLevel satisfies LogLevel];
}
