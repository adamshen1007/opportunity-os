import { describe, expect, it } from "vitest";
import {
  API_SCAN_JOB_STATUSES,
  createApiScanJobService,
  createInMemoryScanPersistenceStore,
  createOwnerScope
} from "../index.js";
import { toSafeScanJobFailureMessage } from "../runtime/scan-job-service.js";

const request = {
  source: "stack-exchange",
  site: "stackoverflow",
  query: "manual review",
  tags: [],
  limit: 2,
  mode: "fixture"
} as const;

describe("durable scan jobs", () => {
  const scope = createOwnerScope("principal-jobs");
  it("persists queued state, supports cancellation, and never stores credentials", async () => {
    const persistence = createInMemoryScanPersistenceStore();
    const scheduled: Array<() => void> = [];
    const service = createApiScanJobService({
      persistence,
      clock: () => "2026-07-13T00:00:00.000Z",
      idFactory: () => "scan-job-1",
      schedule: (work) => scheduled.push(work)
    });

    const queued = await service.enqueue({ request, correlationId: "correlation-job-1", ownerPrincipalId: scope.principalId });
    expect(queued.status).toBe(API_SCAN_JOB_STATUSES.queued);
    expect(scheduled).toHaveLength(1);

    const cancelled = await service.cancel(scope, queued.jobId);
    expect(cancelled?.status).toBe(API_SCAN_JOB_STATUSES.cancelled);
    expect(JSON.stringify(cancelled)).not.toMatch(/token|authorization|credential|stack trace/iu);

    scheduled[0]?.();
    await Promise.resolve();
    expect((await service.get(scope, queued.jobId))?.status).toBe(API_SCAN_JOB_STATUSES.cancelled);
  });

  it("recovers interrupted running jobs by returning them to the queue", async () => {
    const persistence = createInMemoryScanPersistenceStore();
    await persistence.createScanJob({
      jobId: "scan-job-recovered",
      ownerPrincipalId: scope.principalId,
      status: API_SCAN_JOB_STATUSES.running,
      request,
      requestedAt: "2026-07-13T00:00:00.000Z",
      updatedAt: "2026-07-13T00:01:00.000Z",
      safeMessage: "Interrupted while running."
    });
    const scheduled: Array<() => void> = [];
    const service = createApiScanJobService({ persistence, schedule: (work) => scheduled.push(work) });

    await service.recover();

    expect((await service.get(scope, "scan-job-recovered"))?.status).toBe(API_SCAN_JOB_STATUSES.queued);
    expect(scheduled).toHaveLength(1);
  });

  it("preserves only approved safe live LLM failure messages", () => {
    expect(toSafeScanJobFailureMessage(
      new Error("Live LLM output failed structured citation validation. No result was saved.")
    )).toBe("Live LLM output failed structured citation validation. No result was saved.");
    expect(toSafeScanJobFailureMessage(
      new Error("secret token raw provider response")
    )).toBe("Scan failed before safe output was produced. Retry when the datasource is available.");
  });
});
