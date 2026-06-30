import { describe, expect, expectTypeOf, it } from "vitest";
import type {
  LoggerFactory,
  StructuredLogger
} from "@opportunity-os/shared";
import {
  createDependencyToken,
  type LoggerBinding,
  type LoggerBindingContract,
  type LoggerFactoryBinding
} from "../index.js";

const logger: StructuredLogger = {
  log: () => undefined,
  debug: () => undefined,
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
  child: () => logger
};

describe("logger binding contracts", () => {
  it("binds explicit logger instances without singletons or app integration", () => {
    const token = createDependencyToken<StructuredLogger>("logger.structured");
    const binding: LoggerBinding = {
      kind: "logger",
      token,
      logger
    };

    expect(binding.logger).toBe(logger);
    expectTypeOf(binding).toMatchTypeOf<LoggerBindingContract>();
  });

  it("binds logger factories as explicit dependencies", () => {
    const token = createDependencyToken<LoggerFactory>("logger.factory");
    const factory: LoggerFactory = () => logger;
    const binding: LoggerFactoryBinding = {
      kind: "logger-factory",
      token,
      factory
    };

    expect(binding.factory({
      service: "container-test",
      environment: "local"
    })).toBe(logger);
    expectTypeOf(binding).toMatchTypeOf<LoggerBindingContract>();
  });
});
