import { describe, expect, it, vi } from "vitest";
import type { StructuredLogger } from "@opportunity-os/shared";
import {
  connectorSuccess,
  type ConnectorAssertionHelper,
  type FakeConnectorFixture
} from "../index.js";

const logger: StructuredLogger = {
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  child: vi.fn(() => logger)
};

describe("connector test utility contracts", () => {
  it("describes fake metadata, fake contexts, and assertion helpers", () => {
    const fixture: FakeConnectorFixture = {
      metadata: {
        id: "generic-source",
        name: "Generic Source",
        version: "1.0.0",
        description: "Provider-neutral test fixture.",
        provider: "generic-provider",
        category: "source",
        tags: ["fixture"],
        stability: "experimental",
        fixtureName: "generic-source-fixture"
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
      context: {
        correlationId: "correlation-1",
        logger,
        config: {
          fields: []
        },
        execution: {
          connectorId: "generic-source"
        },
        fixtureName: "context-fixture"
      }
    };
    const helper: ConnectorAssertionHelper<{ readonly count: number }> = {
      name: "success count assertion",
      assert: ({ result }) => {
        expect(result.ok).toBe(true);
      }
    };

    expect(fixture.metadata.fixtureName).toBe("generic-source-fixture");
    expect(helper.name).toBe("success count assertion");
    helper.assert({
      fixture,
      result: connectorSuccess({
        count: 1
      })
    });
  });
});
