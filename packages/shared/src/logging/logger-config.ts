import type { LogEntryContext } from "./log-entry.js";
import type { LogLevel } from "./log-level.js";
import { toPinoLogLevel, type PinoLogLevel } from "./pino-level.js";

export type LoggerConfigInput = {
  readonly service: string;
  readonly environment: string;
  readonly logLevel: LogLevel;
  readonly baseContext?: LogEntryContext;
};

export type LoggerConfig = {
  readonly service: string;
  readonly environment: string;
  readonly logLevel: LogLevel;
  readonly pinoLevel: PinoLogLevel;
  readonly baseContext?: LogEntryContext;
};

export function createLoggerConfig(input: LoggerConfigInput): LoggerConfig {
  return {
    service: input.service,
    environment: input.environment,
    logLevel: input.logLevel,
    pinoLevel: toPinoLogLevel(input.logLevel),
    ...(input.baseContext === undefined
      ? {}
      : { baseContext: { ...input.baseContext } })
  };
}
