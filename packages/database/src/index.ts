export {
  createDatabaseConfig,
  DatabaseConfigurationError,
  type DatabaseConfigInput,
  type DatabaseRuntimeConfig
} from "./database-config.js";
export {
  createDatabaseClient,
  type DatabaseClientContract,
  type DatabaseClientCreator,
  type DatabaseClientFactoryInput
} from "./client.js";
export {
  connectDatabase,
  disconnectDatabase,
  safelyShutdownDatabase,
  type DatabaseLifecycleResult,
  type DatabaseLifecycleStatus
} from "./lifecycle.js";
export {
  type ReadRepositoryContract,
  type RepositoryContract,
  type RepositoryDeleteOptions,
  type RepositoryFindOptions,
  type RepositoryOperationContext,
  type RepositoryWriteOptions,
  type WriteRepositoryContract
} from "./repository.js";
export {
  createTransactionBoundary,
  type TransactionBoundary,
  type TransactionHandler,
  type TransactionIsolationLevel,
  type TransactionOptions,
  type TransactionRunner
} from "./transaction.js";
export {
  DATABASE_ERROR_CODES,
  DatabaseError,
  sanitizeDatabaseErrorMessage,
  toSafeDatabaseErrorDetails,
  type DatabaseErrorCode,
  type DatabaseErrorOptions,
  type SafeDatabaseErrorDetails
} from "./database-error.js";
export {
  checkDatabaseHealth,
  type DatabaseHealthCheckInput,
  type DatabaseHealthClock,
  type DatabaseHealthProbe,
  type DatabaseHealthResult,
  type DatabaseHealthStatus
} from "./health.js";
export {
  createSeedPlaceholder,
  type DatabaseSeedPlan,
  type DatabaseSeedResult
} from "./seed.js";
export {
  PRODUCT_DATA_MODEL_NAMES,
  PRODUCT_DATA_SCHEMA_BOUNDARY,
  PRODUCT_DATA_TABLE_NAMES,
  type ProductDataModelName,
  type ProductDataTableName
} from "./product-data-schema.js";
export {
  createPrismaDatabaseRuntime,
  type PrismaDatabaseRuntime
} from "./prisma-runtime.js";
