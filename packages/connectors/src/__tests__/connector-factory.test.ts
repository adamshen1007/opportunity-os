import { describe, expect, it, vi } from "vitest";
import type { StructuredLogger } from "@opportunity-os/shared";
import {
  createConnectorError,
  type ConnectorFactory,
  type ConnectorFactoryInput,
  type ConnectorFactoryResult
} from "../index.js";

const logger: StructuredLogger = {
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  child: vi.fn(() => logger)
};

describe("connector factory contracts", () => {
  it("accepts explicit configuration and context", () => {
    const input: ConnectorFactoryInput = {
      config: {
        fields: []
      },
      context: {
        correlationId: "correlation-1",
        logger,
        config: {
          fields: []
        },
        execution: {
          connectorId: "generic-source"
        }
      }
    };
    const factory: ConnectorFactory = {
      create: () =>
        ({
          ok: false,
          error: createConnectorError({
            message: "Factory contract fixture."
          })
        }) satisfies ConnectorFactoryResult
    };

    expect(input.context.correlationId).toBe("correlation-1");
    expect(typeof factory.create).toBe("function");
  });
});
