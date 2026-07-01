import { describe, expect, it, vi } from "vitest";
import type { StructuredLogger } from "@opportunity-os/shared";
import type { ConnectorRuntimeContext } from "../index.js";

const logger: StructuredLogger = {
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  child: vi.fn(() => logger)
};

describe("connector runtime context contracts", () => {
  it("references connector, shared logging, correlation, request, and infrastructure metadata", () => {
    const context: ConnectorRuntimeContext = {
      correlationId: "correlation-1",
      requestId: "request-1",
      logger,
      connector: {
        metadata: {
          id: "generic-source",
          name: "Generic Source",
          version: "1.0.0",
          description: "Provider-neutral fixture.",
          provider: "generic-provider",
          category: "source",
          tags: ["fixture"],
          stability: "experimental"
        },
        config: {
          fields: []
        },
        context: {
          correlationId: "correlation-1",
          requestId: "request-1",
          logger,
          config: {
            fields: []
          },
          execution: {
            connectorId: "generic-source"
          }
        }
      },
      infrastructure: {
        moduleId: "connector-runtime",
        service: "opportunity-os",
        environment: "test"
      }
    };

    expect(context.connector.metadata.id).toBe("generic-source");
    expect(context.infrastructure.moduleId).toBe("connector-runtime");
    expect(context.correlationId).toBe("correlation-1");
  });
});
