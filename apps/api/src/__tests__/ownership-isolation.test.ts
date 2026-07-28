import { describe, expect, it, vi } from "vitest";
import {
  API_SCAN_JOB_STATUSES,
  createDatabaseScanPersistenceStore,
  createInMemoryScanPersistenceStore,
  createLocalApiDispatcher,
  createOwnerScope,
  runOpportunityScanPipeline,
  type ApiInviteStore,
  type ApiScanPersistenceDatabaseClient
} from "../index.js";

const ownerA = "owner-a@example.com";
const ownerB = "owner-b@example.com";
const scopeA = createOwnerScope(ownerA);
const scopeB = createOwnerScope(ownerB);
const tokenA = `ses_${"a".repeat(43)}`;
const tokenB = `ses_${"b".repeat(43)}`;
const origin = "https://web.example.test";

describe("authenticated user ownership isolation", () => {
  it("isolates scans, opportunities, rankings, feedback, jobs, and identifier guesses", async () => {
    const [scanA, baseScanB] = await Promise.all([
      createScan("alpha", "2026-07-28T12:00:00.000Z"),
      createScan("bravo", "2026-07-28T12:01:00.000Z")
    ]);
    const scanB = makeDistinctScan(baseScanB, "owner-b");
    const persistence = createInMemoryScanPersistenceStore({
      initialResults: [
        { ownerPrincipalId: ownerA, result: scanA },
        { ownerPrincipalId: ownerB, result: scanB }
      ]
    });
    await persistence.createScanJob({
      jobId: "job-owner-a",
      ownerPrincipalId: ownerA,
      status: API_SCAN_JOB_STATUSES.failed,
      request: { source: "stack-exchange", site: "stackoverflow", query: "alpha", tags: [], limit: 1, mode: "fixture" },
      requestedAt: "2026-07-28T12:00:00.000Z",
      updatedAt: "2026-07-28T12:00:01.000Z",
      safeMessage: "Scan failed safely."
    });
    const dispatch = createLocalApiDispatcher({
      scanPersistence: persistence,
      inviteStore: createTwoUserInviteStore(),
      requireAuthentication: true,
      allowedOrigins: [origin],
      adminAccessToken: "admin-test-token"
    });

    const listA = await dispatch(authenticated("GET", "/scans", tokenA));
    expect(listA.ok && (listA.data as { scans: Array<{ scanId: string }> }).scans.map((scan) => scan.scanId)).toEqual([scanA.scanId]);
    const crossScan = await dispatch(authenticated("GET", `/scans/${scanB.scanId}`, tokenA));
    expect(crossScan.ok).toBe(false);
    expect(crossScan.ok ? 200 : crossScan.error.statusCode).toBe(404);

    const opportunities = await dispatch(authenticated("GET", "/opportunities", tokenA));
    expect(opportunities.ok && (opportunities.data as { opportunities: Array<{ opportunityId: string }> }).opportunities.map((item) => item.opportunityId))
      .toEqual(scanA.opportunities.map((item) => item.opportunityId));
    const crossOpportunity = await dispatch(authenticated("GET", `/opportunities/${scanB.opportunities[0]!.opportunityId}`, tokenA));
    expect(crossOpportunity.ok ? 200 : crossOpportunity.error.statusCode).toBe(404);
    const crossRanking = await dispatch(authenticated("GET", `/rankings/${scanB.opportunities[0]!.provenance.rankingRunId}`, tokenA));
    expect(crossRanking.ok ? 200 : crossRanking.error.statusCode).toBe(404);
    const crossRankRequest = await dispatch(authenticated("POST", "/rankings", tokenA, { opportunityIds: [scanB.opportunities[0]!.opportunityId] }));
    expect(crossRankRequest.ok ? 200 : crossRankRequest.error.statusCode).toBe(404);

    const ownFeedback = await dispatch(authenticated("POST", "/feedback", tokenA, {
      opportunityId: scanA.opportunities[0]!.opportunityId,
      status: "saved",
      reasonCategories: [],
      ratings: []
    }));
    expect(ownFeedback.ok).toBe(true);
    const feedbackId = ownFeedback.ok ? (ownFeedback.data as { feedbackId: string }).feedbackId : "missing";
    const crossFeedback = await dispatch(authenticated("GET", `/feedback/${feedbackId}`, tokenB));
    expect(crossFeedback.ok ? 200 : crossFeedback.error.statusCode).toBe(404);
    const crossFeedbackList = await dispatch(authenticated("GET", "/feedback", tokenB));
    expect(crossFeedbackList.ok && (crossFeedbackList.data as { totalCount: number }).totalCount).toBe(0);
    const crossFeedbackDelete = await dispatch(authenticated("DELETE", `/feedback/${feedbackId}`, tokenB, {}));
    expect(crossFeedbackDelete.ok ? 200 : crossFeedbackDelete.error.statusCode).toBe(404);
    const crossCreateFeedback = await dispatch(authenticated("POST", "/feedback", tokenA, {
      opportunityId: scanB.opportunities[0]!.opportunityId,
      status: "saved",
      reasonCategories: [],
      ratings: []
    }));
    expect(crossCreateFeedback.ok ? 200 : crossCreateFeedback.error.statusCode).toBe(404);

    const crossJob = await dispatch(authenticated("GET", "/scan-jobs/job-owner-a", tokenB));
    expect(crossJob.ok ? 200 : crossJob.error.statusCode).toBe(404);
    const crossCancel = await dispatch(authenticated("POST", "/scan-jobs/job-owner-a/cancel", tokenB, {}));
    expect(crossCancel.ok ? 200 : crossCancel.error.statusCode).toBe(404);
    const crossRetry = await dispatch(authenticated("POST", "/scan-jobs/job-owner-a/retry", tokenB, {}));
    expect(crossRetry.ok ? 200 : crossRetry.error.statusCode).toBe(404);
    const crossDelete = await dispatch(authenticated("DELETE", `/scans/${scanA.scanId}`, tokenB, {}));
    expect(crossDelete.ok ? 200 : crossDelete.error.statusCode).toBe(404);
    expect(await persistence.getScanResult(scopeA, scanA.scanId)).toBeDefined();
    expect(await persistence.getScanResult(scopeB, scanA.scanId)).toBeUndefined();
  });

  it("permits only an explicit authorized read-only administrator override and records an audit event", async () => {
    const scan = await createScan("legacy", "2026-07-28T12:02:00.000Z");
    const persistence = createInMemoryScanPersistenceStore({ initialResults: [{ ownerPrincipalId: ownerA, result: scan }] });
    const dispatch = createLocalApiDispatcher({
      scanPersistence: persistence,
      inviteStore: createTwoUserInviteStore(),
      requireAuthentication: true,
      allowedOrigins: [origin],
      adminAccessToken: "admin-test-token"
    });
    const output = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const authorized = await dispatch({ method: "GET", path: "/scans", headers: { "x-opportunity-os-admin-override": "true", "x-opportunity-os-admin-token": "admin-test-token" } });
    const rejectedWrite = await dispatch({ method: "DELETE", path: `/scans/${scan.scanId}`, headers: { "x-opportunity-os-admin-override": "true", "x-opportunity-os-admin-token": "admin-test-token", origin } });
    expect(authorized.ok).toBe(true);
    expect(rejectedWrite.ok ? 200 : rejectedWrite.error.statusCode).toBe(401);
    expect(output.mock.calls.flat().join(" ")).toContain("ownership.administrator_override");
    output.mockRestore();
  });

  it("assigns the owner within the database persistence transaction", async () => {
    const scan = await createScan("transaction", "2026-07-28T12:03:00.000Z");
    const calls: unknown[] = [];
    const delegate = { async upsert(args: unknown) { calls.push(args); return {}; } };
    const database: ApiScanPersistenceDatabaseClient = {
      scanRunRecord: delegate,
      rawSourceContent: delegate,
      normalizedContent: delegate,
      analysisResult: delegate,
      candidateOpportunityRecord: delegate,
      generatedOpportunityRecord: delegate,
      opportunityRankingResult: delegate,
      opportunityRankingItem: delegate,
      async transaction(operation) {
        calls.push("transaction-start");
        const result = await operation(this);
        calls.push("transaction-complete");
        return result;
      }
    };
    await createDatabaseScanPersistenceStore(database).persistScanResult({
      result: scan,
      persistedAt: "2026-07-28T12:03:01.000Z",
      ownerPrincipalId: ownerA
    });
    expect(calls[0]).toBe("transaction-start");
    expect(calls.at(-1)).toBe("transaction-complete");
    expect(JSON.stringify(calls)).toContain(`\"ownerPrincipalId\":\"${ownerA}\"`);
  });
});

async function createScan(query: string, requestedAt: string) {
  return runOpportunityScanPipeline({ source: "stack-exchange", site: "stackoverflow", query, tags: [], limit: 1, mode: "fixture", correlationId: `correlation-${query}`, requestedAt });
}

function makeDistinctScan<T extends Awaited<ReturnType<typeof createScan>>>(scan: T, suffix: string): T {
  return {
    ...scan,
    scanId: `${scan.scanId}-${suffix}`,
    opportunities: scan.opportunities.map((opportunity) => ({
      ...opportunity,
      opportunityId: `${opportunity.opportunityId}-${suffix}`,
      evidence: opportunity.evidence.map((evidence) => ({ ...evidence, evidenceId: `${evidence.evidenceId}-${suffix}` })),
      provenance: {
        ...opportunity.provenance,
        scanId: `${scan.scanId}-${suffix}`,
        rawContentId: `${opportunity.provenance.rawContentId}-${suffix}`,
        normalizedContentId: `${opportunity.provenance.normalizedContentId}-${suffix}`,
        analysisRequestId: `${opportunity.provenance.analysisRequestId}-${suffix}`,
        candidateId: `${opportunity.provenance.candidateId}-${suffix}`,
        generationOutputId: `${opportunity.provenance.generationOutputId}-${suffix}`,
        rankingRunId: `${opportunity.provenance.rankingRunId}-${suffix}`
      }
    }))
  } as T;
}

function authenticated(method: string, path: string, token: string, body?: unknown) {
  return { method, path, body, headers: { "x-opportunity-os-session-id": token, origin } };
}

function createTwoUserInviteStore(): ApiInviteStore {
  return {
    async createInvite() { throw new Error("not used"); },
    async acceptInvite() { return { accepted: false, reason: "invite_not_found", safeMessage: "Invite is not valid." }; },
    async getSession(token) {
      const principalId = token === tokenA ? ownerA : token === tokenB ? ownerB : undefined;
      return principalId ? {
        status: "active",
        principal: { principalId, displayName: principalId, permissions: ["private-beta:access"] },
        createdAt: "2026-07-28T12:00:00.000Z",
        expiresAt: "2099-07-28T12:00:00.000Z"
      } : undefined;
    },
    async revokeSession() { return false; },
    async revokeInvite() { return false; }
  };
}
