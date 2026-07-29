import { describe, expect, it } from "vitest";
import {
  createDatabaseScanPersistenceStore,
  createInMemoryScanPersistenceStore,
  createLocalApiDispatcher,
  createOwnerScope,
  LOCAL_DEVELOPMENT_PRINCIPAL_ID,
  runOpportunityScanPipeline,
  type ApiScanPersistenceDatabaseClient,
  type ApiScanPersistenceDatabaseDelegate
} from "../index.js";

const ownerA = "owner-a@example.test";
const ownerB = "owner-b@example.test";
const scanId = "scan-owned-1";

describe("transactional owned scan deletion", () => {
  it("deletes every private descendant in dependency order and leaves no graph rows", async () => {
    const harness = createDeletionHarness();
    const store = createDatabaseScanPersistenceStore(harness.database);

    await expect(store.deleteScanResult(createOwnerScope(ownerA), scanId)).resolves.toBe(true);

    expect(harness.committedDeletes()).toEqual([
      "privateBetaFeedback",
      "opportunityRankingItem",
      "opportunityRankingResult",
      "generatedOpportunityRecord",
      "candidateOpportunityRecord",
      "evidenceClusterMembership",
      "evidenceCluster",
      "analysisResult",
      "normalizedContent",
      "rawSourceContent",
      "scanRunRecord:jobs",
      "scanRunRecord:scan"
    ]);
    expect(harness.isScanPresent()).toBe(false);
    expect(harness.remainingGraphRows()).toBe(0);
    expect(harness.deleteArguments("privateBetaFeedback")).toMatchObject({
      where: {
        ownerPrincipalId: ownerA,
        OR: [
          { opportunityRecordId: { in: ["generated-1"] } },
          { opportunityId: { in: ["opportunity-1"] } }
        ]
      }
    });
    expect(harness.deleteArguments("scanRunRecord:scan")).toEqual({
      where: { id: scanId, ownerPrincipalId: ownerA }
    });
  });

  it("rolls back the whole deletion when one descendant delete fails", async () => {
    const harness = createDeletionHarness("generatedOpportunityRecord");
    const store = createDatabaseScanPersistenceStore(harness.database);

    await expect(store.deleteScanResult(createOwnerScope(ownerA), scanId)).rejects.toThrow("injected deletion failure");

    expect(harness.attemptedDeletes()).toContain("privateBetaFeedback");
    expect(harness.attemptedDeletes()).toContain("generatedOpportunityRecord");
    expect(harness.committedDeletes()).toEqual([]);
    expect(harness.isScanPresent()).toBe(true);
    expect(harness.remainingGraphRows()).toBe(12);
  });

  it("is safe to repeat and denies a different owner without revealing graph state", async () => {
    const harness = createDeletionHarness();
    const store = createDatabaseScanPersistenceStore(harness.database);

    await expect(store.deleteScanResult(createOwnerScope(ownerB), scanId)).resolves.toBe(false);
    expect(harness.attemptedDeletes()).toEqual([]);
    expect(harness.isScanPresent()).toBe(true);

    await expect(store.deleteScanResult(createOwnerScope(ownerA), scanId)).resolves.toBe(true);
    const committedCount = harness.committedDeletes().length;
    await expect(store.deleteScanResult(createOwnerScope(ownerA), scanId)).resolves.toBe(false);
    expect(harness.committedDeletes()).toHaveLength(committedCount);
  });

  it("removes in-memory results, generated identifiers, and linked scan jobs", async () => {
    const result = await runOpportunityScanPipeline({
      source: "stack-exchange",
      site: "stackoverflow",
      query: "transactional deletion",
      tags: [],
      limit: 1,
      mode: "fixture",
      correlationId: "correlation-transactional-deletion",
      requestedAt: "2026-07-29T08:00:00.000Z"
    });
    const scope = createOwnerScope(ownerA);
    const store = createInMemoryScanPersistenceStore({ initialResults: [{ ownerPrincipalId: ownerA, result }] });
    const opportunity = result.opportunities[0]!;
    await store.createScanJob({
      jobId: "job-linked-to-result",
      ownerPrincipalId: ownerA,
      status: "completed",
      request: { source: "stack-exchange", site: "stackoverflow", query: "transactional deletion", tags: [], limit: 1, mode: "fixture" },
      requestedAt: "2026-07-29T08:00:00.000Z",
      updatedAt: "2026-07-29T08:00:01.000Z",
      resultScanId: result.scanId,
      safeMessage: "Scan completed."
    });

    await expect(store.deleteScanResult(scope, result.scanId)).resolves.toBe(true);
    await expect(store.getScanResult(scope, result.scanId)).resolves.toBeUndefined();
    await expect(store.resolveOpportunityRecordId(scope, opportunity.opportunityId)).resolves.toBeUndefined();
    await expect(store.getScanJob(scope, "job-linked-to-result")).resolves.toBeUndefined();
    await expect(store.listScanResults(scope)).resolves.toEqual([]);
    await expect(store.deleteScanResult(scope, result.scanId)).resolves.toBe(false);
  });

  it("makes deleted scans and derived identifiers unavailable through old API paths", async () => {
    const result = await runOpportunityScanPipeline({
      source: "stack-exchange",
      site: "stackoverflow",
      query: "stale deletion path",
      tags: [],
      limit: 1,
      mode: "fixture",
      correlationId: "correlation-stale-deletion-path",
      requestedAt: "2026-07-29T08:05:00.000Z"
    });
    const store = createInMemoryScanPersistenceStore({ initialResults: [{ ownerPrincipalId: LOCAL_DEVELOPMENT_PRINCIPAL_ID, result }] });
    const dispatch = createLocalApiDispatcher({ scanPersistence: store });
    const opportunity = result.opportunities[0]!;

    const deletion = await dispatch({ method: "DELETE", path: `/scans/${result.scanId}`, body: {}, headers: {} });
    expect(deletion.ok).toBe(true);
    for (const path of [
      `/scans/${result.scanId}`,
      `/opportunities/${opportunity.opportunityId}`,
      `/rankings/${opportunity.provenance.rankingRunId}`
    ]) {
      const staleLookup = await dispatch({ method: "GET", path, headers: {} });
      expect(staleLookup.ok ? 200 : staleLookup.error.statusCode).toBe(404);
    }
    const scans = await dispatch({ method: "GET", path: "/scans", headers: {} });
    expect(scans.ok && (scans.data as { scans: readonly unknown[] }).scans).toEqual([]);
  });
});

type GraphState = {
  scanPresent: boolean;
  rowCount: number;
};

function createDeletionHarness(failDelegate?: string) {
  let state: GraphState = { scanPresent: true, rowCount: 12 };
  const committed: Array<{ name: string; args: unknown }> = [];
  const attempted: Array<{ name: string; args: unknown }> = [];

  function createClient(transactionState: GraphState, staged: Array<{ name: string; args: unknown }>): ApiScanPersistenceDatabaseClient {
    const rows: Record<string, readonly Record<string, unknown>[]> = {
      rawSourceContent: [{ id: "raw-1" }],
      normalizedContent: [{ id: "normalized-1" }],
      analysisResult: [{ id: "analysis-1" }],
      evidenceCluster: [{ id: "cluster-1" }],
      evidenceClusterMembership: [{ id: "membership-1", rawSourceContentId: "raw-1", normalizedContentId: "normalized-1", analysisResultId: "analysis-1" }],
      candidateOpportunityRecord: [{ id: "candidate-1" }],
      generatedOpportunityRecord: [{ id: "generated-1" }],
      opportunityRankingResult: [{ id: "ranking-1" }],
      opportunityRankingItem: [{ id: "ranking-item-1", generatedOpportunityId: "generated-1" }]
    };

    function delegate(name: string): ApiScanPersistenceDatabaseDelegate {
      return {
        async upsert() { return {}; },
        async findUnique(args) {
          if (name !== "scanRunRecord" || !transactionState.scanPresent) return null;
          const where = readWhere(args);
          if (where.id !== scanId || where.ownerPrincipalId !== ownerA) return null;
          return { id: scanId, result: { opportunities: [{ opportunityId: "opportunity-1" }] } };
        },
        async findMany() {
          return rows[name] ?? [];
        },
        async deleteMany(args) {
          const deleteName = name === "scanRunRecord"
            ? readWhere(args).id === scanId ? "scanRunRecord:scan" : "scanRunRecord:jobs"
            : name;
          const call = { name: deleteName, args };
          attempted.push(call);
          staged.push(call);
          if (name === failDelegate) throw new Error("injected deletion failure");
          if (deleteName === "scanRunRecord:scan") {
            const count = transactionState.scanPresent ? 1 : 0;
            transactionState.scanPresent = false;
            if (count > 0) transactionState.rowCount = 0;
            return { count };
          }
          return { count: 1 };
        }
      };
    }

    return {
      scanRunRecord: delegate("scanRunRecord"),
      rawSourceContent: delegate("rawSourceContent"),
      normalizedContent: delegate("normalizedContent"),
      analysisResult: delegate("analysisResult"),
      evidenceCluster: delegate("evidenceCluster"),
      evidenceClusterMembership: delegate("evidenceClusterMembership"),
      candidateOpportunityRecord: delegate("candidateOpportunityRecord"),
      generatedOpportunityRecord: delegate("generatedOpportunityRecord"),
      opportunityRankingResult: delegate("opportunityRankingResult"),
      opportunityRankingItem: delegate("opportunityRankingItem"),
      privateBetaFeedback: delegate("privateBetaFeedback")
    };
  }

  const database: ApiScanPersistenceDatabaseClient = {
    ...createClient(state, []),
    async transaction<T>(operation: (transaction: ApiScanPersistenceDatabaseClient) => Promise<T>) {
      const transactionState = { ...state };
      const staged: Array<{ name: string; args: unknown }> = [];
      const result = await operation(createClient(transactionState, staged));
      state = transactionState;
      committed.push(...staged);
      return result;
    }
  };

  return {
    database,
    committedDeletes: () => committed.map((call) => call.name),
    attemptedDeletes: () => attempted.map((call) => call.name),
    deleteArguments: (name: string) => committed.find((call) => call.name === name)?.args,
    isScanPresent: () => state.scanPresent,
    remainingGraphRows: () => state.rowCount
  };
}

function readWhere(args: unknown): Record<string, unknown> {
  if (!args || typeof args !== "object") return {};
  const where = (args as Record<string, unknown>).where;
  return where && typeof where === "object" ? where as Record<string, unknown> : {};
}
