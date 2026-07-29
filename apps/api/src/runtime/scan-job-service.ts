import { randomUUID } from "node:crypto";
import { runOpportunityScanPipeline, type ApiScanRequest, type ApiScanResultDto } from "../pipeline/index.js";
import { API_SCAN_JOB_STATUSES, type ApiScanJobRecord, type ApiScanPersistenceStore } from "../persistence/index.js";
import { createOwnerScope, type ApiOwnershipScope } from "../ownership/index.js";

export interface ApiScanJobDto extends Omit<ApiScanJobRecord, "ownerPrincipalId"> {
  readonly result?: ApiScanResultDto;
}

export interface ApiScanJobService {
  readonly enqueue: (input: { readonly request: ApiScanRequest; readonly correlationId: string; readonly requestId?: string; readonly ownerPrincipalId: string }) => Promise<ApiScanJobDto>;
  readonly get: (scope: ApiOwnershipScope, jobId: string) => Promise<ApiScanJobDto | undefined>;
  readonly cancel: (scope: ApiOwnershipScope, jobId: string) => Promise<ApiScanJobDto | undefined>;
  readonly retry: (scope: ApiOwnershipScope, jobId: string, correlationId: string, requestId?: string) => Promise<ApiScanJobDto | undefined>;
  readonly recover: () => Promise<void>;
}

export interface ApiScanJobServiceOptions {
  readonly persistence: ApiScanPersistenceStore;
  readonly clock?: () => string;
  readonly idFactory?: () => string;
  readonly schedule?: (work: () => void) => void;
  readonly onTransition?: (status: ApiScanJobRecord["status"]) => void;
}

export function toSafeScanJobFailureMessage(error: unknown): string {
  if (error instanceof Error && (
    error.message === "Live LLM output failed structured citation validation. No result was saved." ||
    error.message === "The live LLM provider was unavailable or rejected the request. No result was saved." ||
    error.message === "Live analysis configuration is unavailable; the live scan failed closed." ||
    error.message === "Live analysis configuration does not match the approved pilot provider and model." ||
    error.message === "Live Reddit configuration is unavailable. No result was saved." ||
    error.message === "The live datasource is rate-limited. Retry after the provider recovers." ||
    error.message === "The live datasource was unavailable. No result was saved." ||
    error.message === "Scan results could not be saved. Retry after the database recovers."
  )) {
    return error.message;
  }

  return "Scan failed before safe output was produced. Retry when the datasource is available.";
}

export function createApiScanJobService(options: ApiScanJobServiceOptions): ApiScanJobService {
  const clock = options.clock ?? (() => new Date().toISOString());
  const idFactory = options.idFactory ?? (() => `scan-job-${randomUUID()}`);
  const schedule = options.schedule ?? ((work) => setTimeout(work, 0));
  const executionContext = new Map<string, { correlationId: string; requestId?: string }>();

  async function hydrate(job: ApiScanJobRecord): Promise<ApiScanJobDto> {
    const scope = createOwnerScope(job.ownerPrincipalId);
    const result = job.resultScanId ? await options.persistence.getScanResult(scope, job.resultScanId) : undefined;
    const { ownerPrincipalId: _ownerPrincipalId, ...safeJob } = job;
    return { ...safeJob, ...(result ? { result } : {}) };
  }

  function scheduleExecution(jobId: string): void {
    schedule(() => { void execute(jobId); });
  }

  async function execute(jobId: string): Promise<void> {
    const current = (await options.persistence.listRecoverableScanJobs()).find((job) => job.jobId === jobId);
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
      try {
        await options.persistence.persistScanResult({ result, persistedAt: clock(), ownerPrincipalId: current.ownerPrincipalId });
      } catch {
        throw new Error("Scan results could not be saved. Retry after the database recovers.");
      }
      await options.persistence.updateScanJob({
        ...running,
        status: API_SCAN_JOB_STATUSES.completed,
        resultScanId: result.scanId,
        updatedAt: clock(),
        safeMessage: "Scan completed and results are ready."
      });
      options.onTransition?.(API_SCAN_JOB_STATUSES.completed);
    } catch (error) {
      const failureMessage = toSafeScanJobFailureMessage(error);
      await options.persistence.updateScanJob({
        ...running,
        status: API_SCAN_JOB_STATUSES.failed,
        updatedAt: clock(),
        safeMessage: failureMessage
      });
      options.onTransition?.(API_SCAN_JOB_STATUSES.failed);
    } finally {
      executionContext.delete(jobId);
    }
  }

  async function enqueue(input: { readonly request: ApiScanRequest; readonly correlationId: string; readonly requestId?: string; readonly ownerPrincipalId: string }): Promise<ApiScanJobDto> {
    const now = clock();
    const job: ApiScanJobRecord = {
      jobId: idFactory(),
      ownerPrincipalId: input.ownerPrincipalId,
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
    async get(scope, jobId) {
      const job = await options.persistence.getScanJob(scope, jobId);
      return job ? hydrate(job) : undefined;
    },
    async cancel(scope, jobId) {
      const job = await options.persistence.getScanJob(scope, jobId);
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
    async retry(scope, jobId, correlationId, requestId) {
      const job = await options.persistence.getScanJob(scope, jobId);
      if (!job || (job.status !== API_SCAN_JOB_STATUSES.failed && job.status !== API_SCAN_JOB_STATUSES.cancelled)) return undefined;
      return enqueue({ request: job.request, correlationId, requestId, ownerPrincipalId: job.ownerPrincipalId });
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
