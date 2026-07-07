export type ApiHealthStatus = "ok" | "degraded";
export type ApiHealthDependencyStatus = "ok" | "degraded" | "unavailable";

export interface ApiHealthDependencyDto {
  readonly name: string;
  readonly status: ApiHealthDependencyStatus;
  readonly checkedAt: string;
  readonly safeMessage?: string;
}

export interface ApiHealthDto {
  readonly status: ApiHealthStatus;
  readonly serviceName: string;
  readonly version: string;
  readonly environment: string;
  readonly checkedAt: string;
  readonly dependencies: readonly ApiHealthDependencyDto[];
}
