export type DatabaseConfigInput = Readonly<{
  databaseUrl: string;
}>;

export type DatabaseRuntimeConfig = Readonly<{
  databaseUrl: string;
}>;

export class DatabaseConfigurationError extends Error {
  public readonly code = "DATABASE_CONFIGURATION_INVALID";

  public constructor(message: string) {
    super(message);
    this.name = "DatabaseConfigurationError";
  }
}

export function createDatabaseConfig(input: DatabaseConfigInput): DatabaseRuntimeConfig {
  const databaseUrl = input.databaseUrl.trim();

  if (databaseUrl.length === 0) {
    throw new DatabaseConfigurationError("DATABASE_URL is required for database configuration.");
  }

  if (!isPostgresConnectionUrl(databaseUrl)) {
    throw new DatabaseConfigurationError("DATABASE_URL must use the postgresql:// or postgres:// protocol.");
  }

  return {
    databaseUrl
  };
}

function isPostgresConnectionUrl(value: string): boolean {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "postgresql:" || parsedUrl.protocol === "postgres:";
  } catch {
    return false;
  }
}
