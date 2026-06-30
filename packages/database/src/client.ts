import type { DatabaseRuntimeConfig } from "./database-config.js";

export type DatabaseClientContract = Readonly<{
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
}>;

export type DatabaseClientCreator<TClient extends DatabaseClientContract = DatabaseClientContract> = (
  config: DatabaseRuntimeConfig
) => TClient;

export type DatabaseClientFactoryInput<TClient extends DatabaseClientContract = DatabaseClientContract> = Readonly<{
  config: DatabaseRuntimeConfig;
  createClient: DatabaseClientCreator<TClient>;
}>;

export function createDatabaseClient<TClient extends DatabaseClientContract>(
  input: DatabaseClientFactoryInput<TClient>
): TClient {
  return input.createClient(input.config);
}
