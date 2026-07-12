import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

export interface PrismaDatabaseRuntime {
  readonly client: PrismaClient;
  readonly connect: () => Promise<void>;
  readonly disconnect: () => Promise<void>;
  readonly probe: () => Promise<boolean>;
}

export function createPrismaDatabaseRuntime(databaseUrl: string): PrismaDatabaseRuntime {
  const connectionString = databaseUrl.trim();
  if (!/^postgres(?:ql)?:\/\//u.test(connectionString)) {
    throw new Error("A PostgreSQL DATABASE_URL is required for the production database runtime.");
  }

  const client = new PrismaClient({
    adapter: new PrismaPg({ connectionString })
  });

  return {
    client,
    connect: () => client.$connect(),
    disconnect: () => client.$disconnect(),
    async probe() {
      try {
        await client.$queryRaw`SELECT 1`;
        return true;
      } catch {
        return false;
      }
    }
  };
}
