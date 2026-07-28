import { describe, expect, it } from "vitest";
import {
  API_SCAN_JOB_STATUSES,
  createDatabaseScanPersistenceStore,
  createInMemoryFeedbackStore,
  createInMemoryScanPersistenceStore,
  createSyntheticApiRequest,
  handleCreateFeedbackRequest,
  handleCreateRedditScanRequest,
  runOpportunityScanPipeline,
  syntheticApiFeedbackRequestBody,
  type ApiScanPersistenceDatabaseClient
} from "../index.js";

function createDelegate() {
  const calls: unknown[] = [];
  return {
    calls,
    async upsert(args: unknown) {
      calls.push(args);
      return {};
    }
  };
}

describe("scan persistence", () => {
  it("persists scan outputs in memory and resolves generated opportunity records for feedback", async () => {
    const persistence = createInMemoryScanPersistenceStore();
    const response = await handleCreateRedditScanRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/scans/reddit" },
        body: {
          subreddit: "opportunity",
          limit: 1,
          mode: "fixture"
        }
      }),
      persistence
    );

    expect(response.ok).toBe(true);
    if (!response.ok) return;

    const opportunity = response.data.opportunities[0]!;
    await expect(persistence.resolveOpportunityRecordId(opportunity.opportunityId)).resolves.toBe(
      opportunity.provenance.generationOutputId
    );
    await expect(persistence.getScanResult(response.data.scanId)).resolves.toEqual(response.data);
    await expect(persistence.listScanResults()).resolves.toEqual([response.data]);

    const feedbackStore = createInMemoryFeedbackStore({
      clock: () => "2026-07-07T00:00:00.000Z",
      idFactory: () => "feedback-scan-linked"
    });
    const feedback = await handleCreateFeedbackRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/feedback" },
        body: {
          ...syntheticApiFeedbackRequestBody,
          opportunityId: opportunity.opportunityId
        }
      }),
      feedbackStore,
      {
        resolveOpportunityRecordId: (opportunityId) => persistence.resolveOpportunityRecordId(opportunityId)
      }
    );

    expect(feedback.ok).toBe(true);
    if (feedback.ok) {
      expect(feedback.data.opportunityRecordId).toBe(opportunity.provenance.generationOutputId);
    }
  });

  it("writes scan, raw, normalized, generated opportunity, ranking, and feedback-compatible records", async () => {
    const scanRunRecord = createDelegate();
    const rawSourceContent = createDelegate();
    const normalizedContent = createDelegate();
    const analysisResult = createDelegate();
    const candidateOpportunityRecord = createDelegate();
    const generatedOpportunityRecord = createDelegate();
    const opportunityRankingResult = createDelegate();
    const opportunityRankingItem = createDelegate();
    const database: ApiScanPersistenceDatabaseClient = {
      scanRunRecord,
      rawSourceContent,
      normalizedContent,
      analysisResult,
      candidateOpportunityRecord,
      generatedOpportunityRecord,
      opportunityRankingResult,
      opportunityRankingItem
    };
    const persistence = createDatabaseScanPersistenceStore(database);
    const result = await runOpportunityScanPipeline({
      subreddit: "opportunity",
      limit: 1,
      mode: "fixture",
      correlationId: "correlation-persistence-test",
      requestedAt: "2026-07-07T00:00:00.000Z",
      env: {}
    });

    await persistence.persistScanResult({
      result,
      persistedAt: "2026-07-07T00:00:00.000Z"
    });

    expect(scanRunRecord.calls).toHaveLength(1);
    expect(rawSourceContent.calls).toHaveLength(1);
    expect(normalizedContent.calls).toHaveLength(1);
    expect(analysisResult.calls).toHaveLength(1);
    expect(candidateOpportunityRecord.calls).toHaveLength(1);
    expect(generatedOpportunityRecord.calls).toHaveLength(1);
    expect(opportunityRankingResult.calls).toHaveLength(1);
    expect(opportunityRankingItem.calls).toHaveLength(1);
    await expect(persistence.resolveOpportunityRecordId(result.opportunities[0]!.opportunityId)).resolves.toBe(
      result.opportunities[0]!.provenance.generationOutputId
    );

    const serialized = JSON.stringify({
      scanRunRecord: scanRunRecord.calls,
      rawSourceContent: rawSourceContent.calls,
      generatedOpportunityRecord: generatedOpportunityRecord.calls,
      opportunityRankingItem: opportunityRankingItem.calls
    });
    expect(serialized).not.toMatch(/api[_-]?key|access[_-]?token|refresh[_-]?token|password|secret|authorization|bearer|raw provider|stack trace/iu);
  });

  it("queries recoverable jobs without an invalid nullable JSON filter", async () => {
    const scanRunRecord = {
      ...createDelegate(),
      async findMany(args: unknown) {
        scanRunRecord.calls.push(args);
        return [];
      }
    };
    const database: ApiScanPersistenceDatabaseClient = {
      scanRunRecord,
      rawSourceContent: createDelegate(),
      normalizedContent: createDelegate(),
      analysisResult: createDelegate(),
      candidateOpportunityRecord: createDelegate(),
      generatedOpportunityRecord: createDelegate(),
      opportunityRankingResult: createDelegate(),
      opportunityRankingItem: createDelegate()
    };

    await createDatabaseScanPersistenceStore(database).listRecoverableScanJobs();

    expect(scanRunRecord.calls).toHaveLength(1);
    expect(scanRunRecord.calls[0]).toMatchObject({
      where: {
        status: {
          in: [API_SCAN_JOB_STATUSES.queued, API_SCAN_JOB_STATUSES.running]
        }
      }
    });
    expect(JSON.stringify(scanRunRecord.calls[0])).not.toContain('"result":null');
  });
});
