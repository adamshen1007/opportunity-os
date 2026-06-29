export * from "@opportunity-os/config";
export * from "@opportunity-os/errors";
export type * from "@opportunity-os/types";
export * from "@opportunity-os/utils";
export {
  createCorrelationContext,
  withCorrelationContext,
  type CorrelationContext,
  type CorrelationId
} from "./context/correlation.js";
export {
  createRequestContext,
  withRequestContext,
  type RequestContext,
  type RequestContextInput,
  type RequestId
} from "./context/request-context.js";
export {
  createFixedLoggerClock,
  createInMemoryLoggerDestination,
  createLoggerConfig,
  createPinoLogger,
  createSystemLoggerClock,
  LOG_LEVELS,
  PINO_LOG_LEVELS,
  normalizeLogEntry,
  normalizeLogError,
  systemLoggerClock,
  isLogLevel,
  toPinoLogLevel,
  type InMemoryLoggerDestination,
  type LogLevel,
  type LoggerClock,
  type LoggerChildContext,
  type LoggerConfig,
  type LoggerConfigInput,
  type LoggerDestination,
  type PinoLoggerDestination,
  type PinoLoggerFactoryInput,
  type PinoLogLevel,
  type SafeLogEntry,
  type SafeLogError,
  type SafeLogValue
} from "./logging/index.js";
export type {
  LogEntry,
  LogEntryContext,
  Logger,
  LoggerFactory,
  LoggerFactoryOptions,
  LogInput,
  LogMethodInput,
  StructuredLogger
} from "./logging/index.js";
export type {
  ValidationIssue,
  ValidationIssueMetadata,
  ValidationIssueSeverity
} from "./validation/validation-issue.js";
export type {
  ValidationFailure,
  ValidationResult,
  ValidationResultMetadata,
  ValidationSuccess
} from "./validation/validation-result.js";
