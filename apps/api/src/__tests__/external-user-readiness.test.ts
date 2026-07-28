import { describe, expect, it } from "vitest";
import {
  createApiMetricsRegistry,
  createInMemoryFeedbackStore,
  createInMemoryScanPersistenceStore,
  createOwnerScope,
  runOpportunityScanPipeline
} from "../index.js";

describe("M53-M57 external-user readiness", () => {
  const scope = createOwnerScope("principal-readiness");
  it("adds explainable trust metadata and safe quality counters", async () => {
    const result = await runOpportunityScanPipeline({
      source: "stack-exchange",
      site: "stackoverflow",
      query: "manual review",
      tags: [],
      limit: 2,
      mode: "fixture",
      correlationId: "quality-test",
      requestedAt: "2026-07-13T00:00:00.000Z"
    });

    expect(result.opportunities[0]?.trust).toMatchObject({ evidenceCount: 1 });
    expect(result.opportunities[0]?.trust.limitations.length).toBeGreaterThan(0);
    expect(result.safeMetadata).toMatchObject({ rejectedSourceItems: 0, duplicateSourceItems: 0 });
    expect(JSON.stringify(result)).not.toMatch(/api[_-]?key|access[_-]?token|authorization|stack trace|raw cause/iu);
  });

  it("deletes in-memory scan results and validation feedback", async () => {
    const scanStore = createInMemoryScanPersistenceStore();
    const result = await runOpportunityScanPipeline({
      source: "reddit",
      subreddit: "opportunity",
      query: "manual review",
      tags: [],
      limit: 1,
      mode: "fixture",
      correlationId: "privacy-test",
      requestedAt: "2026-07-13T00:00:00.000Z"
    });
    await scanStore.persistScanResult({ result, persistedAt: "2026-07-13T00:01:00.000Z", ownerPrincipalId: scope.principalId });
    expect(await scanStore.deleteScanResult(scope, result.scanId)).toBe(true);
    expect(await scanStore.getScanResult(scope, result.scanId)).toBeUndefined();

    const feedbackStore = createInMemoryFeedbackStore({ idFactory: () => "feedback-delete-1" });
    await feedbackStore.createFeedback({
      opportunityId: "opportunity-1",
      opportunityRecordId: "opportunity-record-1",
      ownerPrincipalId: scope.principalId,
      status: "saved",
      reasonCategories: [],
      ratings: [],
      correlationId: "privacy-feedback-test"
    });
    expect(await feedbackStore.deleteFeedback(scope, "feedback-delete-1")).toBe(true);
    expect(await feedbackStore.getFeedback(scope, "feedback-delete-1")).toBeUndefined();
  });

  it("aggregates safe request and scan operations without request data", () => {
    const metrics = createApiMetricsRegistry(() => "2026-07-13T00:00:00.000Z");
    metrics.recordRequest(200, 25);
    metrics.recordRequest(503, 11_000);
    metrics.recordScanTransition("queued");
    metrics.recordScanTransition("failed");

    const snapshot = metrics.snapshot();
    expect(snapshot.requests).toMatchObject({ total: 2, successful: 1, serverErrors: 1, maximumDurationMs: 11_000 });
    expect(snapshot.scans).toMatchObject({ queued: 1, failed: 1 });
    expect(snapshot.readiness.status).toBe("attention-required");
    expect(JSON.stringify(snapshot)).not.toMatch(/body|header|token|credential/iu);
  });
});
