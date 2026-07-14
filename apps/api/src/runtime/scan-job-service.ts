import { randomUUID } from "node:crypto";
import { runOpportunityScanPipeline, type ApiScanRequest, type ApiScanResultDto } from "../pipeline/index.js";
import { API_SCAN_JOB_STATUSES, type ApiScanJobRecord, type ApiScanPersistenceStore } from "../persistence/index.js";

export interface ApiScanJobDto extends ApiScanJobRecord {
  readonly result?: ApiScanResultDto;
}

export interface ApiScanJobService {
  readonly enqueue: (input: { readonly request: ApiScanRequest; readonly correlationId: string; readonly requestId?: string }) => Promise<ApiScanJobDto>;
  readonly get: (jobId: string) => Promise<ApiScanJobDto | undefined>;
  readonly cancel: (jobId: string) => Promise<ApiScanJobDto | undefined>;
  readonly retry: (jobId: string, correlationId: string, requestId?: string) => Promise<ApiScanJobDto | undefined>;
  readonly recover: () => Promise<void>;
}

export interface ApiScanJobServiceOptions {
  readonly persistence: ApiScanPersistenceStore;
  readonly clock?: () => string;
  readonly idFactory?: () => string;
  readonly schedule?: (work: () => void) => void;
  readonly onTransition?: (status: ApiScanJobRecord["status"]) => void;
}

export function createApiScanJobService(options: ApiScanJobServiceOptions): ApiScanJobService {
  const clock = options.clock ?? (() => new Date().toISOString());
  const idFactory = options.idFactory ?? (() => `scan-job-${randomUUID()}`);
  const schedule = options.schedule ?? ((work) => setTimeout(work, 0));
  const executionContext = new Map<string, { correlationId: string; requestId?: string }>();

  async function hydrate(job: ApiScanJobRecord): Promise<ApiScanJobDto> {
    const result = job.resultScanId ? await options.persistence.getScanResult(job.resultScanId) : undefined;
    return { ...job, ...(result ? { result } : {}) };
  }

  function scheduleExecution(jobId: string): void {
    schedule(() => { void execute(jobId); });
  }

  async function execute(jobId: string): Promise<void> {
    const current = await options.persistence.getScanJob(jobId);
    if (!current || current.status !== API_SCAN_JOB_STATUSES.queued) return;
    const context = executionContext.get(jobId) ?? { correlationId: `recovered-${jobId}` };
    const running: ApiScanJobRecord = {
      ...current,
      status: API_SCAN_JOB_STATUSES.running,
      updatedAt: clock(),
      safeMessage: "Scan is running through the opportunity pipeline."
    };
    await options.persistence.updateScanJob(running);
    options.onTransition?.(running.status);

    try {
      const result = await runOpportunityScanPipeline({
        ...current.request,
        correlationId: context.correlationId,
        requestId: context.requestId,
        requestedAt: current.requestedAt
      });
      await options.persistence.persistScanResult({ result, persistedAt: clock() });
      await options.persistence.updateScanJob({
        ...running,
        status: API_SCAN_JOB_STATUSES.completed,
        resultScanId: result.scanId,
        updatedAt: clock(),
        safeMessage: "Scan completed and results are ready."
      });
      options.onTransition?.(API_SCAN_JOB_STATUSES.completed);
    } catch {
      await options.persistence.updateScanJob({
        ...running,
        status: API_SCAN_JOB_STATUSES.failed,
        updatedAt: clock(),
        safeMessage: "Scan failed before safe output was produced. Retry when the datasource is available."
      });
      options.onTransition?.(API_SCAN_JOB_STATUSES.failed);
    } finally {
      executionContext.delete(jobId);
    }
  }

  async function enqueue(input: { readonly request: ApiScanRequest; readonly correlationId: string; readonly requestId?: string }): Promise<ApiScanJobDto> {
    const now = clock();
    const job: ApiScanJobRecord = {
      jobId: idFactory(),
      status: API_SCAN_JOB_STATUSES.queued,
      request: input.request,
      requestedAt: now,
      updatedAt: now,
      safeMessage: "Scan is queued for processing."
    };
    executionContext.set(job.jobId, { correlationId: input.correlationId, requestId: input.requestId });
    await options.persistence.createScanJob(job);
    options.onTransition?.(job.status);
    scheduleExecution(job.jobId);
    return hydrate(job);
  }

  return {
    enqueue,
    async get(jobId) {
      const job = await options.persistence.getScanJob(jobId);
      return job ? hydrate(job) : undefined;
    },
    async cancel(jobId) {
      const job = await options.persistence.getScanJob(jobId);
      if (!job || job.status !== API_SCAN_JOB_STATUSES.queued) return job ? hydrate(job) : undefined;
      const cancelled: ApiScanJobRecord = {
        ...job,
        status: API_SCAN_JOB_STATUSES.cancelled,
        updatedAt: clock(),
        safeMessage: "Scan was cancelled before execution started."
      };
      await options.persistence.updateScanJob(cancelled);
      options.onTransition?.(cancelled.status);
      executionContext.delete(jobId);
      return hydrate(cancelled);
    },
    async retry(jobId, correlationId, requestId) {
      const job = await options.persistence.getScanJob(jobId);
      if (!job || (job.status !== API_SCAN_JOB_STATUSES.failed && job.status !== API_SCAN_JOB_STATUSES.cancelled)) return undefined;
      return enqueue({ request: job.request, correlationId, requestId });
    },
    async recover() {
      const jobs = await options.persistence.listRecoverableScanJobs();
      for (const job of jobs) {
        const queued: ApiScanJobRecord = job.status === API_SCAN_JOB_STATUSES.running
          ? { ...job, status: API_SCAN_JOB_STATUSES.queued, updatedAt: clock(), safeMessage: "Recovered scan is queued after an API restart." }
          : job;
        if (job.status === API_SCAN_JOB_STATUSES.running) await options.persistence.updateScanJob(queued);
        scheduleExecution(queued.jobId);
      }
    }
  };
}
