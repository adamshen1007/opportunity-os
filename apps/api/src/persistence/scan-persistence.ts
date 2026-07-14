import type { ApiScanOpportunityDto, ApiScanRequest, ApiScanResultDto } from "../pipeline/index.js";

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
}

export interface ApiScanPersistenceStore {
  readonly persistScanResult: (input: ApiScanPersistenceInput) => Promise<void>;
  readonly resolveOpportunityRecordId: (opportunityId: string) => Promise<string | undefined>;
  readonly getScanResult: (scanId: string) => Promise<ApiScanResultDto | undefined>;
  readonly listScanResults: (limit?: number) => Promise<readonly ApiScanResultDto[]>;
  readonly createScanJob: (job: ApiScanJobRecord) => Promise<void>;
  readonly updateScanJob: (job: ApiScanJobRecord) => Promise<void>;
  readonly getScanJob: (jobId: string) => Promise<ApiScanJobRecord | undefined>;
  readonly listRecoverableScanJobs: () => Promise<readonly ApiScanJobRecord[]>;
  readonly deleteScanResult: (scanId: string) => Promise<boolean>;
}

export interface ApiScanPersistenceRecord {
  readonly scanId: string;
  readonly opportunityIds: readonly string[];
  readonly opportunityRecordIds: Readonly<Record<string, string>>;
}

export interface InMemoryScanPersistenceInput {
  readonly initialRecords?: readonly ApiScanPersistenceRecord[];
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

  return {
    async persistScanResult({ result }) {
      assertSafePersistencePayload(result);
      const record = toScanPersistenceRecord(result);
      records.set(record.scanId, cloneRecord(record));
      results.set(result.scanId, structuredClone(result));
      for (const [opportunityId, recordId] of Object.entries(record.opportunityRecordIds)) {
        opportunityRecordIds.set(opportunityId, recordId);
      }
    },
    async resolveOpportunityRecordId(opportunityId) {
      return opportunityRecordIds.get(opportunityId);
    },
    async getScanResult(scanId) {
      const result = results.get(scanId);
      return result ? structuredClone(result) : undefined;
    },
    async listScanResults(limit = 10) {
      return [...results.values()].slice(-Math.max(1, Math.min(limit, 25))).reverse().map((result) => structuredClone(result));
    },
    async createScanJob(job) {
      assertSafePersistencePayload(job);
      jobs.set(job.jobId, structuredClone(job));
    },
    async updateScanJob(job) {
      assertSafePersistencePayload(job);
      jobs.set(job.jobId, structuredClone(job));
    },
    async getScanJob(jobId) {
      const job = jobs.get(jobId);
      return job ? structuredClone(job) : undefined;
    },
    async listRecoverableScanJobs() {
      return [...jobs.values()]
        .filter((job) => job.status === API_SCAN_JOB_STATUSES.queued || job.status === API_SCAN_JOB_STATUSES.running)
        .map((job) => structuredClone(job));
    },
    async deleteScanResult(scanId) {
      const existed = results.delete(scanId);
      const record = records.get(scanId);
      records.delete(scanId);
      jobs.delete(scanId);
      for (const opportunityId of record?.opportunityIds ?? []) opportunityRecordIds.delete(opportunityId);
      return existed || record !== undefined;
    }
  };
}

export function toScanPersistenceRecord(result: ApiScanResultDto): ApiScanPersistenceRecord {
  return {
    scanId: result.scanId,
    opportunityIds: result.opportunities.map((opportunity) => opportunity.opportunityId),
    opportunityRecordIds: Object.fromEntries(
      result.opportunities.map((opportunity) => [opportunity.opportunityId, opportunity.provenance.generationOutputId])
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
}

export function createDatabaseScanPersistenceStore(database: ApiScanPersistenceDatabaseClient): ApiScanPersistenceStore {
  const memory = createInMemoryScanPersistenceStore();

  return {
    async persistScanResult(input) {
      assertSafePersistencePayload(input.result);
      await persistToDatabase(database, input);
      await memory.persistScanResult(input);
    },
    async resolveOpportunityRecordId(opportunityId) {
      return memory.resolveOpportunityRecordId(opportunityId);
    },
    async getScanResult(scanId) {
      const record = await database.scanRunRecord.findUnique?.({ where: { id: scanId }, select: { result: true } });
      if (!record || typeof record !== "object" || !("result" in record) || !record.result) return undefined;
      assertSafePersistencePayload(record.result);
      return record.result as ApiScanResultDto;
    },
    async listScanResults(limit = 10) {
      const records = await database.scanRunRecord.findMany?.({
        where: { result: { not: null } },
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
    async getScanJob(jobId) {
      const memoryJob = await memory.getScanJob(jobId);
      if (memoryJob) return memoryJob;
      const record = await database.scanRunRecord.findUnique?.({
        where: { id: jobId },
        select: { id: true, status: true, source: true, safeMetadata: true, startedAt: true, updatedAt: true }
      });
      return toScanJobRecord(record);
    },
    async listRecoverableScanJobs() {
      const records = await database.scanRunRecord.findMany?.({
        where: { status: { in: [API_SCAN_JOB_STATUSES.queued, API_SCAN_JOB_STATUSES.running] }, result: null },
        orderBy: { startedAt: "asc" },
        take: 25,
        select: { id: true, status: true, source: true, safeMetadata: true, startedAt: true, updatedAt: true }
      }) ?? [];
      return records.flatMap((record) => {
        const job = toScanJobRecord(record);
        return job ? [job] : [];
      });
    },
    async deleteScanResult(scanId) {
      const result = await this.getScanResult(scanId);
      if (!result || !database.scanRunRecord.delete) return false;
      const rankingIds = [...new Set(result.opportunities.map((item) => item.provenance.rankingRunId))];
      const generatedIds = result.opportunities.map((item) => item.provenance.generationOutputId);
      const candidateIds = result.opportunities.map((item) => item.provenance.candidateId);
      const analysisIds = result.opportunities.map((item) => item.provenance.analysisRequestId);
      const normalizedIds = result.opportunities.map((item) => item.provenance.normalizedContentId);
      const rawIds = result.opportunities.map((item) => item.provenance.rawContentId);
      await database.opportunityRankingItem.deleteMany?.({ where: { rankingResultId: { in: rankingIds } } });
      await database.opportunityRankingResult.deleteMany?.({ where: { id: { in: rankingIds } } });
      await database.generatedOpportunityRecord.deleteMany?.({ where: { id: { in: generatedIds } } });
      await database.candidateOpportunityRecord.deleteMany?.({ where: { id: { in: candidateIds } } });
      await database.analysisResult.deleteMany?.({ where: { id: { in: analysisIds } } });
      await database.normalizedContent.deleteMany?.({ where: { id: { in: normalizedIds } } });
      await database.rawSourceContent.deleteMany?.({ where: { id: { in: rawIds } } });
      await database.scanRunRecord.delete({ where: { id: scanId } });
      await memory.deleteScanResult(scanId);
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
    where: { id: job.jobId },
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
  const rankingRunId = result.opportunities[0]?.provenance.rankingRunId ?? `${result.scanId}-ranking`;

  await database.scanRunRecord.upsert({
    where: { id: result.scanId },
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
    await database.opportunityRankingItem.upsert({
      where: {
        rankingResultId_generatedOpportunityId: {
          rankingResultId: rankingRunId,
          generatedOpportunityId: opportunity.provenance.generationOutputId
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
        id: `${rankingRunId}-${opportunity.provenance.generationOutputId}`,
        rankingResultId: rankingRunId,
        generatedOpportunityId: opportunity.provenance.generationOutputId,
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

  await database.rawSourceContent.upsert({
    where: {
      sourcePlatform_sourceId: {
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
      id: opportunity.provenance.rawContentId,
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
    where: { id: opportunity.provenance.normalizedContentId },
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
      id: opportunity.provenance.normalizedContentId,
      rawSourceContentId: opportunity.provenance.rawContentId,
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
    where: { id: opportunity.provenance.analysisRequestId },
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
      id: opportunity.provenance.analysisRequestId,
      normalizedContentId: opportunity.provenance.normalizedContentId,
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
    where: { id: opportunity.provenance.candidateId },
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
      id: opportunity.provenance.candidateId,
      analysisResultId: opportunity.provenance.analysisRequestId,
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
    where: { id: opportunity.provenance.generationOutputId },
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
      id: opportunity.provenance.generationOutputId,
      candidateOpportunityId: opportunity.provenance.candidateId,
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
