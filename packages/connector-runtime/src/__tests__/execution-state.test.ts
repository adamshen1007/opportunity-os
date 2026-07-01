import { describe, expect, it } from "vitest";
import {
  CONNECTOR_RUNTIME_EXECUTION_STATES,
  CONNECTOR_RUNTIME_TRANSITION_KINDS,
  type ConnectorRuntimeInvalidTransition,
  type ConnectorRuntimeStateTransition
} from "../index.js";

describe("connector runtime state contracts", () => {
  it("defines stable state and transition vocabularies", () => {
    expect(CONNECTOR_RUNTIME_EXECUTION_STATES).toEqual([
      "created",
      "ready",
      "running",
      "paused",
      "succeeded",
      "failed",
      "cancelled",
      "timed-out"
    ]);
    expect(CONNECTOR_RUNTIME_TRANSITION_KINDS).toEqual([
      "start",
      "pause",
      "resume",
      "succeed",
      "fail",
      "cancel",
      "time-out"
    ]);
  });

  it("represents valid and invalid transitions as data contracts", () => {
    const transition: ConnectorRuntimeStateTransition = {
      kind: "start",
      from: "ready",
      to: "running"
    };
    const invalidTransition: ConnectorRuntimeInvalidTransition = {
      code: "transition-not-allowed",
      from: "succeeded",
      to: "running",
      safeMessage: "Completed runtime state cannot move back to running."
    };

    expect(transition.to).toBe("running");
    expect(invalidTransition.code).toBe("transition-not-allowed");
  });
});
