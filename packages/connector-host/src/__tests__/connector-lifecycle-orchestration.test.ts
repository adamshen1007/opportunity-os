import { describe, expect, it } from "vitest";
import {
  CONNECTOR_HOST_LIFECYCLE_PHASES,
  type ConnectorHostLifecycleOrchestrationContract
} from "../index.js";

describe("connector host lifecycle orchestration contracts", () => {
  it("covers the approved connector lifecycle phases", () => {
    expect(CONNECTOR_HOST_LIFECYCLE_PHASES).toEqual([
      "configure",
      "validate",
      "initialize",
      "health-check",
      "execute-ready",
      "shutdown"
    ]);
  });

  it("models lifecycle orchestration as contract data", () => {
    const contract: ConnectorHostLifecycleOrchestrationContract = {
      input: {
        lifecycle: {
          phases: CONNECTOR_HOST_LIFECYCLE_PHASES
        },
        requiredPhases: CONNECTOR_HOST_LIFECYCLE_PHASES
      },
      output: {
        states: [
          {
            phase: "configure",
            ready: true,
            safeMessage: "Configuration contract is ready."
          }
        ]
      }
    };

    expect(contract.output?.states[0]?.phase).toBe("configure");
  });
});
