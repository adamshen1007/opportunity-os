import { describe, expect, it } from "vitest";
import type {
  DependencyGraphCycle,
  DependencyGraphDuplicateRegistration,
  DependencyGraphMissingDependency,
  DependencyGraphValidationResult
} from "../index.js";

describe("dependency graph contracts", () => {
  it("represents graph nodes and edges without executing resolution", () => {
    const result: DependencyGraphValidationResult = {
      valid: true,
      nodes: [
        {
          id: "configuration",
          provides: ["config"]
        },
        {
          id: "logging",
          requires: ["configuration"]
        }
      ],
      edges: [
        {
          from: "logging",
          to: "configuration"
        }
      ],
      issues: []
    };

    expect(result.edges[0]?.to).toBe("configuration");
  });

  it("represents cycles, missing dependencies, and duplicate registrations", () => {
    const cycle: DependencyGraphCycle = {
      nodeIds: ["events", "database", "events"],
      safeMessage: "Dependency cycle detected."
    };
    const missingDependency: DependencyGraphMissingDependency = {
      nodeId: "logging",
      missingDependencyId: "configuration",
      safeMessage: "Required dependency is missing."
    };
    const duplicateRegistration: DependencyGraphDuplicateRegistration = {
      token: "Logger",
      moduleIds: ["logging-a", "logging-b"],
      safeMessage: "Dependency token is registered more than once."
    };
    const result: DependencyGraphValidationResult = {
      valid: false,
      nodes: [],
      edges: [],
      issues: [
        {
          code: "cycle-detected",
          safeMessage: cycle.safeMessage,
          cycle
        },
        {
          code: "missing-dependency",
          safeMessage: missingDependency.safeMessage,
          missingDependency
        },
        {
          code: "duplicate-registration",
          safeMessage: duplicateRegistration.safeMessage,
          duplicateRegistration
        }
      ]
    };

    expect(result.issues.map((issue) => issue.code)).toEqual([
      "cycle-detected",
      "missing-dependency",
      "duplicate-registration"
    ]);
  });
});
