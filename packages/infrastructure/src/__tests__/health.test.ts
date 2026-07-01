import { describe, expect, expectTypeOf, it } from "vitest";
import {
  HEALTH_STATUSES,
  type HealthAggregationResult,
  type HealthCheckContract,
  type HealthComponentStatus,
  type HealthStatus
} from "../index.js";

describe("health aggregation contracts", () => {
  it("defines stable health statuses", () => {
    expect(HEALTH_STATUSES).toEqual([
      "healthy",
      "degraded",
      "unhealthy",
      "unknown"
    ]);
  });

  it("represents aggregate and component health with safe messages", () => {
    const component: HealthComponentStatus = {
      id: "database",
      moduleId: "database",
      status: "unhealthy",
      checkedAt: "2026-07-01T00:00:00.000Z",
      safeMessage: "Database health check failed."
    };
    const result: HealthAggregationResult = {
      status: "unhealthy",
      aggregate: {
        status: "unhealthy",
        checkedAt: "2026-07-01T00:00:00.000Z",
        components: [component]
      },
      failures: [component]
    };

    expect(result.failures[0]?.safeMessage).toBe(
      "Database health check failed."
    );
  });

  it("defines a check contract without invoking it", () => {
    const healthCheck: HealthCheckContract = {
      check: () => ({
        id: "configuration",
        moduleId: "configuration",
        status: "healthy",
        checkedAt: "2026-07-01T00:00:00.000Z"
      })
    };

    expect(typeof healthCheck.check).toBe("function");
  });

  it("exports status as a literal union", () => {
    expectTypeOf<HealthStatus>().toEqualTypeOf<
      (typeof HEALTH_STATUSES)[number]
    >();
  });
});
