import type { ApiScanOpportunityDto, ApiScanRequest, ApiScanResultDto } from "../pipeline/index.js";
import { ownerWhere, ownsPrincipal, type ApiOwnershipScope } from "../ownership/index.js";

export const API_SCAN_JOB_STATUSES = {
  queued: "queued",
  running: "running",
  completed: "completed",
  failed: "failed",
  cancelled: "cancelled"
} as const;

export type ApiScanJobStatus = (typeof API_SCAN_JOB_STATUSES)[keyof typeof API_SCAN_JOB_STATUSES];

export interface ApiScanJobRecord {
  readonly jobId: string;
  readonly ownerPrincipalId: string;
  readonly status: ApiScanJobStatus;
  readonly request: ApiScanRequest;
  readonly requestedAt: string;
  readonly updatedAt: string;
  readonly resultScanId?: string;
  readonly safeMessage: string;
}

export interface ApiScanPersistenceInput {
  readonly result: ApiScanResultDto;
  readonly persistedAt: string;
  readonly ownerPrincipalId: string;
}

export interface ApiScanPersistenceStore {
  readonly persistScanResult: (input: ApiScanPersistenceInput) => Promise<void>;
  readonly resolveOpportunityRecordId: (scope: ApiOwnershipScope, opportunityId: string) => Promise<string | undefined>;
  readonly getScanResult: (scope: ApiOwnershipScope, scanId: string) => Promise<ApiScanResultDto | undefined>;
  readonly listScanResults: (scope: ApiOwnershipScope, limit?: number) => Promise<readonly ApiScanResultDto[]>;
  readonly createScanJob: (job: ApiScanJobRecord) => Promise<void>;
  readonly updateScanJob: (job: ApiScanJobRecord) => Promise<void>;
  readonly getScanJob: (scope: ApiOwnershipScope, jobId: string) => Promise<ApiScanJobRecord | undefined>;
  readonly listRecoverableScanJobs: () => Promise<readonly ApiScanJobRecord[]>;
  readonly deleteScanResult: (scope: ApiOwnershipScope, scanId: string) => Promise<boolean>;
}

export interface ApiScanPersistenceRecord {
  readonly scanId: string;
  readonly ownerPrincipalId: string;
  readonly opportunityIds: readonly string[];
  readonly opportunityRecordIds: Readonly<Record<string, string>>;
}

export interface InMemoryScanPersistenceInput {
  readonly initialRecords?: readonly ApiScanPersistenceRecord[];
  readonly initialResults?: readonly { readonly ownerPrincipalId: string; readonly result: ApiScanResultDto }[];
}

const unsafePersistencePattern =
  /(?:\bsk-[a-z0-9_-]{16,}|\bbearer\s+[a-z0-9._~+\/-]{12,}|\b(?:api[_ -]?key|access[_ -]?token|refresh[_ -]?token|client[_ -]?secret|password|credential)\b\s*[:=]\s*["']?[a-z0-9._~+\/-]{8,})/iu;

export function createNoopScanPersistenceStore(): ApiScanPersistenceStore {
  return {
    async persistScanResult() {
      return undefined;
    },
    async resolveOpportunityRecordId() {
      return undefined;
    },
    async getScanResult() {
      return undefined;
    },
    async listScanResults() {
      return [];
    },
    async createScanJob() {
      return undefined;
    },
    async updateScanJob() {
      return undefined;
    },
    async getScanJob() {
      return undefined;
    },
    async listRecoverableScanJobs() {
      return [];
    },
    async deleteScanResult() {
      return false;
    }
  };
}

export function createInMemoryScanPersistenceStore(input: InMemoryScanPersistenceInput = {}): ApiScanPersistenceStore {
  const records = new Map<string, ApiScanPersistenceRecord>();
  const opportunityRecordIds = new Map<string, string>();
  const results = new Map<string, ApiScanResultDto>();
  const jobs = new Map<string, ApiScanJobRecord>();

  for (const record of input.initialRecords ?? []) {
    records.set(record.scanId, cloneRecord(record));
    for (const [opportunityId, recordId] of Object.entries(record.opportunityRecordIds)) {
      opportunityRecordIds.set(opportunityId, recordId);
    }
  }
  for (const item of input.initialResults ?? []) {
    const record = toScanPersistenceRecord(item.result, item.ownerPrincipalId);
    records.set(record.scanId, cloneRecord(record));
    results.set(item.result.scanId, structuredClone(item.result));
    for (const [opportunityId, recordId] of Object.entries(record.opportunityRecordIds)) {
      opportunityRecordIds.set(opportunityId, recordId);
    }
  }

  return {
    async persistScanResult({ result, ownerPrincipalId }) {
      assertSafePersistencePayload(result);
      const record = toScanPersistenceRecord(result, ownerPrincipalId);
      records.set(record.scanId, cloneRecord(record));
      results.set(result.scanId, structuredClone(result));
      for (const [opportunityId, recordId] of Object.entries(record.opportunityRecordIds)) {
        opportunityRecordIds.set(opportunityId, recordId);
      }
    },
    async resolveOpportunityRecordId(scope, opportunityId) {
      const record = [...records.values()].find((candidate) =>
        ownsPrincipal(scope, candidate.ownerPrincipalId) && candidate.opportunityIds.includes(opportunityId)
      );
      return record?.opportunityRecordIds[opportunityId];
    },
    async getScanResult(scope, scanId) {
      const record = records.get(scanId);
      if (!record || !ownsPrincipal(scope, record.ownerPrincipalId)) return undefined;
      const result = results.get(scanId);
      return result ? structuredClone(result) : undefined;
    },
    async listScanResults(scope, limit = 10) {
      return [...results.entries()]
        .filter(([scanId]) => {
          const record = records.get(scanId);
          return record !== undefined && ownsPrincipal(scope, record.ownerPrincipalId);
        })
        .map(([, result]) => result)
        .slice(-Math.max(1, Math.min(limit, 25))).reverse().map((result) => structuredClone(result));
    },
    async createScanJob(job) {
      assertSafePersistencePayload(job);
      jobs.set(job.jobId, structuredClone(job));
    },
    async updateScanJob(job) {
      assertSafePersistencePayload(job);
      jobs.set(job.jobId, structuredClone(job));
    },
    async getScanJob(scope, jobId) {
      const job = jobs.get(jobId);
      return job && ownsPrincipal(scope, job.ownerPrincipalId) ? structuredClone(job) : undefined;
    },
    async listRecoverableScanJobs() {
      return [...jobs.values()]
        .filter((job) => job.status === API_SCAN_JOB_STATUSES.queued || job.status === API_SCAN_JOB_STATUSES.running)
        .map((job) => structuredClone(job));
    },
    async deleteScanResult(scope, scanId) {
      const owned = records.get(scanId);
      if (!owned || !ownsPrincipal(scope, owned.ownerPrincipalId)) return false;
      const existed = results.delete(scanId);
      const record = records.get(scanId);
      records.delete(scanId);
      for (const [jobId, job] of jobs.entries()) {
        if (job.ownerPrincipalId === scope.principalId && (job.jobId === scanId || job.resultScanId === scanId)) {
          jobs.delete(jobId);
        }
      }
      for (const opportunityId of record?.opportunityIds ?? []) opportunityRecordIds.delete(opportunityId);
      return existed || record !== undefined;
    }
  };
}

export function toScanPersistenceRecord(result: ApiScanResultDto, ownerPrincipalId: string): ApiScanPersistenceRecord {
  return {
    scanId: result.scanId,
    ownerPrincipalId,
    opportunityIds: result.opportunities.map((opportunity) => opportunity.opportunityId),
    opportunityRecordIds: Object.fromEntries(
      result.opportunities.map((opportunity) => [
        opportunity.opportunityId,
        toOwnedPersistenceId(result.scanId, opportunity.provenance.generationOutputId)
      ])
    )
  };
}

export function assertSafePersistencePayload(value: unknown): void {
  const serialized = JSON.stringify(value);
  if (unsafePersistencePattern.test(serialized)) {
    throw new Error("Persistence payload contains unsafe operational details.");
  }
}

function cloneRecord(record: ApiScanPersistenceRecord): ApiScanPersistenceRecord {
  return {
    scanId: record.scanId,
    ownerPrincipalId: record.ownerPrincipalId,
    opportunityIds: [...record.opportunityIds],
    opportunityRecordIds: { ...record.opportunityRecordIds }
  };
}

export interface ApiScanPersistenceDatabaseDelegate<TArgs = unknown> {
  readonly upsert: (args: TArgs) => Promise<unknown>;
  readonly findUnique?: (args: unknown) => Promise<unknown>;
  readonly findMany?: (args: unknown) => Promise<readonly unknown[]>;
  readonly delete?: (args: unknown) => Promise<unknown>;
  readonly deleteMany?: (args: unknown) => Promise<unknown>;
}

export interface ApiScanPersistenceDatabaseClient {
  readonly scanRunRecord: ApiScanPersistenceDatabaseDelegate;
  readonly rawSourceContent: ApiScanPersistenceDatabaseDelegate;
  readonly normalizedContent: ApiScanPersistenceDatabaseDelegate;
  readonly analysisResult: ApiScanPersistenceDatabaseDelegate;
  readonly evidenceCluster?: ApiScanPersistenceDatabaseDelegate;
  readonly evidenceClusterMembership?: ApiScanPersistenceDatabaseDelegate;
  readonly candidateOpportunityRecord: ApiScanPersistenceDatabaseDelegate;
  readonly generatedOpportunityRecord: ApiScanPersistenceDatabaseDelegate;
  readonly opportunityRankingResult: ApiScanPersistenceDatabaseDelegate;
  readonly opportunityRankingItem: ApiScanPersistenceDatabaseDelegate;
  readonly privateBetaFeedback?: ApiScanPersistenceDatabaseDelegate;
  readonly transaction?: <T>(operation: (database: ApiScanPersistenceDatabaseClient) => Promise<T>) => Promise<T>;
}

export function createDatabaseScanPersistenceStore(database: ApiScanPersistenceDatabaseClient): ApiScanPersistenceStore {
  const memory = createInMemoryScanPersistenceStore();

  return {
    async persistScanResult(input) {
      assertSafePersistencePayload(input.result);
      if (database.transaction) {
        await database.transaction((transaction) => persistToDatabase(transaction, input));
      } else {
        await persistToDatabase(database, input);
      }
      await memory.persistScanResult(input);
    },
    async resolveOpportunityRecordId(scope, opportunityId) {
      const memoryRecordId = await memory.resolveOpportunityRecordId(scope, opportunityId);
      if (memoryRecordId) return memoryRecordId;
      const results = await this.listScanResults(scope, 25);
      const opportunity = results.flatMap((result) =>
        result.opportunities.map((item) => ({ result, item }))
      ).find(({ item }) => item.opportunityId === opportunityId);
      return opportunity
        ? toOwnedPersistenceId(opportunity.result.scanId, opportunity.item.provenance.generationOutputId)
        : undefined;
    },
    async getScanResult(scope, scanId) {
      const record = await database.scanRunRecord.findUnique?.({
        where: { id: scanId, ...ownerWhere(scope) },
        select: { result: true }
      });
      if (!record || typeof record !== "object" || !("result" in record) || !record.result) return undefined;
      assertSafePersistencePayload(record.result);
      return record.result as ApiScanResultDto;
    },
    async listScanResults(scope, limit = 10) {
      const records = await database.scanRunRecord.findMany?.({
        where: { result: { not: null }, ...ownerWhere(scope) },
        orderBy: { completedAt: "desc" },
        take: Math.max(1, Math.min(limit, 25)),
        select: { result: true }
      }) ?? [];
      return records.flatMap((record) => {
        if (!record || typeof record !== "object" || !("result" in record) || !record.result) return [];
        assertSafePersistencePayload(record.result);
        return [record.result as ApiScanResultDto];
      });
    },
    async createScanJob(job) {
      assertSafePersistencePayload(job);
      await upsertScanJob(database, job);
      await memory.createScanJob(job);
    },
    async updateScanJob(job) {
      assertSafePersistencePayload(job);
      await upsertScanJob(database, job);
      await memory.updateScanJob(job);
    },
    async getScanJob(scope, jobId) {
      const memoryJob = await memory.getScanJob(scope, jobId);
      if (memoryJob) return memoryJob;
      const record = await database.scanRunRecord.findUnique?.({
        where: { id: jobId, ...ownerWhere(scope) },
        select: { id: true, ownerPrincipalId: true, status: true, source: true, safeMetadata: true, startedAt: true, updatedAt: true }
      });
      return toScanJobRecord(record);
    },
    async listRecoverableScanJobs() {
      const records = await database.scanRunRecord.findMany?.({
        where: { status: { in: [API_SCAN_JOB_STATUSES.queued, API_SCAN_JOB_STATUSES.running] } },
        orderBy: { startedAt: "asc" },
        take: 25,
        select: { id: true, ownerPrincipalId: true, status: true, source: true, safeMetadata: true, startedAt: true, updatedAt: true }
      }) ?? [];
      return records.flatMap((record) => {
        const job = toScanJobRecord(record);
        return job ? [job] : [];
      });
    },
    async deleteScanResult(scope, scanId) {
      if (!database.transaction) {
        throw new Error("Transactional scan deletion is unavailable.");
      }
      const deleted = await database.transaction((transaction) => deleteOwnedScanGraph(transaction, scope, scanId));
      if (deleted) await memory.deleteScanResult(scope, scanId);
      return deleted;
    }
  };
}

async function deleteOwnedScanGraph(
  database: ApiScanPersistenceDatabaseClient,
  scope: ApiOwnershipScope,
  scanId: string
): Promise<boolean> {
  const scan = await requireFindUnique(database.scanRunRecord, {
    where: { id: scanId, ...ownerWhere(scope) },
    select: { id: true, result: true }
  });
  if (!scan) return false;

  const rawRows = await requireFindMany(database.rawSourceContent, {
    where: { scanId },
    select: { id: true }
  });
  const rawIds = readIds(rawRows);
  const normalizedRows = rawIds.length > 0
    ? await requireFindMany(database.normalizedContent, {
      where: { rawSourceContentId: { in: rawIds } },
      select: { id: true }
    })
    : [];
  const normalizedIds = readIds(normalizedRows);
  const analysisRows = normalizedIds.length > 0
    ? await requireFindMany(database.analysisResult, {
      where: { normalizedContentId: { in: normalizedIds } },
      select: { id: true }
    })
    : [];
  const analysisIds = readIds(analysisRows);
  const clusterRows = await requireFindMany(requireDelegate(database.evidenceCluster), {
    where: { scanId, ...ownerWhere(scope) },
    select: { id: true }
  });
  const clusterIds = readIds(clusterRows);
  const membershipRows = await requireFindMany(requireDelegate(database.evidenceClusterMembership), {
    where: { scanId, ...ownerWhere(scope) },
    select: { id: true, rawSourceContentId: true, normalizedContentId: true, analysisResultId: true }
  });
  const membershipIds = readIds(membershipRows);
  const candidateRows = clusterIds.length > 0 || analysisIds.length > 0
    ? await requireFindMany(database.candidateOpportunityRecord, {
      where: {
        OR: [
          ...(clusterIds.length > 0 ? [{ evidenceClusterId: { in: clusterIds } }] : []),
          ...(analysisIds.length > 0 ? [{ analysisResultId: { in: analysisIds } }] : [])
        ]
      },
      select: { id: true }
    })
    : [];
  const candidateIds = readIds(candidateRows);
  const rankingRows = await requireFindMany(database.opportunityRankingResult, {
    where: { scanId },
    select: { id: true }
  });
  const rankingIds = readIds(rankingRows);
  const rankingItemRows = rankingIds.length > 0
    ? await requireFindMany(database.opportunityRankingItem, {
      where: { rankingResultId: { in: rankingIds } },
      select: { id: true, generatedOpportunityId: true }
    })
    : [];
  const rankingItemIds = readIds(rankingItemRows);
  const generatedFromRankings = readStringFields(rankingItemRows, "generatedOpportunityId");
  const generatedRows = candidateIds.length > 0
    ? await requireFindMany(database.generatedOpportunityRecord, {
      where: { candidateOpportunityId: { in: candidateIds } },
      select: { id: true }
    })
    : [];
  const generatedIds = uniqueStrings([...readIds(generatedRows), ...generatedFromRankings]);
  const opportunityIds = readOpportunityIds(scan);

  const feedbackWhere = [
    ...(generatedIds.length > 0 ? [{ opportunityRecordId: { in: generatedIds } }] : []),
    ...(opportunityIds.length > 0 ? [{ opportunityId: { in: opportunityIds } }] : [])
  ];
  if (feedbackWhere.length > 0) {
    await requireDeleteMany(requireDelegate(database.privateBetaFeedback), {
      where: { ...ownerWhere(scope), OR: feedbackWhere }
    });
  }
  if (rankingItemIds.length > 0) {
    await requireDeleteMany(database.opportunityRankingItem, { where: { id: { in: rankingItemIds } } });
  }
  if (rankingIds.length > 0) {
    await requireDeleteMany(database.opportunityRankingResult, { where: { id: { in: rankingIds }, scanId } });
  }
  if (generatedIds.length > 0) {
    await requireDeleteMany(database.generatedOpportunityRecord, { where: { id: { in: generatedIds } } });
  }
  if (candidateIds.length > 0) {
    await requireDeleteMany(database.candidateOpportunityRecord, { where: { id: { in: candidateIds } } });
  }
  if (membershipIds.length > 0) {
    await requireDeleteMany(requireDelegate(database.evidenceClusterMembership), {
      where: { id: { in: membershipIds }, scanId, ...ownerWhere(scope) }
    });
  }
  if (clusterIds.length > 0) {
    await requireDeleteMany(requireDelegate(database.evidenceCluster), {
      where: { id: { in: clusterIds }, scanId, ...ownerWhere(scope) }
    });
  }
  if (analysisIds.length > 0) {
    await requireDeleteMany(database.analysisResult, { where: { id: { in: analysisIds } } });
  }
  if (normalizedIds.length > 0) {
    await requireDeleteMany(database.normalizedContent, { where: { id: { in: normalizedIds } } });
  }
  if (rawIds.length > 0) {
    await requireDeleteMany(database.rawSourceContent, { where: { id: { in: rawIds }, scanId } });
  }

  await requireDeleteMany(database.scanRunRecord, {
    where: {
      ...ownerWhere(scope),
      safeMetadata: { path: ["resultScanId"], equals: scanId }
    }
  });
  const scanDelete = await requireDeleteMany(database.scanRunRecord, {
    where: { id: scanId, ...ownerWhere(scope) }
  });
  return readDeleteCount(scanDelete) > 0;
}

function requireDelegate(
  delegate: ApiScanPersistenceDatabaseDelegate | undefined
): ApiScanPersistenceDatabaseDelegate {
  if (!delegate) throw new Error("Transactional scan deletion is unavailable.");
  return delegate;
}

async function requireFindUnique(
  delegate: ApiScanPersistenceDatabaseDelegate,
  args: unknown
): Promise<unknown> {
  if (!delegate.findUnique) throw new Error("Transactional scan deletion is unavailable.");
  return delegate.findUnique(args);
}

async function requireFindMany(
  delegate: ApiScanPersistenceDatabaseDelegate,
  args: unknown
): Promise<readonly unknown[]> {
  if (!delegate.findMany) throw new Error("Transactional scan deletion is unavailable.");
  return delegate.findMany(args);
}

async function requireDeleteMany(
  delegate: ApiScanPersistenceDatabaseDelegate,
  args: unknown
): Promise<unknown> {
  if (!delegate.deleteMany) throw new Error("Transactional scan deletion is unavailable.");
  return delegate.deleteMany(args);
}

function readIds(rows: readonly unknown[]): readonly string[] {
  return readStringFields(rows, "id");
}

function readStringFields(rows: readonly unknown[], field: string): readonly string[] {
  return uniqueStrings(rows.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const value = (row as Record<string, unknown>)[field];
    return typeof value === "string" ? [value] : [];
  }));
}

function uniqueStrings(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort();
}

function readOpportunityIds(scan: unknown): readonly string[] {
  if (!scan || typeof scan !== "object") return [];
  const result = (scan as Record<string, unknown>).result;
  if (!result || typeof result !== "object") return [];
  const opportunities = (result as Record<string, unknown>).opportunities;
  if (!Array.isArray(opportunities)) return [];
  return uniqueStrings(opportunities.flatMap((opportunity) => {
    if (!opportunity || typeof opportunity !== "object") return [];
    const opportunityId = (opportunity as Record<string, unknown>).opportunityId;
    return typeof opportunityId === "string" ? [opportunityId] : [];
  }));
}

function readDeleteCount(result: unknown): number {
  if (!result || typeof result !== "object") return 0;
  const count = (result as Record<string, unknown>).count;
  return typeof count === "number" ? count : 0;
}

async function upsertScanJob(database: ApiScanPersistenceDatabaseClient, job: ApiScanJobRecord): Promise<void> {
  const startedAt = new Date(job.requestedAt);
  const completedAt = [API_SCAN_JOB_STATUSES.completed, API_SCAN_JOB_STATUSES.failed, API_SCAN_JOB_STATUSES.cancelled].includes(job.status as never)
    ? new Date(job.updatedAt)
    : null;
  await database.scanRunRecord.upsert({
    where: { id: job.jobId, ownerPrincipalId: job.ownerPrincipalId },
    update: {
      mode: job.request.mode,
      status: job.status,
      source: { request: job.request },
      stages: [],
      safeMetadata: { job: true, safeMessage: job.safeMessage, ...(job.resultScanId ? { resultScanId: job.resultScanId } : {}) },
      completedAt
    },
    create: {
      id: job.jobId,
      ownerPrincipalId: job.ownerPrincipalId,
      mode: job.request.mode,
      status: job.status,
      source: { request: job.request },
      stages: [],
      safeMetadata: { job: true, safeMessage: job.safeMessage, ...(job.resultScanId ? { resultScanId: job.resultScanId } : {}) },
      result: null,
      startedAt,
      completedAt
    }
  });
}

function toScanJobRecord(record: unknown): ApiScanJobRecord | undefined {
  if (!record || typeof record !== "object") return undefined;
  const value = record as Record<string, unknown>;
  const source = value.source as { request?: ApiScanRequest } | undefined;
  const metadata = value.safeMetadata as { safeMessage?: unknown; resultScanId?: unknown } | undefined;
  if (typeof value.id !== "string" || !source?.request || typeof value.status !== "string") return undefined;
  const startedAt = value.startedAt instanceof Date ? value.startedAt.toISOString() : String(value.startedAt ?? "");
  const updatedAt = value.updatedAt instanceof Date ? value.updatedAt.toISOString() : String(value.updatedAt ?? startedAt);
  return {
    jobId: value.id,
    ownerPrincipalId: typeof value.ownerPrincipalId === "string" ? value.ownerPrincipalId : "__legacy_unowned__",
    status: value.status as ApiScanJobStatus,
    request: source.request,
    requestedAt: startedAt,
    updatedAt,
    resultScanId: typeof metadata?.resultScanId === "string" ? metadata.resultScanId : undefined,
    safeMessage: typeof metadata?.safeMessage === "string" ? metadata.safeMessage : "Scan job state is available."
  };
}

async function persistToDatabase(database: ApiScanPersistenceDatabaseClient, input: ApiScanPersistenceInput): Promise<void> {
  const { result, persistedAt } = input;
  const completedAt = new Date(persistedAt);
  const rankingRunId = toOwnedPersistenceId(
    result.scanId,
    result.opportunities[0]?.provenance.rankingRunId ?? `${result.scanId}-ranking`
  );

  await database.scanRunRecord.upsert({
    where: { id: result.scanId, ownerPrincipalId: input.ownerPrincipalId },
    update: {
      mode: result.mode,
      status: result.status,
      source: result.source,
      stages: result.stages,
      safeMetadata: result.safeMetadata,
      result,
      completedAt
    },
    create: {
      id: result.scanId,
      ownerPrincipalId: input.ownerPrincipalId,
      mode: result.mode,
      status: result.status,
      source: result.source,
      stages: result.stages,
      safeMetadata: result.safeMetadata,
      result,
      startedAt: completedAt,
      completedAt
    }
  });

  for (const opportunity of result.opportunities) {
    await persistOpportunity(database, opportunity, completedAt, input.ownerPrincipalId);
  }

  await database.opportunityRankingResult.upsert({
    where: { id: rankingRunId },
    update: {
      rankingVersion: "mvp-scan-ranking",
      scanId: result.scanId,
      status: "ranked",
      generatedAt: completedAt,
      safeMetadata: {
        scanId: result.scanId,
        mode: result.mode
      },
      provenance: {
        scanId: result.scanId
      }
    },
    create: {
      id: rankingRunId,
      scanId: result.scanId,
      rankingVersion: "mvp-scan-ranking",
      status: "ranked",
      generatedAt: completedAt,
      safeMetadata: {
        scanId: result.scanId,
        mode: result.mode
      },
      provenance: {
        scanId: result.scanId
      }
    }
  });

  for (const opportunity of result.opportunities) {
    const generatedOpportunityId = toOwnedPersistenceId(result.scanId, opportunity.provenance.generationOutputId);
    await database.opportunityRankingItem.upsert({
      where: {
        rankingResultId_generatedOpportunityId: {
          rankingResultId: rankingRunId,
          generatedOpportunityId
        }
      },
      update: {
        rankPosition: opportunity.rank.position,
        score: {
          value: opportunity.rank.score
        },
        explanation: {
          message: opportunity.rank.explanation
        },
        safeMetadata: {
          opportunityId: opportunity.opportunityId
        }
      },
      create: {
        id: `${rankingRunId}-${generatedOpportunityId}`,
        rankingResultId: rankingRunId,
        generatedOpportunityId,
        rankPosition: opportunity.rank.position,
        score: {
          value: opportunity.rank.score
        },
        explanation: {
          message: opportunity.rank.explanation
        },
        safeMetadata: {
          opportunityId: opportunity.opportunityId
        }
      }
    });
  }
}

async function persistOpportunity(
  database: ApiScanPersistenceDatabaseClient,
  opportunity: ApiScanOpportunityDto,
  completedAt: Date,
  ownerPrincipalId: string
): Promise<void> {
  const primaryEvidence = opportunity.evidence[0];
  if (!primaryEvidence) throw new Error("Cannot persist an opportunity without traceable evidence.");
  const rawContentId = toOwnedPersistenceId(opportunity.provenance.scanId, primaryEvidence.provenance.rawContentId);
  const normalizedContentId = toOwnedPersistenceId(opportunity.provenance.scanId, primaryEvidence.provenance.normalizedContentId);
  const analysisRequestId = toOwnedPersistenceId(opportunity.provenance.scanId, primaryEvidence.provenance.analysisRequestId);
  const candidateId = toOwnedPersistenceId(opportunity.provenance.scanId, opportunity.provenance.candidateId);
  const generationOutputId = toOwnedPersistenceId(opportunity.provenance.scanId, opportunity.provenance.generationOutputId);
  const clusterId = toOwnedPersistenceId(opportunity.provenance.scanId, opportunity.provenance.clusterId);

  for (const evidence of opportunity.evidence) {
    const evidenceRawContentId = toOwnedPersistenceId(opportunity.provenance.scanId, evidence.provenance.rawContentId);
    const evidenceNormalizedContentId = toOwnedPersistenceId(opportunity.provenance.scanId, evidence.provenance.normalizedContentId);
    const evidenceAnalysisRequestId = toOwnedPersistenceId(opportunity.provenance.scanId, evidence.provenance.analysisRequestId);
    await database.rawSourceContent.upsert({
      where: { scanId_sourcePlatform_sourceId: { scanId: opportunity.provenance.scanId, sourcePlatform: evidence.provenance.sourcePlatform, sourceId: evidence.provenance.sourceId } },
      update: { bodyText: evidence.summary, sourceUrl: evidence.permalink, safeMetadata: { scanId: opportunity.provenance.scanId, evidenceId: evidence.evidenceId }, provenance: evidence.provenance },
      create: {
        id: evidenceRawContentId,
        scanId: opportunity.provenance.scanId,
        sourcePlatform: evidence.provenance.sourcePlatform,
        sourceId: evidence.provenance.sourceId,
        sourceType: "post",
        sourceUrl: evidence.permalink,
        title: opportunity.title,
        bodyText: evidence.summary,
        capturedAt: new Date(evidence.observedAt),
        safeMetadata: { scanId: opportunity.provenance.scanId, evidenceId: evidence.evidenceId },
        provenance: evidence.provenance
      }
    });
    await database.normalizedContent.upsert({
      where: { id: evidenceNormalizedContentId },
      update: { canonicalText: evidence.summary, textSegments: [evidence.summary], safeMetadata: { scanId: opportunity.provenance.scanId, evidenceId: evidence.evidenceId }, provenance: evidence.provenance },
      create: { id: evidenceNormalizedContentId, rawSourceContentId: evidenceRawContentId, canonicalText: evidence.summary, textSegments: [evidence.summary], safeMetadata: { scanId: opportunity.provenance.scanId, evidenceId: evidence.evidenceId }, provenance: evidence.provenance }
    });
    await database.analysisResult.upsert({
      where: { id: evidenceAnalysisRequestId },
      update: { status: "completed", structuredOutput: { summary: evidence.summary }, evidence: [evidence], confidence: { value: evidence.confidence }, provenance: evidence.provenance },
      create: { id: evidenceAnalysisRequestId, normalizedContentId: evidenceNormalizedContentId, analysisType: "mvp-opportunity-scan", analysisVersion: "phase-4.5-b2", status: "completed", structuredOutput: { summary: evidence.summary }, evidence: [evidence], confidence: { value: evidence.confidence }, provenance: evidence.provenance }
    });
  }

  await database.evidenceCluster?.upsert({
    where: { scanId_fingerprint: { scanId: opportunity.provenance.scanId, fingerprint: opportunity.provenance.clusterFingerprint } },
    update: {
      ownerPrincipalId,
      label: opportunity.title,
      definition: opportunity.summary,
      status: opportunity.synthesis.exploratory ? "exploratory" : "qualified",
      demandCount: opportunity.trust.evidenceCount,
      exploratory: opportunity.synthesis.exploratory,
      synthesisProfile: opportunity.synthesis,
      safeMetadata: { scanId: opportunity.provenance.scanId }
    },
    create: {
      id: clusterId,
      scanId: opportunity.provenance.scanId,
      ownerPrincipalId,
      fingerprint: opportunity.provenance.clusterFingerprint,
      ruleId: opportunity.synthesis.ruleId,
      label: opportunity.title,
      definition: opportunity.summary,
      status: opportunity.synthesis.exploratory ? "exploratory" : "qualified",
      demandCount: opportunity.trust.evidenceCount,
      exploratory: opportunity.synthesis.exploratory,
      synthesisProfile: opportunity.synthesis,
      safeMetadata: { scanId: opportunity.provenance.scanId }
    }
  });

  for (const evidence of opportunity.evidence) {
    await database.evidenceClusterMembership?.upsert({
      where: { clusterId_normalizedContentId: { clusterId, normalizedContentId: toOwnedPersistenceId(opportunity.provenance.scanId, evidence.provenance.normalizedContentId) } },
      update: { stance: evidence.stance, sourceUrl: evidence.permalink, observedAt: new Date(evidence.observedAt), provenance: evidence.provenance },
      create: {
        id: `${clusterId}:${evidence.evidenceId}`,
        clusterId,
        scanId: opportunity.provenance.scanId,
        ownerPrincipalId,
        rawSourceContentId: toOwnedPersistenceId(opportunity.provenance.scanId, evidence.provenance.rawContentId),
        normalizedContentId: toOwnedPersistenceId(opportunity.provenance.scanId, evidence.provenance.normalizedContentId),
        analysisResultId: toOwnedPersistenceId(opportunity.provenance.scanId, evidence.provenance.analysisRequestId),
        stance: evidence.stance,
        sourceUrl: evidence.permalink,
        observedAt: new Date(evidence.observedAt),
        connectorId: evidence.connectorId,
        provenance: evidence.provenance
      }
    });
  }

  await database.candidateOpportunityRecord.upsert({
    where: { id: candidateId },
    update: {
      title: opportunity.title,
      evidenceClusterId: clusterId,
      summary: opportunity.summary,
      evidence: opportunity.evidence,
      confidence: {
        value: opportunity.confidence
      },
      lifecycleStatus: "generated",
      provenance: opportunity.provenance
    },
    create: {
      id: candidateId,
      analysisResultId: analysisRequestId,
      evidenceClusterId: clusterId,
      title: opportunity.title,
      summary: opportunity.summary,
      hypothesis: {
        title: opportunity.title,
        summary: opportunity.summary
      },
      evidence: opportunity.evidence,
      confidence: {
        value: opportunity.confidence
      },
      lifecycleStatus: "generated",
      provenance: opportunity.provenance
    }
  });

  await database.generatedOpportunityRecord.upsert({
    where: { id: generationOutputId },
    update: {
      title: opportunity.title,
      summary: opportunity.summary,
      evidence: opportunity.evidence,
      confidence: {
        value: opportunity.confidence
      },
      score: {
        value: opportunity.rank.score
      },
      lifecycleStatus: "ranked",
      provenance: opportunity.provenance
    },
    create: {
      id: generationOutputId,
      candidateOpportunityId: candidateId,
      title: opportunity.title,
      summary: opportunity.summary,
      hypothesis: {
        title: opportunity.title,
        summary: opportunity.summary
      },
      evidence: opportunity.evidence,
      confidence: {
        value: opportunity.confidence
      },
      score: {
        value: opportunity.rank.score
      },
      generationVersion: "phase-4-m34",
      lifecycleStatus: "ranked",
      provenance: opportunity.provenance
    }
  });
}

function toOwnedPersistenceId(scanId: string, recordId: string): string {
  return `${scanId}:${recordId}`;
}
