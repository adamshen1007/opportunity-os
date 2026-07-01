import { describe, expect, expectTypeOf, it } from "vitest";
import {
  GRACEFUL_SHUTDOWN_RESULT_STATUSES,
  HEALTH_STATUSES,
  INFRASTRUCTURE_BOOTSTRAP_STATUSES,
  INFRASTRUCTURE_LIFECYCLE_PHASES,
  STARTUP_VALIDATION_CHECK_KINDS,
  STARTUP_VALIDATION_STATUSES,
  type DependencyGraphValidationIssueCode,
  type GracefulShutdownResultStatus,
  type HealthStatus,
  type InfrastructureBootstrapStatus,
  type InfrastructureLifecyclePhase,
  type StartupValidationIssueCode,
  type StartupValidationStatus
} from "../index.js";

describe("infrastructure contract stability", () => {
  it("keeps lifecycle, health, bootstrap, and startup constants stable", () => {
    expect(INFRASTRUCTURE_LIFECYCLE_PHASES).toEqual([
      "register",
      "validate",
      "compose",
      "start",
      "ready",
      "shutdown"
    ]);
    expect(HEALTH_STATUSES).toEqual([
      "healthy",
      "degraded",
      "unhealthy",
      "unknown"
    ]);
    expect(INFRASTRUCTURE_BOOTSTRAP_STATUSES).toEqual(["ready", "invalid"]);
    expect(STARTUP_VALIDATION_CHECK_KINDS).toEqual([
      "configuration",
      "dependency-graph",
      "health",
      "package-registration"
    ]);
    expect(STARTUP_VALIDATION_STATUSES).toEqual(["valid", "invalid"]);
    expect(GRACEFUL_SHUTDOWN_RESULT_STATUSES).toEqual([
      "completed",
      "failed",
      "timed-out"
    ]);
  });

  it("keeps issue code unions stable", () => {
    const graphIssueCodes = [
      "cycle-detected",
      "missing-dependency",
      "duplicate-registration"
    ] as const satisfies readonly DependencyGraphValidationIssueCode[];
    const startupIssueCodes = [
      "missing-required-module",
      "invalid-dependency-graph",
      "invalid-configuration",
      "failed-health-check",
      "unsafe-message"
    ] as const satisfies readonly StartupValidationIssueCode[];

    expect(graphIssueCodes).toEqual([
      "cycle-detected",
      "missing-dependency",
      "duplicate-registration"
    ]);
    expect(startupIssueCodes).toEqual([
      "missing-required-module",
      "invalid-dependency-graph",
      "invalid-configuration",
      "failed-health-check",
      "unsafe-message"
    ]);
  });

  it("keeps exported literal unions aligned with constants", () => {
    expectTypeOf<InfrastructureLifecyclePhase>().toEqualTypeOf<
      (typeof INFRASTRUCTURE_LIFECYCLE_PHASES)[number]
    >();
    expectTypeOf<HealthStatus>().toEqualTypeOf<
      (typeof HEALTH_STATUSES)[number]
    >();
    expectTypeOf<InfrastructureBootstrapStatus>().toEqualTypeOf<
      (typeof INFRASTRUCTURE_BOOTSTRAP_STATUSES)[number]
    >();
    expectTypeOf<StartupValidationStatus>().toEqualTypeOf<
      (typeof STARTUP_VALIDATION_STATUSES)[number]
    >();
    expectTypeOf<GracefulShutdownResultStatus>().toEqualTypeOf<
      (typeof GRACEFUL_SHUTDOWN_RESULT_STATUSES)[number]
    >();
  });
});
