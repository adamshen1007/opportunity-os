import { describe, expect, it } from "vitest";
import {
  CONNECTOR_HOST_RUNTIME_ORCHESTRATION_STATUSES,
  type ConnectorHostRuntimeOrchestrationContract
} from "../index.js";

describe("connector host runtime orchestration contracts", () => {
  it("defines runtime orchestration statuses", () => {
    expect(CONNECTOR_HOST_RUNTIME_ORCHESTRATION_STATUSES).toEqual([
      "planned",
      "accepted",
      "rejected"
    ]);
  });

  it("composes runtime pipeline, state, policies, metrics, and telemetry", () => {
    const contract: ConnectorHostRuntimeOrchestrationContract = {
      input: {
        pipeline: {
          name: "generic-pipeline",
          stages: [],
          input: {
            context: {
              correlationId: "correlation-1",
              logger: {
                log: () => undefined,
                debug: () => undefined,
                info: () => undefined,
                warn: () => undefined,
                error: () => undefined,
                child: () => contract.input.pipeline.input.context.logger
              },
              connector: {
                metadata: {
                  id: "generic-source",
                  name: "Generic Source",
                  version: "1.0.0",
                  description: "Generic connector.",
                  provider: "generic",
                  category: "source",
                  tags: ["generic"],
                  stability: "experimental"
                },
                config: {
                  fields: []
                },
                context: {
                  correlationId: "correlation-1",
                  logger: {
                    log: () => undefined,
                    debug: () => undefined,
                    info: () => undefined,
                    warn: () => undefined,
                    error: () => undefined,
                    child: () => contract.input.pipeline.input.context.logger
                  },
                  config: {
                    fields: []
                  },
                  execution: {
                    connectorId: "generic-source"
                  }
                }
              },
              infrastructure: {}
            },
            state: "created"
          }
        },
        state: "created",
        policies: {
          retry: {
            maxAttempts: 1,
            backoff: {
              kind: "fixed",
              delayMs: 0
            },
            retryableIssueCodes: []
          }
        },
        metrics: {
          counts: {
            processed: 0,
            succeeded: 0,
            failed: 0
          },
          durations: {
            totalMs: 0
          },
          attempts: {
            attempts: 0
          }
        },
        telemetry: {
          events: []
        }
      }
    };

    expect(contract.input.state).toBe("created");
    expect(contract.input.policies?.retry?.maxAttempts).toBe(1);
  });
});
