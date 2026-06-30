import { DATABASE_ERROR_CODES, toSafeDatabaseErrorDetails, type SafeDatabaseErrorDetails } from "./database-error.js";

export type DatabaseHealthStatus = "healthy" | "unhealthy";

export type DatabaseHealthResult = Readonly<{
  status: DatabaseHealthStatus;
  checkedAt: string;
  error?: SafeDatabaseErrorDetails;
}>;

export type DatabaseHealthProbe = () => Promise<void>;

export type DatabaseHealthClock = () => string;

export type DatabaseHealthCheckInput = Readonly<{
  probe: DatabaseHealthProbe;
  clock: DatabaseHealthClock;
}>;

export async function checkDatabaseHealth(input: DatabaseHealthCheckInput): Promise<DatabaseHealthResult> {
  const checkedAt = input.clock();

  try {
    await input.probe();

    return {
      status: "healthy",
      checkedAt
    };
  } catch (error) {
    return {
      status: "unhealthy",
      checkedAt,
      error: toSafeDatabaseErrorDetails(error, {
        code: DATABASE_ERROR_CODES.healthCheckFailed,
        message: "Database health check failed.",
        operation: "database.health_check"
      })
    };
  }
}
