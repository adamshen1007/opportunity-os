import { describe, expect, it, vi } from "vitest";
import type { StructuredLogger } from "@opportunity-os/shared";
import type { ConnectorContext } from "../index.js";

const logger: StructuredLogger = {
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  child: vi.fn(() => logger)
};

describe("connector context contracts", () => {
  it("references correlation, optional request, logger, config, and metadata", () => {
    const context: ConnectorContext = {
      correlationId: "correlation-1",
      requestId: "request-1",
      logger,
      config: {
        fields: []
      },
      execution: {
        connectorId: "generic-source",
        operationName: "read",
        startedAt: "2026-07-01T00:00:00.000Z",
        attempt: 1
      }
    };

    expect(context.correlationId).toBe("correlation-1");
    expect(context.execution.connectorId).toBe("generic-source");
  });
});
