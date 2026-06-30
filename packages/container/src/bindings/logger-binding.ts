import type {
  LoggerFactory,
  StructuredLogger
} from "@opportunity-os/shared";
import type { DependencyToken } from "../tokens/index.js";

export type LoggerBinding = {
  readonly kind: "logger";
  readonly token: DependencyToken<StructuredLogger>;
  readonly logger: StructuredLogger;
};

export type LoggerFactoryBinding = {
  readonly kind: "logger-factory";
  readonly token: DependencyToken<LoggerFactory>;
  readonly factory: LoggerFactory;
};

export type LoggerBindingContract =
  | LoggerBinding
  | LoggerFactoryBinding;
