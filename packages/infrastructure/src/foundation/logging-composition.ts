import type {
  LoggerConfig,
  LoggerFactory,
  StructuredLogger
} from "@opportunity-os/shared";

export type LoggingCompositionContract = {
  readonly packageName: "@opportunity-os/shared";
  readonly loggerConfig: LoggerConfig;
  readonly loggerFactory?: LoggerFactory;
  readonly logger?: StructuredLogger;
};
