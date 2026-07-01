import { describe, expect, it } from "vitest";
import type { StructuredLogger } from "@opportunity-os/shared";
import type { ConnectorRuntimeTestHarnessContract } from "../index.js";

describe("connector runtime test harness contracts", () => {
  it("models deterministic fixtures without real connector execution", () => {
    const logger: StructuredLogger = {
      log: () => undefined,
      debug: () => undefined,
      info: () => undefined,
      warn: () => undefined,
      error: () => undefined,
      child: () => logger
    };
    const config = {
      fields: []
    };
    const metadata = {
      id: "generic-source",
      name: "Generic Source",
      version: "1.0.0",
      description: "Fixture connector.",
      provider: "fixture",
      category: "source",
      tags: ["fixture"],
      stability: "experimental",
      fixtureName: "generic-source-fixture"
    } as const;
    const context = {
      correlationId: "correlation-1",
      logger,
      config,
      execution: {
        connectorId: "generic-source",
        startedAt: "2026-07-01T00:00:00.000Z"
      },
      fixtureName: "generic-source-fixture"
    };
    const harness: ConnectorRuntimeTestHarnessContract = {
      clock: {
        now: () => "2026-07-01T00:00:00.000Z"
      },
      connectors: [
        {
          metadata,
          capabilities: {
            capabilities: []
          },
          config,
          context,
          runtimeContext: {
            connector: {
              metadata,
              config,
              context
            },
            logger,
            correlationId: "correlation-1",
            infrastructure: {
              moduleId: "connector-runtime"
            }
          }
        }
      ],
      assertions: [
        {
          name: "has deterministic clock",
          assert: (fixture) => {
            expect(fixture.clock.now()).toBe("2026-07-01T00:00:00.000Z");
          }
        }
      ]
    };

    expect(harness.clock.now()).toBe("2026-07-01T00:00:00.000Z");
    expect(harness.connectors[0]?.metadata.id).toBe("generic-source");
  });
});
