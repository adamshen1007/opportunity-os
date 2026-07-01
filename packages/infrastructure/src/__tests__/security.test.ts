import { describe, expect, it } from "vitest";
import {
  createInfrastructureError,
  type DependencyGraphValidationResult,
  type HealthAggregationResult,
  type InfrastructureBootstrapOutput,
  type StartupValidationResult
} from "../index.js";

const secretValues = [
  "sk-proj-secret",
  "token=secret",
  "authorization=Bearer secret",
  "credential=secret",
  "postgresql://user:password@localhost:5432/app",
  "https://public@sentry.example/1",
  "provider_key=secret",
  "raw-config-secret",
  "Error: stack trace",
  "raw cause"
];

function expectNoSecretLeak(value: unknown): void {
  const serialized = JSON.stringify(value);

  for (const secretValue of secretValues) {
    expect(serialized).not.toContain(secretValue);
  }
}

describe("infrastructure security contracts", () => {
  it("does not leak raw values from infrastructure errors", () => {
    const error = createInfrastructureError({
      message:
        "Failed with sk-proj-secret token=secret authorization=Bearer secret postgresql://user:password@localhost:5432/app",
      cause: new Error("raw cause")
    });

    expectNoSecretLeak(error);
    expect(error.toJSON().message).toContain("[REDACTED]");
  });

  it("keeps startup validation failures safe by shape", () => {
    const result: StartupValidationResult = {
      status: "invalid",
      checks: [
        {
          id: "config",
          kind: "configuration",
          required: true
        }
      ],
      issues: [
        {
          code: "invalid-configuration",
          safeMessage: "Required configuration is invalid.",
          path: ["configuration"]
        }
      ]
    };

    expectNoSecretLeak(result);
    expect(Object.keys(result.issues[0] ?? {}).sort()).toEqual([
      "code",
      "path",
      "safeMessage"
    ]);
  });

  it("keeps health failures safe by shape", () => {
    const result: HealthAggregationResult = {
      status: "unhealthy",
      aggregate: {
        status: "unhealthy",
        checkedAt: "2026-07-01T00:00:00.000Z",
        components: [
          {
            id: "database",
            moduleId: "database",
            status: "unhealthy",
            checkedAt: "2026-07-01T00:00:00.000Z",
            safeMessage: "Database health check failed."
          }
        ]
      },
      failures: [
        {
          id: "database",
          moduleId: "database",
          status: "unhealthy",
          checkedAt: "2026-07-01T00:00:00.000Z",
          safeMessage: "Database health check failed."
        }
      ]
    };

    expectNoSecretLeak(result);
  });

  it("keeps bootstrap failures safe by shape", () => {
    const result: InfrastructureBootstrapOutput = {
      status: "invalid",
      validation: {
        valid: false,
        issues: [
          {
            code: "composition-failed",
            message: "Composition failed safely.",
            path: ["composition"]
          }
        ]
      }
    };

    expectNoSecretLeak(result);
    expect(Object.keys(result.validation.issues[0] ?? {}).sort()).toEqual([
      "code",
      "message",
      "path"
    ]);
  });

  it("keeps graph validation failures safe by shape", () => {
    const result: DependencyGraphValidationResult = {
      valid: false,
      nodes: [
        {
          id: "logging"
        }
      ],
      edges: [],
      issues: [
        {
          code: "missing-dependency",
          safeMessage: "Required dependency is missing.",
          missingDependency: {
            nodeId: "logging",
            missingDependencyId: "configuration",
            safeMessage: "Required dependency is missing."
          }
        }
      ]
    };

    expectNoSecretLeak(result);
    expect(Object.keys(result.issues[0] ?? {}).sort()).toEqual([
      "code",
      "missingDependency",
      "safeMessage"
    ]);
  });
});
