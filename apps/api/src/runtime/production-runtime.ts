import { createPrismaDatabaseRuntime, type PrismaDatabaseRuntime } from "@opportunity-os/database";
import type { ApiFeedbackStore } from "../feedback/index.js";
import { createDatabaseInviteStore, type ApiInviteStore } from "../auth/index.js";
import {
  createDatabaseFeedbackStore,
  createDatabaseScanPersistenceStore,
  type ApiFeedbackPersistenceDatabaseClient,
  type ApiScanPersistenceDatabaseClient,
  type ApiScanPersistenceStore
} from "../persistence/index.js";

export interface ApiProductionRuntime {
  readonly database: PrismaDatabaseRuntime;
  readonly scanPersistence: ApiScanPersistenceStore;
  readonly feedbackStore: ApiFeedbackStore;
  readonly inviteStore: ApiInviteStore;
  readonly close: () => Promise<void>;
  readonly databaseIsReady: () => Promise<boolean>;
}

export async function createApiProductionRuntime(
  env: NodeJS.ProcessEnv = process.env
): Promise<ApiProductionRuntime> {
  const databaseUrl = env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required when API_PERSISTENCE_MODE=database.");
  }

  const database = createPrismaDatabaseRuntime(databaseUrl);
  await database.connect();
  const inviteCodePepper = env.JWT_SECRET?.trim();
  if (!inviteCodePepper) {
    await database.disconnect();
    throw new Error("JWT_SECRET is required for durable invite authentication.");
  }

  return {
    database,
    scanPersistence: createDatabaseScanPersistenceStore(toScanPersistenceClient(database.client)),
    feedbackStore: createDatabaseFeedbackStore(toFeedbackPersistenceClient(database.client)),
    inviteStore: createDatabaseInviteStore({ client: database.client, inviteCodePepper }),
    close: () => database.disconnect(),
    databaseIsReady: () => database.probe()
  };
}

type RuntimeClient = PrismaDatabaseRuntime["client"];

function toScanPersistenceClient(client: RuntimeClient): ApiScanPersistenceDatabaseClient {
  const delegate = (model: {
    upsert: (args: never) => Promise<unknown>;
    findUnique?: (args: never) => Promise<unknown>;
    findMany?: (args: never) => Promise<readonly unknown[]>;
  }) => {
    const findUnique = model.findUnique;
    const findMany = model.findMany;
    return {
      upsert: (args: unknown) => model.upsert(args as never),
      ...(findUnique ? { findUnique: (args: unknown) => findUnique(args as never) } : {}),
      ...(findMany ? { findMany: (args: unknown) => findMany(args as never) } : {})
    };
  };
  return {
    scanRunRecord: delegate(client.scanRunRecord as never),
    rawSourceContent: delegate(client.rawSourceContent as never),
    normalizedContent: delegate(client.normalizedContent as never),
    analysisResult: delegate(client.analysisResult as never),
    candidateOpportunityRecord: delegate(client.candidateOpportunityRecord as never),
    generatedOpportunityRecord: delegate(client.generatedOpportunityRecord as never),
    opportunityRankingResult: delegate(client.opportunityRankingResult as never),
    opportunityRankingItem: delegate(client.opportunityRankingItem as never)
  };
}

function toFeedbackPersistenceClient(client: RuntimeClient): ApiFeedbackPersistenceDatabaseClient {
  return {
    privateBetaFeedback: {
      create: async (args) => client.privateBetaFeedback.create(args as never),
      findUnique: async (args) => client.privateBetaFeedback.findUnique(args as never),
      findMany: async (args) => client.privateBetaFeedback.findMany(args as never)
    }
  } as ApiFeedbackPersistenceDatabaseClient;
}
