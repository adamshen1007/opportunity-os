import type { InfrastructureModuleId } from "../modules/index.js";

export const HEALTH_STATUSES = [
  "healthy",
  "degraded",
  "unhealthy",
  "unknown"
] as const;

export type HealthStatus = (typeof HEALTH_STATUSES)[number];

export type HealthMetadata = Record<
  string,
  string | number | boolean | null
>;

export type HealthComponentStatus = {
  readonly id: string;
  readonly moduleId: InfrastructureModuleId;
  readonly status: HealthStatus;
  readonly safeMessage?: string;
  readonly checkedAt: string;
  readonly metadata?: HealthMetadata;
};

export type HealthAggregateStatus = {
  readonly status: HealthStatus;
  readonly checkedAt: string;
  readonly components: readonly HealthComponentStatus[];
  readonly metadata?: HealthMetadata;
};

export type HealthAggregationResult =
  | {
      readonly status: "healthy" | "degraded";
      readonly aggregate: HealthAggregateStatus;
      readonly failures: readonly [];
    }
  | {
      readonly status: "unhealthy" | "unknown";
      readonly aggregate: HealthAggregateStatus;
      readonly failures: readonly HealthComponentStatus[];
    };

export type HealthCheckContract = {
  readonly check: () => HealthComponentStatus | Promise<HealthComponentStatus>;
};
