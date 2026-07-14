import type { ApiScanJobStatus } from "../persistence/index.js";

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
  readonly readiness: {
    readonly status: "healthy" | "attention-required";
    readonly safeMessages: readonly string[];
  };
}

export interface ApiMetricsRegistry {
  readonly recordRequest: (statusCode: number, durationMs: number) => void;
  readonly recordScanTransition: (status: ApiScanJobStatus) => void;
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
    snapshot() {
      const safeMessages: string[] = [];
      if (serverErrors > 0) safeMessages.push("One or more server errors occurred since this API process started.");
      if (scans.failed > 0) safeMessages.push("One or more scan jobs failed and may require retry.");
      if (maximumDurationMs > 10_000) safeMessages.push("At least one request exceeded the ten-second latency threshold.");
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
        readiness: { status: safeMessages.length ? "attention-required" : "healthy", safeMessages }
      };
    }
  };
}
