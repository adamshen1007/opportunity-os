import type { ApiScanJobStatus } from "../persistence/index.js";

export const API_OPERATION_FAILURE_KINDS = Object.freeze({
  authentication: "authentication",
  database: "database",
  liveDatasource: "live-datasource",
  llm: "llm",
  scan: "scan"
} as const);

export type ApiOperationFailureKind =
  typeof API_OPERATION_FAILURE_KINDS[keyof typeof API_OPERATION_FAILURE_KINDS];

export interface ApiDependencyObservation {
  readonly name: string;
  readonly status: "ok" | "degraded" | "unavailable";
  readonly checkedAt: string;
}

export interface ApiOperationsSnapshotDto {
  readonly serviceStartedAt: string;
  readonly capturedAt: string;
  readonly requests: {
    readonly total: number;
    readonly successful: number;
    readonly clientErrors: number;
    readonly serverErrors: number;
    readonly averageDurationMs: number;
    readonly maximumDurationMs: number;
  };
  readonly scans: Readonly<Record<ApiScanJobStatus, number>>;
  readonly failures: Readonly<Record<ApiOperationFailureKind, number>>;
  readonly dependencies: readonly ApiDependencyObservation[];
  readonly readiness: {
    readonly status: "healthy" | "attention-required";
    readonly safeMessages: readonly string[];
  };
}

export interface ApiMetricsRegistry {
  readonly recordRequest: (statusCode: number, durationMs: number) => void;
  readonly recordScanTransition: (status: ApiScanJobStatus) => void;
  readonly recordFailure: (kind: ApiOperationFailureKind) => void;
  readonly recordDependency: (observation: ApiDependencyObservation) => void;
  readonly snapshot: () => ApiOperationsSnapshotDto;
}

export function createApiMetricsRegistry(clock: () => string = () => new Date().toISOString()): ApiMetricsRegistry {
  const serviceStartedAt = clock();
  let total = 0;
  let successful = 0;
  let clientErrors = 0;
  let serverErrors = 0;
  let durationTotal = 0;
  let maximumDurationMs = 0;
  const scans: Record<ApiScanJobStatus, number> = { queued: 0, running: 0, completed: 0, failed: 0, cancelled: 0 };
  const failures: Record<ApiOperationFailureKind, number> = {
    authentication: 0,
    database: 0,
    "live-datasource": 0,
    llm: 0,
    scan: 0
  };
  const dependencies = new Map<string, ApiDependencyObservation>();

  return {
    recordRequest(statusCode, durationMs) {
      total += 1;
      durationTotal += Math.max(0, durationMs);
      maximumDurationMs = Math.max(maximumDurationMs, durationMs);
      if (statusCode >= 500) serverErrors += 1;
      else if (statusCode >= 400) clientErrors += 1;
      else successful += 1;
    },
    recordScanTransition(status) {
      scans[status] += 1;
    },
    recordFailure(kind) {
      failures[kind] += 1;
    },
    recordDependency(observation) {
      dependencies.set(observation.name, {
        name: observation.name,
        status: observation.status,
        checkedAt: observation.checkedAt
      });
    },
    snapshot() {
      const safeMessages: string[] = [];
      if (serverErrors > 0) safeMessages.push("One or more server errors occurred since this API process started.");
      if (scans.failed > 0) safeMessages.push("One or more scan jobs failed and may require retry.");
      if (failures.authentication >= 5) safeMessages.push("Authentication failures crossed the operational review threshold.");
      if (failures["live-datasource"] > 0) safeMessages.push("One or more live datasource requests failed.");
      if (failures.llm > 0) safeMessages.push("One or more live LLM requests failed.");
      if (failures.database > 0) safeMessages.push("One or more database operations failed.");
      if (maximumDurationMs > 10_000) safeMessages.push("At least one request exceeded the ten-second latency threshold.");
      if ([...dependencies.values()].some((dependency) => dependency.status !== "ok")) {
        safeMessages.push("One or more monitored dependencies require attention.");
      }
      return {
        serviceStartedAt,
        capturedAt: clock(),
        requests: {
          total,
          successful,
          clientErrors,
          serverErrors,
          averageDurationMs: total === 0 ? 0 : Math.round(durationTotal / total),
          maximumDurationMs
        },
        scans: { ...scans },
        failures: { ...failures },
        dependencies: [...dependencies.values()].sort((left, right) => left.name.localeCompare(right.name)),
        readiness: { status: safeMessages.length ? "attention-required" : "healthy", safeMessages }
      };
    }
  };
}

export function classifyApiScanFailure(error: unknown): ApiOperationFailureKind {
  if (!(error instanceof Error)) return API_OPERATION_FAILURE_KINDS.scan;
  if (/LLM|analysis configuration|pilot provider and model/iu.test(error.message)) {
    return API_OPERATION_FAILURE_KINDS.llm;
  }
  if (/datasource|Reddit configuration|rate-limited|provider recovers/iu.test(error.message)) {
    return API_OPERATION_FAILURE_KINDS.liveDatasource;
  }
  if (/database|saved/iu.test(error.message)) {
    return API_OPERATION_FAILURE_KINDS.database;
  }
  return API_OPERATION_FAILURE_KINDS.scan;
}
