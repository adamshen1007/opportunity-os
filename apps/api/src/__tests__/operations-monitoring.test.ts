import { describe, expect, it, vi } from "vitest";
import {
  API_OPERATION_FAILURE_KINDS,
  classifyApiScanFailure,
  createApiMetricsRegistry,
  createInMemoryScanPersistenceStore,
  createLocalApiDispatcher
} from "../index.js";

describe("Phase 4.5 operations monitoring", () => {
  it("protects operations with administrator authorization", async () => {
    const metrics = createApiMetricsRegistry(() => "2026-07-29T08:00:00.000Z");
    const dispatch = createLocalApiDispatcher({
      adminAccessToken: "admin-monitoring-token",
      metricsRegistry: metrics
    });

    const anonymous = await dispatch({ method: "GET", path: "/operations" });
    const sessionOnly = await dispatch({
      method: "GET",
      path: "/operations",
      headers: { "x-opportunity-os-session-id": `ses_${"a".repeat(43)}` }
    });
    const administrator = await dispatch({
      method: "GET",
      path: "/operations",
      headers: {
        "x-opportunity-os-admin-token": "admin-monitoring-token",
        "x-correlation-id": "correlation-operations-admin",
        "x-request-id": "request-operations-admin"
      }
    });

    expect(anonymous.ok ? 200 : anonymous.error.statusCode).toBe(401);
    expect(sessionOnly.ok ? 200 : sessionOnly.error.statusCode).toBe(401);
    expect(administrator.ok).toBe(true);
    expect(administrator.meta).toEqual({
      correlationId: "correlation-operations-admin",
      requestId: "request-operations-admin"
    });
    expect(administrator.ok ? administrator.data : undefined).toMatchObject({
      failures: { authentication: 2 }
    });
  });

  it("records dependency health and deterministic alert thresholds without configuration values", async () => {
    const metrics = createApiMetricsRegistry(() => "2026-07-29T08:01:00.000Z");
    const dispatch = createLocalApiDispatcher({
      adminAccessToken: "admin-monitoring-token",
      metricsRegistry: metrics,
      databaseIsReady: async () => false,
      healthDependencies: async () => [{
        name: "llm",
        status: "degraded",
        checkedAt: "2026-07-29T08:01:00.000Z",
        safeMessage: "Live LLM analysis is unavailable."
      }]
    });

    const health = await dispatch({ method: "GET", path: "/health" });
    metrics.recordRequest(503, 12_000);
    metrics.recordFailure(API_OPERATION_FAILURE_KINDS.liveDatasource);
    metrics.recordFailure(API_OPERATION_FAILURE_KINDS.llm);
    const operations = await dispatch({
      method: "GET",
      path: "/operations",
      headers: { "x-opportunity-os-admin-token": "admin-monitoring-token" }
    });

    expect(health.ok && health.data).toMatchObject({ status: "degraded" });
    expect(operations.ok && operations.data).toMatchObject({
      requests: { serverErrors: 1, maximumDurationMs: 12_000 },
      failures: { "live-datasource": 1, llm: 1 },
      dependencies: [
        { name: "database", status: "degraded" },
        { name: "llm", status: "degraded" }
      ],
      readiness: { status: "attention-required" }
    });
    expect(JSON.stringify(operations)).not.toMatch(
      /postgres(?:ql)?:|api[_-]?key|authorization|bearer|password|prompt|provider payload|token value/iu
    );
  });

  it("classifies controlled scan failures and never records raw causes", async () => {
    const persistence = createInMemoryScanPersistenceStore();
    vi.spyOn(persistence, "persistScanResult").mockRejectedValue(
      new Error("Scan results could not be saved. Retry after the database recovers.")
    );
    const metrics = createApiMetricsRegistry(() => "2026-07-29T08:02:00.000Z");
    const dispatch = createLocalApiDispatcher({
      scanPersistence: persistence,
      adminAccessToken: "admin-monitoring-token",
      metricsRegistry: metrics
    });

    const failedScan = await dispatch({
      method: "POST",
      path: "/scans",
      body: {
        source: "stack-exchange",
        site: "stackoverflow",
        query: "controlled database failure",
        tags: [],
        limit: 1,
        mode: "fixture"
      }
    });
    const operations = await dispatch({
      method: "GET",
      path: "/operations",
      headers: { "x-opportunity-os-admin-token": "admin-monitoring-token" }
    });

    expect(failedScan.ok ? 200 : failedScan.error.statusCode).toBe(500);
    expect(operations.ok && operations.data).toMatchObject({
      failures: { database: 1 }
    });
    expect(classifyApiScanFailure(new Error("The live datasource was unavailable. No result was saved.")))
      .toBe(API_OPERATION_FAILURE_KINDS.liveDatasource);
    expect(classifyApiScanFailure(new Error("The live LLM provider was unavailable or rejected the request. No result was saved.")))
      .toBe(API_OPERATION_FAILURE_KINDS.llm);
  });
});
