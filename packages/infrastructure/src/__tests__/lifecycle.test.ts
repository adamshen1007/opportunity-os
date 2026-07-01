import { describe, expect, expectTypeOf, it } from "vitest";
import {
  INFRASTRUCTURE_LIFECYCLE_PHASES,
  type InfrastructureLifecycleOrder,
  type InfrastructureLifecycleParticipant,
  type InfrastructureLifecyclePhase
} from "../index.js";

describe("infrastructure lifecycle contracts", () => {
  it("defines stable lifecycle phases", () => {
    expect(INFRASTRUCTURE_LIFECYCLE_PHASES).toEqual([
      "register",
      "validate",
      "compose",
      "start",
      "ready",
      "shutdown"
    ]);
  });

  it("represents participant metadata and ordering", () => {
    const participant: InfrastructureLifecycleParticipant = {
      id: "database-start",
      moduleId: "database",
      phase: "start",
      order: 30,
      timeoutMs: 5_000,
      dependencies: ["configuration-start"]
    };
    const order: InfrastructureLifecycleOrder = {
      startup: ["configuration-start", "database-start"],
      shutdown: ["database-start", "configuration-start"]
    };

    expect(participant.dependencies).toEqual(["configuration-start"]);
    expect(order.shutdown[0]).toBe("database-start");
  });

  it("exports phase as a literal union", () => {
    expectTypeOf<InfrastructureLifecyclePhase>().toEqualTypeOf<
      (typeof INFRASTRUCTURE_LIFECYCLE_PHASES)[number]
    >();
  });
});
