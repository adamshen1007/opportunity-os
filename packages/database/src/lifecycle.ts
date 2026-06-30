import type { DatabaseClientContract } from "./client.js";
import { toSafeDatabaseErrorDetails, type SafeDatabaseErrorDetails } from "./database-error.js";

export type DatabaseLifecycleStatus = "connected" | "disconnected" | "shutdown_failed";

export type DatabaseLifecycleResult = Readonly<{
  status: DatabaseLifecycleStatus;
  error?: SafeDatabaseErrorDetails;
}>;

export async function connectDatabase(client: DatabaseClientContract): Promise<DatabaseLifecycleResult> {
  await client.$connect();

  return {
    status: "connected"
  };
}

export async function disconnectDatabase(client: DatabaseClientContract): Promise<DatabaseLifecycleResult> {
  await client.$disconnect();

  return {
    status: "disconnected"
  };
}

export async function safelyShutdownDatabase(client: DatabaseClientContract): Promise<DatabaseLifecycleResult> {
  try {
    await client.$disconnect();

    return {
      status: "disconnected"
    };
  } catch (error) {
    return {
      status: "shutdown_failed",
      error: toSafeDatabaseErrorDetails(error, {
        operation: "database.shutdown"
      })
    };
  }
}
