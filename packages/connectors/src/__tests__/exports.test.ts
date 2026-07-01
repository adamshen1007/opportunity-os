import { describe, expect, it } from "vitest";
import * as connectors from "../index.js";
import type {
  Connector,
  ConnectorAssertionHelper,
  ConnectorCapability,
  ConnectorConfig,
  ConnectorContext,
  ConnectorFactory,
  ConnectorHealthResult,
  ConnectorLimitMetadata,
  ConnectorOperationContract,
  ConnectorRegistry,
  ConnectorResult,
  ConnectorValidationResult
} from "../index.js";

describe("connector SDK public exports", () => {
  it("exports approved runtime contracts from the package root", () => {
    expect(connectors.CONNECTOR_CAPABILITY_KINDS).toEqual([
      "read",
      "sync",
      "validate",
      "health",
      "discover"
    ]);
    expect(connectors.CONNECTOR_CATEGORIES).toEqual([
      "source",
      "destination",
      "bidirectional",
      "utility"
    ]);
    expect(connectors.CONNECTOR_HEALTH_STATUSES).toEqual([
      "healthy",
      "degraded",
      "unhealthy",
      "unknown"
    ]);
    expect(connectors.CONNECTOR_LIFECYCLE_PHASES).toEqual([
      "configure",
      "validate",
      "initialize",
      "health-check",
      "execute-ready",
      "shutdown"
    ]);
    expect(connectors.CONNECTOR_STABILITY_STATUSES).toEqual([
      "experimental",
      "stable",
      "deprecated"
    ]);
    expect(connectors.CONNECTOR_VALIDATION_ISSUE_CODES).toEqual([
      "config-invalid",
      "metadata-invalid",
      "capability-invalid",
      "lifecycle-invalid",
      "dependency-invalid"
    ]);
    expect(connectors.ConnectorError).toBeDefined();
    expect(connectors.connectorSuccess("ok")).toEqual({
      ok: true,
      value: "ok"
    });
    expect(connectors.connectorFailure("error")).toEqual({
      ok: false,
      error: "error"
    });
  });

  it("makes approved type contracts importable from the package root", () => {
    type RootContracts = {
      readonly connector: Connector;
      readonly capability: ConnectorCapability;
      readonly config: ConnectorConfig;
      readonly context: ConnectorContext;
      readonly factory: ConnectorFactory;
      readonly health: ConnectorHealthResult;
      readonly limits: ConnectorLimitMetadata;
      readonly operation: ConnectorOperationContract;
      readonly registry: ConnectorRegistry;
      readonly result: ConnectorResult;
      readonly validation: ConnectorValidationResult;
      readonly assertion: ConnectorAssertionHelper;
    };

    const contractNames = [
      "connector",
      "capability",
      "config",
      "context",
      "factory",
      "health",
      "limits",
      "operation",
      "registry",
      "result",
      "validation",
      "assertion"
    ] satisfies readonly (keyof RootContracts)[];

    expect(contractNames).toHaveLength(12);
  });
});
