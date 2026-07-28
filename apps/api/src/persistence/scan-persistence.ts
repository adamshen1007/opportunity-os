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
  /api[_-]?key|access[_-]?token|refresh[_-]?token|password|secret|credential|authorization|bearer\s+[a-z0-9]|raw provider|provider payload|stack trace|raw cause/iu;

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
      jobs.delete(scanId);
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
  readonly candidateOpportunityRecord: ApiScanPersistenceDatabaseDelegate;
  readonly generatedOpportunityRecord: ApiScanPersistenceDatabaseDelegate;
  readonly opportunityRankingResult: ApiScanPersistenceDatabaseDelegate;
  readonly opportunityRankingItem: ApiScanPersistenceDatabaseDelegate;
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
      const result = await this.getScanResult(scope, scanId);
      if (!result || !database.scanRunRecord.delete) return false;
      const rankingIds = [...new Set(result.opportunities.map((item) => toOwnedPersistenceId(scanId, item.provenance.rankingRunId)))];
      const generatedIds = result.opportunities.map((item) => toOwnedPersistenceId(scanId, item.provenance.generationOutputId));
      const candidateIds = result.opportunities.map((item) => toOwnedPersistenceId(scanId, item.provenance.candidateId));
      const analysisIds = result.opportunities.map((item) => toOwnedPersistenceId(scanId, item.provenance.analysisRequestId));
      const normalizedIds = result.opportunities.map((item) => toOwnedPersistenceId(scanId, item.provenance.normalizedContentId));
      const rawIds = result.opportunities.map((item) => toOwnedPersistenceId(scanId, item.provenance.rawContentId));
      await database.opportunityRankingItem.deleteMany?.({ where: { rankingResultId: { in: rankingIds } } });
      await database.opportunityRankingResult.deleteMany?.({ where: { id: { in: rankingIds } } });
      await database.generatedOpportunityRecord.deleteMany?.({ where: { id: { in: generatedIds } } });
      await database.candidateOpportunityRecord.deleteMany?.({ where: { id: { in: candidateIds } } });
      await database.analysisResult.deleteMany?.({ where: { id: { in: analysisIds } } });
      await database.normalizedContent.deleteMany?.({ where: { id: { in: normalizedIds } } });
      await database.rawSourceContent.deleteMany?.({ where: { id: { in: rawIds } } });
      await database.scanRunRecord.delete({ where: { id: scanId } });
      await memory.deleteScanResult(scope, scanId);
      return true;
    }
  };
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
    await persistOpportunity(database, opportunity, completedAt);
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
  completedAt: Date
): Promise<void> {
  const primaryEvidence = opportunity.evidence[0];
  const sourceId = primaryEvidence?.provenance.sourceId ?? opportunity.provenance.sourceItemId;
  const sourcePlatform = primaryEvidence?.provenance.sourcePlatform ?? "reddit";
  const rawContentId = toOwnedPersistenceId(opportunity.provenance.scanId, opportunity.provenance.rawContentId);
  const normalizedContentId = toOwnedPersistenceId(opportunity.provenance.scanId, opportunity.provenance.normalizedContentId);
  const analysisRequestId = toOwnedPersistenceId(opportunity.provenance.scanId, opportunity.provenance.analysisRequestId);
  const candidateId = toOwnedPersistenceId(opportunity.provenance.scanId, opportunity.provenance.candidateId);
  const generationOutputId = toOwnedPersistenceId(opportunity.provenance.scanId, opportunity.provenance.generationOutputId);

  await database.rawSourceContent.upsert({
    where: {
      scanId_sourcePlatform_sourceId: {
        scanId: opportunity.provenance.scanId,
        sourcePlatform,
        sourceId
      }
    },
    update: {
      title: opportunity.title,
      bodyText: primaryEvidence?.summary,
      sourceUrl: primaryEvidence?.permalink,
      safeMetadata: {
        scanId: opportunity.provenance.scanId,
        opportunityId: opportunity.opportunityId
      },
      provenance: opportunity.provenance
    },
    create: {
      id: rawContentId,
      scanId: opportunity.provenance.scanId,
      sourcePlatform,
      sourceId,
      sourceType: "post",
      sourceUrl: primaryEvidence?.permalink,
      title: opportunity.title,
      bodyText: primaryEvidence?.summary,
      capturedAt: completedAt,
      safeMetadata: {
        scanId: opportunity.provenance.scanId,
        opportunityId: opportunity.opportunityId
      },
      provenance: opportunity.provenance
    }
  });

  await database.normalizedContent.upsert({
    where: { id: normalizedContentId },
    update: {
      canonicalText: opportunity.summary,
      textSegments: [opportunity.summary],
      safeMetadata: {
        scanId: opportunity.provenance.scanId,
        opportunityId: opportunity.opportunityId
      },
      provenance: opportunity.provenance
    },
    create: {
      id: normalizedContentId,
      rawSourceContentId: rawContentId,
      canonicalText: opportunity.summary,
      textSegments: [opportunity.summary],
      safeMetadata: {
        scanId: opportunity.provenance.scanId,
        opportunityId: opportunity.opportunityId
      },
      provenance: opportunity.provenance
    }
  });

  await database.analysisResult.upsert({
    where: { id: analysisRequestId },
    update: {
      status: "completed",
      structuredOutput: {
        summary: opportunity.summary
      },
      evidence: opportunity.evidence,
      confidence: {
        value: opportunity.confidence
      },
      provenance: opportunity.provenance
    },
    create: {
      id: analysisRequestId,
      normalizedContentId,
      analysisType: "mvp-opportunity-scan",
      analysisVersion: "phase-4-m34",
      status: "completed",
      structuredOutput: {
        summary: opportunity.summary
      },
      evidence: opportunity.evidence,
      confidence: {
        value: opportunity.confidence
      },
      provenance: opportunity.provenance
    }
  });

  await database.candidateOpportunityRecord.upsert({
    where: { id: candidateId },
    update: {
      title: opportunity.title,
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
