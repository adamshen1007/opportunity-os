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

// A hosted scan persists several related records atomically. Prisma's five-second
// interactive-transaction default is too short for multi-item writes over a
// remote database connection.
export const API_SCAN_PERSISTENCE_TRANSACTION_OPTIONS = Object.freeze({
  maxWait: 10_000,
  timeout: 60_000
});

export async function createApiProductionRuntime(
  env: NodeJS.ProcessEnv = process.env
): Promise<ApiProductionRuntime> {
  const databaseUrl = env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required when API_PERSISTENCE_MODE=database.");
  }

  const database = createPrismaDatabaseRuntime(databaseUrl);
  await database.connect();
  const inviteCodePepper = env.AUTH_SECRET_PEPPER?.trim();
  if (!inviteCodePepper) {
    await database.disconnect();
    throw new Error("AUTH_SECRET_PEPPER is required for durable invite authentication.");
  }

  return {
    database,
    scanPersistence: createDatabaseScanPersistenceStore(toScanPersistenceClient(database.client)),
    feedbackStore: createDatabaseFeedbackStore(toFeedbackPersistenceClient(database.client)),
    inviteStore: createDatabaseInviteStore({
      client: database.client,
      inviteCodePepper,
      sessionTtlMs: parsePositiveInteger(env.AUTH_SESSION_TTL_MS),
      inviteTtlMs: parsePositiveInteger(env.AUTH_INVITE_TTL_MS)
    }),
    close: () => database.disconnect(),
    databaseIsReady: () => database.probe()
  };
}

function parsePositiveInteger(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}

type RuntimeClient = PrismaDatabaseRuntime["client"];

function toScanPersistenceClient(client: RuntimeClient, includeTransaction = true): ApiScanPersistenceDatabaseClient {
  const delegate = (model: {
    upsert: (args: never) => Promise<unknown>;
    findUnique?: (args: never) => Promise<unknown>;
    findMany?: (args: never) => Promise<readonly unknown[]>;
    delete?: (args: never) => Promise<unknown>;
    deleteMany?: (args: never) => Promise<unknown>;
  }) => {
    const findUnique = model.findUnique;
    const findMany = model.findMany;
    const deleteRecord = model.delete;
    const deleteMany = model.deleteMany;
    return {
      upsert: (args: unknown) => model.upsert(args as never),
      ...(findUnique ? { findUnique: (args: unknown) => findUnique(args as never) } : {}),
      ...(findMany ? { findMany: (args: unknown) => findMany(args as never) } : {})
      ,...(deleteRecord ? { delete: (args: unknown) => deleteRecord(args as never) } : {})
      ,...(deleteMany ? { deleteMany: (args: unknown) => deleteMany(args as never) } : {})
    };
  };
  return {
    scanRunRecord: delegate(client.scanRunRecord as never),
    rawSourceContent: delegate(client.rawSourceContent as never),
    normalizedContent: delegate(client.normalizedContent as never),
    analysisResult: delegate(client.analysisResult as never),
    evidenceCluster: delegate(client.evidenceCluster as never),
    evidenceClusterMembership: delegate(client.evidenceClusterMembership as never),
    candidateOpportunityRecord: delegate(client.candidateOpportunityRecord as never),
    generatedOpportunityRecord: delegate(client.generatedOpportunityRecord as never),
    opportunityRankingResult: delegate(client.opportunityRankingResult as never),
    opportunityRankingItem: delegate(client.opportunityRankingItem as never),
    ...(includeTransaction ? {
      transaction: <T>(operation: (database: ApiScanPersistenceDatabaseClient) => Promise<T>) =>
        client.$transaction(
          (transaction) => operation(toScanPersistenceClient(transaction as RuntimeClient, false)),
          API_SCAN_PERSISTENCE_TRANSACTION_OPTIONS
        )
    } : {})
  };
}

function toFeedbackPersistenceClient(client: RuntimeClient): ApiFeedbackPersistenceDatabaseClient {
  return {
    privateBetaFeedback: {
      create: async (args) => client.privateBetaFeedback.create(args as never),
      findUnique: async (args) => client.privateBetaFeedback.findUnique(args as never),
      findMany: async (args) => client.privateBetaFeedback.findMany(args as never)
      ,delete: async (args) => client.privateBetaFeedback.delete(args as never)
    }
  } as ApiFeedbackPersistenceDatabaseClient;
}
