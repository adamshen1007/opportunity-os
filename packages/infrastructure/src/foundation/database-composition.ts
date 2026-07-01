import type {
  DatabaseClientContract,
  DatabaseClientCreator,
  DatabaseHealthCheckInput,
  DatabaseRuntimeConfig
} from "@opportunity-os/database";

export type DatabaseCompositionContract<
  TClient extends DatabaseClientContract = DatabaseClientContract
> = {
  readonly packageName: "@opportunity-os/database";
  readonly config: DatabaseRuntimeConfig;
  readonly createClient?: DatabaseClientCreator<TClient>;
  readonly healthCheck?: DatabaseHealthCheckInput;
};
