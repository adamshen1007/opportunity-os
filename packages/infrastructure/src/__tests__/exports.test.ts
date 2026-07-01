import { describe, expect, it } from "vitest";
import * as infrastructure from "../index.js";

describe("public infrastructure exports", () => {
  it("exposes approved runtime contracts from the package root", () => {
    expect(Object.keys(infrastructure).sort()).toEqual([
      "GRACEFUL_SHUTDOWN_RESULT_STATUSES",
      "HEALTH_STATUSES",
      "INFRASTRUCTURE_BOOTSTRAP_STATUSES",
      "INFRASTRUCTURE_LIFECYCLE_PHASES",
      "INFRASTRUCTURE_MODULE_KINDS",
      "INFRASTRUCTURE_PACKAGE_NAMES",
      "InfrastructureError",
      "STARTUP_VALIDATION_CHECK_KINDS",
      "STARTUP_VALIDATION_STATUSES",
      "createInfrastructureError",
      "infrastructureFailure",
      "infrastructureSuccess",
      "sanitizeInfrastructureErrorMessage"
    ]);
  });

  it("lets consumers create results and safe errors from root imports", () => {
    const success = infrastructure.infrastructureSuccess("ready");
    const failure = infrastructure.infrastructureFailure(
      infrastructure.createInfrastructureError({
        message: "connection failed for postgres://user:password@localhost/db"
      })
    );

    expect(success).toEqual({
      ok: true,
      value: "ready"
    });
    expect(failure.ok).toBe(false);
    expect(JSON.stringify(failure)).not.toContain("password");
  });
});
