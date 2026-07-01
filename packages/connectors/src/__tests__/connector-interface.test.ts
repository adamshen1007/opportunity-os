import { describe, expect, it, vi } from "vitest";
import type { StructuredLogger } from "@opportunity-os/shared";
import type { Connector } from "../index.js";

const logger: StructuredLogger = {
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  child: vi.fn(() => logger)
};

describe("connector interface contracts", () => {
  it("describes a generic provider-agnostic connector", async () => {
    const connector: Connector<{ readonly cursor?: string }, readonly string[]> = {
      metadata: {
        id: "generic-source",
        name: "Generic Source",
        version: "1.0.0",
        description: "Provider-neutral contract fixture.",
        provider: "generic-provider",
        category: "source",
        tags: ["generic"],
        stability: "experimental"
      },
      capabilities: {
        capabilities: [
          {
            kind: "read",
            enabled: true
          }
        ]
      },
      config: {
        fields: []
      },
      lifecycle: {
        phases: ["configure", "validate", "initialize"]
      },
      validate: () => ({
        phase: "validate",
        ready: true
      }),
      operation: {
        name: "read"
      }
    };

    await expect(
      Promise.resolve(connector.validate({
        correlationId: "correlation-1",
        logger,
        config: connector.config,
        execution: {
          connectorId: connector.metadata.id
        }
      }))
    ).resolves.toEqual({
      phase: "validate",
      ready: true
    });
  });
});
