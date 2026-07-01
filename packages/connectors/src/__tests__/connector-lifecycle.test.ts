import { describe, expect, expectTypeOf, it } from "vitest";
import {
  CONNECTOR_LIFECYCLE_PHASES,
  type ConnectorLifecycle,
  type ConnectorLifecyclePhase,
  type ConnectorLifecycleState
} from "../index.js";

describe("connector lifecycle contracts", () => {
  it("defines stable lifecycle phases", () => {
    expect(CONNECTOR_LIFECYCLE_PHASES).toEqual([
      "configure",
      "validate",
      "initialize",
      "health-check",
      "execute-ready",
      "shutdown"
    ]);
  });

  it("describes lifecycle state and transitions declaratively", () => {
    const lifecycle: ConnectorLifecycle = {
      phases: CONNECTOR_LIFECYCLE_PHASES,
      transitions: [
        {
          from: "configure",
          to: "validate"
        }
      ]
    };
    const state: ConnectorLifecycleState = {
      phase: "execute-ready",
      ready: true,
      safeMessage: "Connector is ready."
    };

    expect(lifecycle.transitions?.[0]?.to).toBe("validate");
    expect(state.ready).toBe(true);
  });

  it("exports lifecycle phase as a literal union", () => {
    expectTypeOf<ConnectorLifecyclePhase>().toEqualTypeOf<
      (typeof CONNECTOR_LIFECYCLE_PHASES)[number]
    >();
  });
});
