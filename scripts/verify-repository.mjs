import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFoundationFiles = [
  ".editorconfig",
  ".env.example",
  ".github/CODEOWNERS",
  ".github/labels.yml",
  ".github/pull_request_template.md",
  ".github/workflows/build.yml",
  ".github/workflows/label-sync.yml",
  ".github/workflows/lint.yml",
  ".github/workflows/test.yml",
  ".gitignore",
  ".node-version",
  ".npmrc",
  ".nvmrc",
  "CONTRIBUTING.md",
  "LICENSE",
  "README.md",
  "docker-compose.yml",
  "package.json",
  "pnpm-workspace.yaml",
  "tsconfig.base.json",
  "turbo.json"
];

const requiredReadmes = [
  ".github/README.md",
  "apps/README.md",
  "apps/api/README.md",
  "apps/web/README.md",
  "config/README.md",
  "developer-ai/README.md",
  "developer-ai/00_CONTEXT/README.md",
  "developer-ai/01_STANDARDS/README.md",
  "developer-ai/02_PATTERNS/README.md",
  "developer-ai/03_PLAYBOOKS/README.md",
  "developer-ai/04_PROMPTS/README.md",
  "developer-ai/05_CHECKLISTS/README.md",
  "docker/README.md",
  "docs/README.md",
  "docs/00_INDEX/README.md",
  "docs/01_FOUNDATION/README.md",
  "docs/02_ARCHITECTURE/README.md",
  "docs/03_SPECIFICATIONS/README.md",
  "docs/04_IMPLEMENTATION/README.md",
  "docs/05_BOOTSTRAP/README.md",
  "examples/README.md",
  "infrastructure/README.md",
  "packages/README.md",
  "packages/acquisition/README.md",
  "packages/analysis/README.md",
  "packages/ai/README.md",
  "packages/application/README.md",
  "packages/container/README.md",
  "packages/connector-host/README.md",
  "packages/connector-runtime/README.md",
  "packages/connectors-reddit/README.md",
  "packages/connectors/README.md",
  "packages/config/README.md",
  "packages/database/README.md",
  "packages/domain/README.md",
  "packages/embeddings/README.md",
  "packages/events/README.md",
  "packages/infrastructure/README.md",
  "packages/intelligence/README.md",
  "packages/llm-analysis/README.md",
  "packages/normalization/README.md",
  "packages/opportunity-candidates/README.md",
  "packages/opportunity-engine/README.md",
  "packages/opportunity-generation/README.md",
  "packages/opportunity-ranking/README.md",
  "packages/opportunity-pipeline/README.md",
  "packages/raw-content/README.md",
  "packages/shared/README.md",
  "packages/ui/README.md",
  "prompts/README.md",
  "schemas/README.md",
  "scripts/README.md"
];

const errors = [];
const expectedPackageManager = "pnpm@11.7.0";
const expectedNodeEngine = ">=24 <25";
const expectedPnpmEngine = "11.7.0";
const expectedNodeVersion = "24";
const placeholderOnlyRoots = ["apps", "packages"];
const phase = process.argv.includes("--phase") ? process.argv[process.argv.indexOf("--phase") + 1] : "lint";
const phaseOneAliases = new Set(["phase1", "phase-1", "phase-1-milestone-1"]);
const phaseTwoAliases = new Set(["phase-1-milestone-2", "shared-foundation"]);
const phaseThreeAliases = new Set(["phase-1-milestone-3", "logging-foundation"]);
const phaseFourAliases = new Set(["phase-1-milestone-4", "event-foundation"]);
const phaseFiveAliases = new Set(["phase-1-milestone-5", "database-foundation"]);
const phaseSixAliases = new Set(["phase-1-milestone-6", "domain-foundation"]);
const phaseSevenAliases = new Set(["phase-1-milestone-7", "application-foundation"]);
const phaseEightAliases = new Set(["phase-1-milestone-8", "container-foundation", "composition-foundation"]);
const phaseNineAliases = new Set(["phase-1-milestone-9", "infrastructure-composition-foundation", "infrastructure-foundation"]);
const phaseTenAliases = new Set(["phase-2-milestone-10", "connector-sdk-foundation", "connectors-foundation"]);
const phaseElevenAliases = new Set(["phase-2-milestone-11", "connector-runtime-foundation"]);
const phaseTwelveAliases = new Set(["phase-2-milestone-12", "connector-host-foundation"]);
const phaseThirteenAliases = new Set(["phase-2-milestone-13", "reddit-connector-foundation"]);
const phaseFourteenAliases = new Set(["phase-2-milestone-14", "reddit-runtime-foundation", "reddit-connector-runtime-implementation"]);
const phaseFifteenAliases = new Set(["phase-2-milestone-15", "reddit-provider-transport"]);
const phaseSixteenAliases = new Set(["phase-2-milestone-16", "raw-content-pipeline-foundation"]);
const phaseSeventeenAliases = new Set(["phase-2-milestone-17", "normalization-pipeline-foundation"]);
const phaseEighteenAliases = new Set(["phase-2-milestone-18", "embedding-foundation", "embeddings-foundation"]);
const phaseNineteenAliases = new Set(["phase-2-milestone-19", "llm-analysis-foundation"]);
const phaseTwentyAliases = new Set(["phase-2-milestone-20", "structured-analysis-foundation", "structured-analysis-pipeline"]);
const phaseTwentyOneAliases = new Set(["phase-2-milestone-21", "opportunity-engine-foundation"]);
const phaseTwentyTwoAliases = new Set(["phase-2-milestone-22", "opportunity-pipeline-foundation"]);
const phaseTwentyThreeAliases = new Set(["phase-2-milestone-23", "candidate-opportunity-engine", "opportunity-candidates-foundation"]);
const phaseTwentyFourAliases = new Set(["phase-2-milestone-24", "opportunity-generation-workflow", "opportunity-generation-foundation"]);
const phaseTwentyFiveAliases = new Set(["phase-3-milestone-25", "opportunity-ranking-engine", "opportunity-ranking-foundation"]);
const phaseTwentySixAliases = new Set(["phase-3-milestone-26", "rest-api", "api-foundation"]);
const phaseTwentySevenAliases = new Set(["phase-3-milestone-27", "dashboard-mvp", "web-dashboard"]);
const phaseTwentyEightAliases = new Set(["phase-3-milestone-28", "product-validation-loop", "product-validation-foundation"]);
const phaseTwentyNineAliases = new Set(["phase-3-milestone-29", "private-beta", "private-beta-foundation"]);
const phaseThirtyAliases = new Set(["review", "phase-3-milestone-30", "beta-operations", "beta-operations-foundation"]);
const phaseThirtyOneAliases = new Set(["phase-4-milestone-31", "local-product-runtime", "local-runtime"]);
const phaseThirtyTwoAliases = new Set(["phase-4-milestone-32", "product-data-schema"]);
const phaseThirtyThreeAliases = new Set(["phase-4-milestone-33", "reddit-live-provider-transport", "reddit-live-transport"]);
const phaseThirtyFourAliases = new Set(["phase-4-milestone-34", "external-mvp-runtime", "hosted-external-mvp"]);
const isPhaseThirtyFour = phaseThirtyFourAliases.has(phase) || phase === "review";
const isPhaseThirtyThree = phaseThirtyThreeAliases.has(phase) || isPhaseThirtyFour;
const isPhaseThirtyTwo = phaseThirtyTwoAliases.has(phase) || isPhaseThirtyThree;
const isPhaseThirtyOne = phaseThirtyOneAliases.has(phase) || isPhaseThirtyTwo;
const isPhaseThirty = phaseThirtyAliases.has(phase);
const isPhaseTwentyNine = phaseTwentyNineAliases.has(phase) || isPhaseThirty;
const isPhaseTwentyEight = phaseTwentyEightAliases.has(phase) || isPhaseTwentyNine || isPhaseThirtyOne;
const isPhaseTwentySeven = phaseTwentySevenAliases.has(phase) || isPhaseTwentyEight;
const isPhaseTwentySix = phaseTwentySixAliases.has(phase) || isPhaseTwentySeven;
const isPhaseTwentyFive = phaseTwentyFiveAliases.has(phase) || isPhaseTwentySix || isPhaseTwentySeven;
const isPhaseTwentyFour = phaseTwentyFourAliases.has(phase) || isPhaseTwentyFive;
const isPhaseTwentyThree = phaseTwentyThreeAliases.has(phase) || isPhaseTwentyFour;
const isPhaseTwentyTwo = phaseTwentyTwoAliases.has(phase) || isPhaseTwentyThree;
const isPhaseTwentyOne = phaseTwentyOneAliases.has(phase) || isPhaseTwentyTwo;
const isPhaseTwenty = phaseTwentyAliases.has(phase) || isPhaseTwentyOne;
const isPhaseNineteen = phaseNineteenAliases.has(phase) || isPhaseTwenty;
const isPhaseOne = phaseOneAliases.has(phase);
const isPhaseEighteen = phaseEighteenAliases.has(phase) || isPhaseNineteen;
const isPhaseSeventeen = phaseSeventeenAliases.has(phase) || isPhaseEighteen;
const isPhaseSixteen = phaseSixteenAliases.has(phase) || isPhaseSeventeen;
const isPhaseFifteen = phaseFifteenAliases.has(phase) || isPhaseSixteen;
const isPhaseTwo = phaseTwoAliases.has(phase) || phaseThreeAliases.has(phase) || phaseFourAliases.has(phase) || phaseFiveAliases.has(phase) || phaseSixAliases.has(phase) || phaseSevenAliases.has(phase) || phaseEightAliases.has(phase) || phaseNineAliases.has(phase) || phaseTenAliases.has(phase) || phaseElevenAliases.has(phase) || phaseTwelveAliases.has(phase) || phaseThirteenAliases.has(phase) || phaseFourteenAliases.has(phase) || isPhaseFifteen;
const isPhaseThree = phaseThreeAliases.has(phase) || phaseFourAliases.has(phase) || phaseFiveAliases.has(phase) || phaseSixAliases.has(phase) || phaseSevenAliases.has(phase) || phaseEightAliases.has(phase) || phaseNineAliases.has(phase) || phaseTenAliases.has(phase) || phaseElevenAliases.has(phase) || phaseTwelveAliases.has(phase) || phaseThirteenAliases.has(phase) || phaseFourteenAliases.has(phase) || isPhaseFifteen;
const isPhaseFour = phaseFourAliases.has(phase) || phaseFiveAliases.has(phase) || phaseSixAliases.has(phase) || phaseSevenAliases.has(phase) || phaseEightAliases.has(phase) || phaseNineAliases.has(phase) || phaseTenAliases.has(phase) || phaseElevenAliases.has(phase) || phaseTwelveAliases.has(phase) || phaseThirteenAliases.has(phase) || phaseFourteenAliases.has(phase) || isPhaseFifteen;
const isPhaseFive = phaseFiveAliases.has(phase) || phaseSixAliases.has(phase) || phaseSevenAliases.has(phase) || phaseEightAliases.has(phase) || phaseNineAliases.has(phase) || phaseTenAliases.has(phase) || phaseElevenAliases.has(phase) || phaseTwelveAliases.has(phase) || phaseThirteenAliases.has(phase) || phaseFourteenAliases.has(phase) || isPhaseFifteen;
const isPhaseSix = phaseSixAliases.has(phase) || phaseSevenAliases.has(phase) || phaseEightAliases.has(phase) || phaseNineAliases.has(phase) || phaseTenAliases.has(phase) || phaseElevenAliases.has(phase) || phaseTwelveAliases.has(phase) || phaseThirteenAliases.has(phase) || phaseFourteenAliases.has(phase) || isPhaseFifteen;
const isPhaseSeven = phaseSevenAliases.has(phase) || phaseEightAliases.has(phase) || phaseNineAliases.has(phase) || phaseTenAliases.has(phase) || phaseElevenAliases.has(phase) || phaseTwelveAliases.has(phase) || phaseThirteenAliases.has(phase) || phaseFourteenAliases.has(phase) || isPhaseFifteen;
const isPhaseEight = phaseEightAliases.has(phase) || phaseNineAliases.has(phase) || phaseTenAliases.has(phase) || phaseElevenAliases.has(phase) || phaseTwelveAliases.has(phase) || phaseThirteenAliases.has(phase) || phaseFourteenAliases.has(phase) || isPhaseFifteen;
const isPhaseNine = phaseNineAliases.has(phase) || phaseTenAliases.has(phase) || phaseElevenAliases.has(phase) || phaseTwelveAliases.has(phase) || phaseThirteenAliases.has(phase) || phaseFourteenAliases.has(phase) || isPhaseFifteen;
const isPhaseTen = phaseTenAliases.has(phase) || phaseElevenAliases.has(phase) || phaseTwelveAliases.has(phase) || phaseThirteenAliases.has(phase) || phaseFourteenAliases.has(phase) || isPhaseFifteen;
const isPhaseEleven = phaseElevenAliases.has(phase) || phaseTwelveAliases.has(phase) || phaseThirteenAliases.has(phase) || phaseFourteenAliases.has(phase) || isPhaseFifteen;
const isPhaseTwelve = phaseTwelveAliases.has(phase) || phaseThirteenAliases.has(phase) || phaseFourteenAliases.has(phase) || isPhaseFifteen;
const isPhaseThirteen = phaseThirteenAliases.has(phase) || phaseFourteenAliases.has(phase) || isPhaseFifteen;
const isPhaseFourteen = phaseFourteenAliases.has(phase) || isPhaseFifteen;
const allowedPhaseOneImplementationRoots = ["packages/config"];
const allowedPhaseTwoImplementationRoots = ["packages/config", "packages/types", "packages/errors", "packages/utils", "packages/shared"];
const allowedPhaseFourImplementationRoots = [...allowedPhaseTwoImplementationRoots, "packages/events"];
const allowedPhaseFiveImplementationRoots = [...allowedPhaseFourImplementationRoots, "packages/database"];
const allowedPhaseSixImplementationRoots = [...allowedPhaseFiveImplementationRoots, "packages/domain"];
const allowedPhaseSevenImplementationRoots = [...allowedPhaseSixImplementationRoots, "packages/application"];
const allowedPhaseEightImplementationRoots = [...allowedPhaseSevenImplementationRoots, "packages/container"];
const allowedPhaseNineImplementationRoots = [...allowedPhaseEightImplementationRoots, "packages/infrastructure"];
const allowedPhaseTenImplementationRoots = [...allowedPhaseNineImplementationRoots, "packages/connectors"];
const allowedPhaseElevenImplementationRoots = [...allowedPhaseTenImplementationRoots, "packages/connector-runtime"];
const allowedPhaseTwelveImplementationRoots = [...allowedPhaseElevenImplementationRoots, "packages/connector-host"];
const allowedPhaseThirteenImplementationRoots = [...allowedPhaseTwelveImplementationRoots, "packages/connectors-reddit"];
const allowedPhaseFourteenImplementationRoots = allowedPhaseThirteenImplementationRoots;
const allowedPhaseFifteenImplementationRoots = allowedPhaseFourteenImplementationRoots;
const allowedPhaseSixteenImplementationRoots = [...allowedPhaseFifteenImplementationRoots, "packages/raw-content"];
const allowedPhaseSeventeenImplementationRoots = [...allowedPhaseSixteenImplementationRoots, "packages/normalization"];
const allowedPhaseEighteenImplementationRoots = [...allowedPhaseSeventeenImplementationRoots, "packages/embeddings"];
const allowedPhaseNineteenImplementationRoots = [...allowedPhaseEighteenImplementationRoots, "packages/llm-analysis"];
const allowedPhaseTwentyImplementationRoots = [...allowedPhaseNineteenImplementationRoots, "packages/analysis"];
const allowedPhaseTwentyOneImplementationRoots = [...allowedPhaseTwentyImplementationRoots, "packages/opportunity-engine"];
const allowedPhaseTwentyTwoImplementationRoots = [...allowedPhaseTwentyOneImplementationRoots, "packages/opportunity-pipeline"];
const allowedPhaseTwentyThreeImplementationRoots = [...allowedPhaseTwentyTwoImplementationRoots, "packages/opportunity-candidates"];
const allowedPhaseTwentyFourImplementationRoots = [...allowedPhaseTwentyThreeImplementationRoots, "packages/opportunity-generation"];
const allowedPhaseTwentyFiveImplementationRoots = [...allowedPhaseTwentyFourImplementationRoots, "packages/opportunity-ranking"];
const allowedPhaseTwentySixImplementationRoots = [...allowedPhaseTwentyFiveImplementationRoots, "apps/api"];
const allowedPhaseTwentySevenImplementationRoots = [...allowedPhaseTwentySixImplementationRoots, "apps/web"];
const allowedPhaseTwentyEightImplementationRoots = allowedPhaseTwentySevenImplementationRoots;
const allowedPhaseTwentyNineImplementationRoots = allowedPhaseTwentyEightImplementationRoots;
const allowedPhaseThirtyImplementationRoots = allowedPhaseTwentyNineImplementationRoots;
const allowedPhaseThirtyOneImplementationRoots = allowedPhaseThirtyImplementationRoots;
const allowedPhaseThirtyTwoImplementationRoots = allowedPhaseThirtyOneImplementationRoots;
const allowedPhaseThirtyThreeImplementationRoots = allowedPhaseThirtyTwoImplementationRoots;
const allowedPhaseThirtyFourImplementationRoots = allowedPhaseThirtyThreeImplementationRoots;
const requiredLoggingImplementationFiles = [
  "packages/shared/src/logging/index.ts",
  "packages/shared/src/logging/logger-clock.ts",
  "packages/shared/src/logging/logger-config.ts",
  "packages/shared/src/logging/logger-destination.ts",
  "packages/shared/src/logging/log-entry.ts",
  "packages/shared/src/logging/log-level.ts",
  "packages/shared/src/logging/logger.ts",
  "packages/shared/src/logging/pino-level.ts",
  "packages/shared/src/logging/pino-logger.ts",
  "packages/shared/src/logging/safe-log-entry.ts",
  "packages/shared/src/__tests__/logger-core.test.ts",
  "packages/shared/src/__tests__/logging-contract.test.ts"
];
const requiredLoggingExports = [
  "createPinoLogger",
  "createInMemoryLoggerDestination",
  "createLoggerConfig",
  "createFixedLoggerClock",
  "normalizeLogEntry",
  "normalizeLogError",
  "LOG_LEVELS",
  "PINO_LOG_LEVELS",
  "StructuredLogger",
  "LoggerChildContext",
  "SafeLogEntry",
  "SafeLogError"
];
const requiredEventFoundationFiles = [
  "packages/events/package.json",
  "packages/events/tsconfig.json",
  "packages/events/vitest.config.ts",
  "packages/events/src/index.ts",
  "packages/events/src/event-category.ts",
  "packages/events/src/event-consumer.ts",
  "packages/events/src/event-context.ts",
  "packages/events/src/event-envelope.ts",
  "packages/events/src/event-error.ts",
  "packages/events/src/event-metadata.ts",
  "packages/events/src/event-publisher.ts",
  "packages/events/src/event-result.ts",
  "packages/events/src/event-schema.ts",
  "packages/events/src/event-serialization.ts",
  "packages/events/src/event-version.ts",
  "packages/events/src/idempotency.ts",
  "packages/events/src/replay.ts",
  "packages/events/src/testing/index.ts",
  "packages/events/src/testing/in-memory-event-bus.ts",
  "packages/events/src/__tests__/event-category.test.ts",
  "packages/events/src/__tests__/event-consumer.test.ts",
  "packages/events/src/__tests__/event-contract-stability.test.ts",
  "packages/events/src/__tests__/event-context.test.ts",
  "packages/events/src/__tests__/event-envelope.test.ts",
  "packages/events/src/__tests__/event-result.test.ts",
  "packages/events/src/__tests__/event-serialization.test.ts",
  "packages/events/src/__tests__/event-security.test.ts",
  "packages/events/src/__tests__/event-metadata.test.ts",
  "packages/events/src/__tests__/event-publisher.test.ts",
  "packages/events/src/__tests__/event-schema.test.ts",
  "packages/events/src/__tests__/event-version.test.ts",
  "packages/events/src/__tests__/in-memory-event-bus.test.ts",
  "packages/events/src/__tests__/idempotency.test.ts",
  "packages/events/src/__tests__/replay.test.ts"
];
const requiredEventFoundationExports = [
  "EVENT_CATEGORIES",
  "EventCategory",
  "isEventCategory",
  "EventMetadata",
  "EventMetadataInput",
  "createEventMetadata",
  "EventEnvelope",
  "createEventEnvelope",
  "EventContext",
  "createEventContext",
  "EventSchema",
  "EventSchemaValidationResult",
  "EventPublisher",
  "EventConsumer",
  "IDEMPOTENCY_STATUSES",
  "IdempotencyStatus",
  "ReplayMetadata",
  "ReplayCheckpoint",
  "ReplayEligibility",
  "serializeEventEnvelope",
  "deserializeEventEnvelope",
  "EventResult",
  "EventError",
  "EVENT_ERROR_CODES",
  "createInMemoryEventBus",
  "InMemoryEventBus",
  "EVENT_VERSION_PATTERN",
  "EventVersion",
  "createEventVersion",
  "isEventVersion"
];
const requiredDatabaseFoundationFiles = [
  "packages/database/package.json",
  "packages/database/tsconfig.json",
  "packages/database/vitest.config.ts",
  "packages/database/prisma.config.ts",
  "packages/database/prisma/schema.prisma",
  "packages/database/prisma/migrations/00000000000000_foundation_baseline/migration.sql",
  "packages/database/src/index.ts",
  "packages/database/src/client.ts",
  "packages/database/src/database-config.ts",
  "packages/database/src/database-error.ts",
  "packages/database/src/health.ts",
  "packages/database/src/lifecycle.ts",
  "packages/database/src/repository.ts",
  "packages/database/src/seed.ts",
  "packages/database/src/transaction.ts",
  "packages/database/src/__tests__/client.test.ts",
  "packages/database/src/__tests__/database-config.test.ts",
  "packages/database/src/__tests__/database-error.test.ts",
  "packages/database/src/__tests__/database-security.test.ts",
  "packages/database/src/__tests__/exports.test.ts",
  "packages/database/src/__tests__/health.test.ts",
  "packages/database/src/__tests__/lifecycle.test.ts",
  "packages/database/src/__tests__/migration-policy.test.ts",
  "packages/database/src/__tests__/package-boundary.test.ts",
  "packages/database/src/__tests__/repository.test.ts",
  "packages/database/src/__tests__/schema-policy.test.ts",
  "packages/database/src/__tests__/seed.test.ts",
  "packages/database/src/__tests__/transaction.test.ts"
];
const requiredDatabaseFoundationExports = [
  "createDatabaseConfig",
  "DatabaseConfigurationError",
  "DatabaseConfigInput",
  "DatabaseRuntimeConfig",
  "createDatabaseClient",
  "DatabaseClientContract",
  "DatabaseClientCreator",
  "DatabaseClientFactoryInput",
  "connectDatabase",
  "disconnectDatabase",
  "safelyShutdownDatabase",
  "RepositoryContract",
  "RepositoryOperationContext",
  "createTransactionBoundary",
  "TransactionBoundary",
  "DATABASE_ERROR_CODES",
  "DatabaseError",
  "toSafeDatabaseErrorDetails",
  "SafeDatabaseErrorDetails",
  "checkDatabaseHealth",
  "DatabaseHealthResult",
  "createSeedPlaceholder",
  "DatabaseSeedPlan"
];
const requiredDomainFoundationFiles = [
  "packages/domain/package.json",
  "packages/domain/tsconfig.json",
  "packages/domain/vitest.config.ts",
  "packages/domain/src/index.ts",
  "packages/domain/src/aggregate/aggregate-root.ts",
  "packages/domain/src/aggregate/index.ts",
  "packages/domain/src/entity/entity.ts",
  "packages/domain/src/entity/index.ts",
  "packages/domain/src/metadata/domain-metadata.ts",
  "packages/domain/src/metadata/index.ts",
  "packages/domain/src/primitives/domain-id.ts",
  "packages/domain/src/primitives/index.ts",
  "packages/domain/src/value-object/value-object.ts",
  "packages/domain/src/value-object/index.ts",
  "packages/domain/src/events/domain-event.ts",
  "packages/domain/src/events/domain-event-collection.ts",
  "packages/domain/src/events/index.ts",
  "packages/domain/src/errors/domain-error.ts",
  "packages/domain/src/errors/index.ts",
  "packages/domain/src/repository/domain-repository.ts",
  "packages/domain/src/repository/index.ts",
  "packages/domain/src/result/domain-result.ts",
  "packages/domain/src/result/index.ts",
  "packages/domain/src/validation/domain-validation.ts",
  "packages/domain/src/validation/index.ts",
  "packages/domain/src/__tests__/domain-contract-stability.test.ts",
  "packages/domain/src/__tests__/domain-event-contract.test.ts",
  "packages/domain/src/__tests__/domain-error-security.test.ts",
  "packages/domain/src/__tests__/exports.test.ts",
  "packages/domain/src/__tests__/package-boundary.test.ts",
  "packages/domain/src/__tests__/domain-primitives.test.ts",
  "packages/domain/src/__tests__/domain-repository-contract.test.ts",
  "packages/domain/src/__tests__/domain-structure.test.ts",
  "packages/domain/src/__tests__/domain-validation-result.test.ts"
];
const requiredDomainFoundationExports = [
  "AggregateIdentity",
  "AggregateRoot",
  "DomainEventReference",
  "Entity",
  "EntityIdentity",
  "CreatedMetadata",
  "DomainMetadata",
  "UpdatedMetadata",
  "VersionMetadata",
  "DomainId",
  "DomainTimestamp",
  "DomainVersion",
  "ValueObject",
  "ValueObjectEquality",
  "ValueObjectProperties",
  "DomainEventCollection",
  "DomainEventCollectionSnapshot",
  "DomainEventMetadata",
  "DomainEventName",
  "DomainEventPayload",
  "DomainEventReference",
  "DomainEventVersion",
  "DomainError",
  "createDomainError",
  "DomainErrorCategory",
  "DomainErrorCode",
  "DomainErrorOptions",
  "SafeDomainErrorDetails",
  "DomainRepositoryContext",
  "DomainRepositoryContract",
  "domainFailure",
  "domainSuccess",
  "DomainFailure",
  "DomainResult",
  "DomainSuccess",
  "DomainValidationFailure",
  "DomainValidationIssue",
  "DomainValidationResult",
  "DomainValidationSuccess"
];
const requiredApplicationFoundationFiles = [
  "packages/application/package.json",
  "packages/application/tsconfig.json",
  "packages/application/vitest.config.ts",
  "packages/application/src/index.ts",
  "packages/application/src/commands/command.ts",
  "packages/application/src/commands/command-handler.ts",
  "packages/application/src/commands/index.ts",
  "packages/application/src/queries/query.ts",
  "packages/application/src/queries/query-handler.ts",
  "packages/application/src/queries/index.ts",
  "packages/application/src/use-cases/use-case.ts",
  "packages/application/src/use-cases/use-case-result.ts",
  "packages/application/src/use-cases/index.ts",
  "packages/application/src/services/application-service.ts",
  "packages/application/src/services/index.ts",
  "packages/application/src/results/application-result.ts",
  "packages/application/src/results/index.ts",
  "packages/application/src/validation/application-validation.ts",
  "packages/application/src/validation/index.ts",
  "packages/application/src/handlers/handler-context.ts",
  "packages/application/src/handlers/handler-contract.ts",
  "packages/application/src/handlers/index.ts",
  "packages/application/src/di/injection-token.ts",
  "packages/application/src/di/provider.ts",
  "packages/application/src/di/container-contract.ts",
  "packages/application/src/di/index.ts",
  "packages/application/src/context/application-context.ts",
  "packages/application/src/context/request-context.ts",
  "packages/application/src/context/index.ts",
  "packages/application/src/errors/application-error.ts",
  "packages/application/src/errors/index.ts",
  "packages/application/src/events/application-event-publisher.ts",
  "packages/application/src/events/application-event-dispatch.ts",
  "packages/application/src/events/index.ts",
  "packages/application/src/ports/repository-port.ts",
  "packages/application/src/ports/domain-repository-port.ts",
  "packages/application/src/ports/transaction-port.ts",
  "packages/application/src/ports/index.ts",
  "packages/application/src/__tests__/command-contract.test.ts",
  "packages/application/src/__tests__/query-contract.test.ts",
  "packages/application/src/__tests__/use-case-contract.test.ts",
  "packages/application/src/__tests__/application-service-contract.test.ts",
  "packages/application/src/__tests__/di-contract.test.ts",
  "packages/application/src/__tests__/application-context.test.ts",
  "packages/application/src/__tests__/application-error.test.ts",
  "packages/application/src/__tests__/application-event-contract.test.ts",
  "packages/application/src/__tests__/repository-port-contract.test.ts",
  "packages/application/src/__tests__/transaction-port-contract.test.ts",
  "packages/application/src/__tests__/application-result-validation.test.ts",
  "packages/application/src/__tests__/handler-contract.test.ts",
  "packages/application/src/__tests__/exports.test.ts",
  "packages/application/src/__tests__/application-contract-stability.test.ts",
  "packages/application/src/__tests__/package-boundary.test.ts",
  "packages/application/src/__tests__/application-security.test.ts"
];
const requiredApplicationFoundationExports = [
  "ApplicationCommand",
  "ApplicationCommandHandler",
  "ApplicationCommandInput",
  "ApplicationCommandMetadata",
  "ApplicationQuery",
  "ApplicationQueryHandler",
  "ApplicationQueryInput",
  "ApplicationQueryMetadata",
  "UseCase",
  "UseCaseContext",
  "UseCaseFailure",
  "UseCaseInput",
  "UseCaseResult",
  "UseCaseSuccess",
  "useCaseFailure",
  "useCaseSuccess",
  "ApplicationService",
  "ApplicationServiceOperation",
  "ApplicationResult",
  "ApplicationSuccess",
  "ApplicationFailure",
  "applicationSuccess",
  "applicationFailure",
  "ApplicationValidationIssue",
  "ApplicationValidationResult",
  "ApplicationValidationSuccess",
  "ApplicationValidationFailure",
  "applicationValidationSuccess",
  "applicationValidationFailure",
  "ApplicationHandler",
  "HandlerExecutionContext",
  "HandlerExecutionInput",
  "InjectionToken",
  "createInjectionToken",
  "ApplicationProvider",
  "ValueProvider",
  "FactoryProvider",
  "ContainerContract",
  "ApplicationContext",
  "ApplicationContextInput",
  "createApplicationContext",
  "RequestContext",
  "RequestContextInput",
  "CorrelationId",
  "RequestId",
  "createRequestContext",
  "APPLICATION_ERROR_CODES",
  "ApplicationError",
  "createApplicationError",
  "ApplicationErrorCategory",
  "ApplicationErrorCode",
  "ApplicationErrorOptions",
  "SafeApplicationErrorDetails",
  "ApplicationEventPublisher",
  "ApplicationEventPublisherPort",
  "ApplicationEventDispatchInput",
  "ApplicationEventDispatchPort",
  "ApplicationEventDispatchResult",
  "ApplicationRepositoryPort",
  "DomainRepositoryPort",
  "TransactionBoundaryPort",
  "TransactionScope"
];
const requiredContainerFoundationFiles = [
  "packages/container/package.json",
  "packages/container/README.md",
  "packages/container/tsconfig.json",
  "packages/container/vitest.config.ts",
  "packages/container/src/index.ts",
  "packages/container/src/bindings/config-binding.ts",
  "packages/container/src/bindings/index.ts",
  "packages/container/src/bindings/logger-binding.ts",
  "packages/container/src/composition/composition-result.ts",
  "packages/container/src/composition/composition-root.ts",
  "packages/container/src/composition/index.ts",
  "packages/container/src/container/container.ts",
  "packages/container/src/container/index.ts",
  "packages/container/src/container/resolver.ts",
  "packages/container/src/errors/container-error.ts",
  "packages/container/src/errors/index.ts",
  "packages/container/src/lifetime/index.ts",
  "packages/container/src/lifetime/lifetime.ts",
  "packages/container/src/modules/index.ts",
  "packages/container/src/modules/module-definition.ts",
  "packages/container/src/modules/module-registration.ts",
  "packages/container/src/registration/class-registration.ts",
  "packages/container/src/registration/factory-registration.ts",
  "packages/container/src/registration/index.ts",
  "packages/container/src/registration/service-descriptor.ts",
  "packages/container/src/registration/value-registration.ts",
  "packages/container/src/scope/index.ts",
  "packages/container/src/scope/scope.ts",
  "packages/container/src/scope/scoped-container.ts",
  "packages/container/src/tokens/dependency-token.ts",
  "packages/container/src/tokens/index.ts",
  "packages/container/src/validation/index.ts",
  "packages/container/src/validation/registration-validation.ts",
  "packages/container/src/__tests__/config-binding.test.ts",
  "packages/container/src/__tests__/container-contract.test.ts",
  "packages/container/src/__tests__/container-error.test.ts",
  "packages/container/src/__tests__/contract-stability.test.ts",
  "packages/container/src/__tests__/dependency-token.test.ts",
  "packages/container/src/__tests__/exports.test.ts",
  "packages/container/src/__tests__/lifetime.test.ts",
  "packages/container/src/__tests__/logger-binding.test.ts",
  "packages/container/src/__tests__/module-registration.test.ts",
  "packages/container/src/__tests__/package-boundary.test.ts",
  "packages/container/src/__tests__/registration-contract.test.ts",
  "packages/container/src/__tests__/registration-validation.test.ts",
  "packages/container/src/__tests__/scope-contract.test.ts",
  "packages/container/src/__tests__/service-descriptor.test.ts"
];
const requiredContainerFoundationExports = [
  "ConfigBinding",
  "ConfigBindingInput",
  "LoggerBinding",
  "LoggerBindingContract",
  "LoggerFactoryBinding",
  "ContainerContract",
  "DependencyResolver",
  "COMPOSITION_RESULT_STATUSES",
  "CompositionFailure",
  "CompositionIssue",
  "CompositionResult",
  "CompositionResultStatus",
  "CompositionRoot",
  "CompositionRootInput",
  "CompositionSuccess",
  "CONTAINER_ERROR_CODES",
  "ContainerError",
  "createContainerError",
  "ContainerErrorCode",
  "ContainerErrorOptions",
  "SafeContainerErrorDetails",
  "CONTAINER_LIFETIMES",
  "ContainerLifetime",
  "ModuleDefinition",
  "ModuleId",
  "ModuleRegistration",
  "SERVICE_REGISTRATION_KINDS",
  "ClassRegistration",
  "DependencyFactory",
  "FactoryRegistration",
  "FactoryResolutionContext",
  "ServiceConstructor",
  "ServiceDescriptor",
  "ServiceRegistration",
  "ServiceRegistrationKind",
  "ValueRegistration",
  "createDependencyToken",
  "DependencyToken",
  "REGISTRATION_VALIDATION_ISSUE_CODES",
  "DuplicateTokenIssue",
  "MissingDependencyIssue",
  "RegistrationValidationFailure",
  "RegistrationValidationIssue",
  "RegistrationValidationIssueCode",
  "RegistrationValidationResult",
  "RegistrationValidationSuccess",
  "UnsupportedLifetimeIssue",
  "ContainerScope",
  "ScopeFactory",
  "ScopeId",
  "ScopedContainer"
];
const requiredInfrastructureFoundationFiles = [
  "packages/infrastructure/package.json",
  "packages/infrastructure/README.md",
  "packages/infrastructure/tsconfig.json",
  "packages/infrastructure/vitest.config.ts",
  "packages/infrastructure/src/index.ts",
  "packages/infrastructure/src/bootstrap/index.ts",
  "packages/infrastructure/src/bootstrap/infrastructure-bootstrap.ts",
  "packages/infrastructure/src/composition/index.ts",
  "packages/infrastructure/src/composition/composition-module.ts",
  "packages/infrastructure/src/dependency-graph/index.ts",
  "packages/infrastructure/src/dependency-graph/dependency-graph.ts",
  "packages/infrastructure/src/errors/index.ts",
  "packages/infrastructure/src/errors/infrastructure-error.ts",
  "packages/infrastructure/src/foundation/index.ts",
  "packages/infrastructure/src/foundation/config-composition.ts",
  "packages/infrastructure/src/foundation/database-composition.ts",
  "packages/infrastructure/src/foundation/event-composition.ts",
  "packages/infrastructure/src/foundation/foundation-composition.ts",
  "packages/infrastructure/src/foundation/logging-composition.ts",
  "packages/infrastructure/src/health/index.ts",
  "packages/infrastructure/src/health/health.ts",
  "packages/infrastructure/src/lifecycle/index.ts",
  "packages/infrastructure/src/lifecycle/lifecycle.ts",
  "packages/infrastructure/src/modules/index.ts",
  "packages/infrastructure/src/modules/infrastructure-module.ts",
  "packages/infrastructure/src/modules/package-registration.ts",
  "packages/infrastructure/src/shutdown/index.ts",
  "packages/infrastructure/src/shutdown/graceful-shutdown.ts",
  "packages/infrastructure/src/startup/index.ts",
  "packages/infrastructure/src/startup/startup-validation.ts",
  "packages/infrastructure/src/__tests__/composition-module.test.ts",
  "packages/infrastructure/src/__tests__/contract-stability.test.ts",
  "packages/infrastructure/src/__tests__/dependency-graph.test.ts",
  "packages/infrastructure/src/__tests__/exports.test.ts",
  "packages/infrastructure/src/__tests__/foundation-composition.test.ts",
  "packages/infrastructure/src/__tests__/graceful-shutdown.test.ts",
  "packages/infrastructure/src/__tests__/health.test.ts",
  "packages/infrastructure/src/__tests__/infrastructure-bootstrap.test.ts",
  "packages/infrastructure/src/__tests__/infrastructure-error.test.ts",
  "packages/infrastructure/src/__tests__/infrastructure-module.test.ts",
  "packages/infrastructure/src/__tests__/infrastructure-result.test.ts",
  "packages/infrastructure/src/__tests__/lifecycle.test.ts",
  "packages/infrastructure/src/__tests__/package-boundary.test.ts",
  "packages/infrastructure/src/__tests__/security.test.ts",
  "packages/infrastructure/src/__tests__/startup-validation.test.ts",
  "packages/infrastructure/src/__tests__/package-registration.test.ts"
];
const requiredInfrastructureFoundationExports = [
  "GRACEFUL_SHUTDOWN_RESULT_STATUSES",
  "HEALTH_STATUSES",
  "INFRASTRUCTURE_BOOTSTRAP_STATUSES",
  "INFRASTRUCTURE_LIFECYCLE_PHASES",
  "INFRASTRUCTURE_MODULE_KINDS",
  "INFRASTRUCTURE_PACKAGE_NAMES",
  "STARTUP_VALIDATION_CHECK_KINDS",
  "STARTUP_VALIDATION_STATUSES",
  "DependencyGraphCycle",
  "DependencyGraphDuplicateRegistration",
  "DependencyGraphEdge",
  "DependencyGraphMissingDependency",
  "DependencyGraphNode",
  "DependencyGraphValidationIssue",
  "DependencyGraphValidationIssueCode",
  "DependencyGraphValidationResult",
  "ApplicationCompositionMetadata",
  "ConfigCompositionContract",
  "DatabaseCompositionContract",
  "DomainCompositionMetadata",
  "EventCompositionContract",
  "FoundationPackageCompositionContract",
  "FoundationPackageCompositionMetadata",
  "FoundationPackageCompositionResult",
  "GracefulShutdownFailure",
  "GracefulShutdownParticipant",
  "GracefulShutdownResult",
  "GracefulShutdownResultStatus",
  "HealthAggregateStatus",
  "HealthAggregationResult",
  "HealthCheckContract",
  "HealthComponentStatus",
  "HealthMetadata",
  "HealthStatus",
  "InfrastructureBootstrapContract",
  "InfrastructureBootstrapInput",
  "InfrastructureBootstrapOutput",
  "InfrastructureBootstrapStatus",
  "InfrastructureBootstrapValidationIssue",
  "InfrastructureBootstrapValidationIssueCode",
  "InfrastructureBootstrapValidationResult",
  "InfrastructureComposedContainerResult",
  "InfrastructureCompositionInput",
  "InfrastructureCompositionModule",
  "InfrastructureCompositionResult",
  "InfrastructureError",
  "InfrastructureErrorOptions",
  "InfrastructureFailure",
  "InfrastructureLifecycleOrder",
  "InfrastructureLifecycleParticipant",
  "InfrastructureLifecycleParticipantId",
  "InfrastructureLifecyclePhase",
  "InfrastructureModule",
  "InfrastructureModuleDependency",
  "InfrastructureModuleId",
  "InfrastructureModuleKind",
  "InfrastructurePackageName",
  "InfrastructureResult",
  "InfrastructureSuccess",
  "LoggingCompositionContract",
  "PackageRegistrationMetadata",
  "PackageRegistrationModule",
  "SafeInfrastructureErrorDetails",
  "StartupValidationCheck",
  "StartupValidationCheckKind",
  "StartupValidationFailure",
  "StartupValidationIssue",
  "StartupValidationIssueCode",
  "StartupValidationResult",
  "StartupValidationStatus",
  "StartupValidationSuccess",
  "createInfrastructureError",
  "infrastructureFailure",
  "infrastructureSuccess",
  "sanitizeInfrastructureErrorMessage"
];
const requiredConnectorSdkFoundationFiles = [
  "packages/connectors/package.json",
  "packages/connectors/README.md",
  "packages/connectors/tsconfig.json",
  "packages/connectors/vitest.config.ts",
  "packages/connectors/src/index.ts",
  "packages/connectors/src/capabilities/index.ts",
  "packages/connectors/src/capabilities/connector-capability.ts",
  "packages/connectors/src/configuration/index.ts",
  "packages/connectors/src/configuration/connector-config.ts",
  "packages/connectors/src/connector/index.ts",
  "packages/connectors/src/connector/connector.ts",
  "packages/connectors/src/context/index.ts",
  "packages/connectors/src/context/connector-context.ts",
  "packages/connectors/src/errors/index.ts",
  "packages/connectors/src/errors/connector-error.ts",
  "packages/connectors/src/factory/index.ts",
  "packages/connectors/src/factory/connector-factory.ts",
  "packages/connectors/src/health/index.ts",
  "packages/connectors/src/health/connector-health.ts",
  "packages/connectors/src/limits/index.ts",
  "packages/connectors/src/limits/connector-limits.ts",
  "packages/connectors/src/lifecycle/index.ts",
  "packages/connectors/src/lifecycle/connector-lifecycle.ts",
  "packages/connectors/src/metadata/index.ts",
  "packages/connectors/src/metadata/connector-metadata.ts",
  "packages/connectors/src/operations/index.ts",
  "packages/connectors/src/operations/connector-operation.ts",
  "packages/connectors/src/registry/index.ts",
  "packages/connectors/src/registry/connector-registry.ts",
  "packages/connectors/src/results/index.ts",
  "packages/connectors/src/results/connector-result.ts",
  "packages/connectors/src/testing/index.ts",
  "packages/connectors/src/testing/connector-testing.ts",
  "packages/connectors/src/validation/index.ts",
  "packages/connectors/src/validation/connector-validation.ts",
  "packages/connectors/src/__tests__/connector-capability.test.ts",
  "packages/connectors/src/__tests__/connector-config.test.ts",
  "packages/connectors/src/__tests__/connector-context.test.ts",
  "packages/connectors/src/__tests__/connector-error.test.ts",
  "packages/connectors/src/__tests__/connector-factory.test.ts",
  "packages/connectors/src/__tests__/connector-health.test.ts",
  "packages/connectors/src/__tests__/connector-interface.test.ts",
  "packages/connectors/src/__tests__/connector-limits.test.ts",
  "packages/connectors/src/__tests__/connector-lifecycle.test.ts",
  "packages/connectors/src/__tests__/connector-metadata.test.ts",
  "packages/connectors/src/__tests__/connector-operation.test.ts",
  "packages/connectors/src/__tests__/connector-registry.test.ts",
  "packages/connectors/src/__tests__/connector-result.test.ts",
  "packages/connectors/src/__tests__/connector-testing.test.ts",
  "packages/connectors/src/__tests__/connector-validation.test.ts",
  "packages/connectors/src/__tests__/contract-stability.test.ts",
  "packages/connectors/src/__tests__/exports.test.ts",
  "packages/connectors/src/__tests__/package-boundary.test.ts",
  "packages/connectors/src/__tests__/security.test.ts"
];
const requiredConnectorSdkFoundationExports = [
  "CONNECTOR_CAPABILITY_KINDS",
  "CONNECTOR_CATEGORIES",
  "CONNECTOR_HEALTH_STATUSES",
  "CONNECTOR_LIFECYCLE_PHASES",
  "CONNECTOR_STABILITY_STATUSES",
  "CONNECTOR_VALIDATION_ISSUE_CODES",
  "Connector",
  "ConnectorAssertionContext",
  "ConnectorAssertionHelper",
  "ConnectorCapability",
  "ConnectorCapabilityKind",
  "ConnectorCapabilitySet",
  "ConnectorCategory",
  "ConnectorConfig",
  "ConnectorConfigField",
  "ConnectorConfigFieldKind",
  "ConnectorConfigInput",
  "ConnectorContext",
  "ConnectorContextExecutionMetadata",
  "ConnectorError",
  "ConnectorErrorOptions",
  "ConnectorFactory",
  "ConnectorFactoryInput",
  "ConnectorFactoryResult",
  "ConnectorFailure",
  "ConnectorHealthCheckContract",
  "ConnectorHealthMetadata",
  "ConnectorHealthResult",
  "ConnectorHealthStatus",
  "ConnectorId",
  "ConnectorLimitMetadata",
  "ConnectorLifecycle",
  "ConnectorLifecyclePhase",
  "ConnectorLifecycleState",
  "ConnectorLifecycleTransition",
  "ConnectorMetadata",
  "ConnectorOperationContract",
  "ConnectorOperationExecutionMetadata",
  "ConnectorOperationInput",
  "ConnectorOperationOutput",
  "ConnectorPaginationMetadata",
  "ConnectorProvider",
  "ConnectorQuotaMetadata",
  "ConnectorQuotaWindow",
  "ConnectorRateLimitMetadata",
  "ConnectorRateLimitWindow",
  "ConnectorRegistry",
  "ConnectorRegistryListResult",
  "ConnectorRegistryLookupResult",
  "ConnectorRegistryRegistrationResult",
  "ConnectorResult",
  "ConnectorResultMetadata",
  "ConnectorSensitiveConfigField",
  "ConnectorStabilityStatus",
  "ConnectorSuccess",
  "ConnectorValidationFailure",
  "ConnectorValidationIssue",
  "ConnectorValidationIssueCode",
  "ConnectorValidationIssueTarget",
  "ConnectorValidationResult",
  "ConnectorValidationSuccess",
  "ConnectorVersion",
  "FakeConnectorContext",
  "FakeConnectorFixture",
  "FakeConnectorMetadata",
  "SafeConnectorErrorDetails",
  "connectorFailure",
  "connectorSuccess",
  "createConnectorError",
  "sanitizeConnectorErrorMessage"
];
const requiredConnectorRuntimeFoundationFiles = [
  "packages/connector-runtime/package.json",
  "packages/connector-runtime/README.md",
  "packages/connector-runtime/tsconfig.json",
  "packages/connector-runtime/vitest.config.ts",
  "packages/connector-runtime/src/index.ts",
  "packages/connector-runtime/src/context/index.ts",
  "packages/connector-runtime/src/context/runtime-context.ts",
  "packages/connector-runtime/src/cancellation/cancellation.ts",
  "packages/connector-runtime/src/cancellation/index.ts",
  "packages/connector-runtime/src/checkpoint/checkpoint.ts",
  "packages/connector-runtime/src/checkpoint/index.ts",
  "packages/connector-runtime/src/observability/execution-metrics.ts",
  "packages/connector-runtime/src/observability/index.ts",
  "packages/connector-runtime/src/observability/telemetry.ts",
  "packages/connector-runtime/src/pipeline/index.ts",
  "packages/connector-runtime/src/pipeline/execution-pipeline.ts",
  "packages/connector-runtime/src/policies/index.ts",
  "packages/connector-runtime/src/policies/rate-limit-policy.ts",
  "packages/connector-runtime/src/policies/retry-policy.ts",
  "packages/connector-runtime/src/policies/timeout-policy.ts",
  "packages/connector-runtime/src/results/execution-result-aggregation.ts",
  "packages/connector-runtime/src/results/index.ts",
  "packages/connector-runtime/src/runtime-errors/index.ts",
  "packages/connector-runtime/src/runtime-errors/runtime-error.ts",
  "packages/connector-runtime/src/state/index.ts",
  "packages/connector-runtime/src/state/execution-state.ts",
  "packages/connector-runtime/src/testing/index.ts",
  "packages/connector-runtime/src/testing/runtime-test-harness.ts",
  "packages/connector-runtime/src/__tests__/cancellation.test.ts",
  "packages/connector-runtime/src/__tests__/checkpoint.test.ts",
  "packages/connector-runtime/src/__tests__/contract-stability.test.ts",
  "packages/connector-runtime/src/__tests__/dependency-boundary.test.ts",
  "packages/connector-runtime/src/__tests__/execution-pipeline.test.ts",
  "packages/connector-runtime/src/__tests__/execution-metrics.test.ts",
  "packages/connector-runtime/src/__tests__/execution-result-aggregation.test.ts",
  "packages/connector-runtime/src/__tests__/execution-state.test.ts",
  "packages/connector-runtime/src/__tests__/exports.test.ts",
  "packages/connector-runtime/src/__tests__/package-boundary.test.ts",
  "packages/connector-runtime/src/__tests__/rate-limit-policy.test.ts",
  "packages/connector-runtime/src/__tests__/retry-policy.test.ts",
  "packages/connector-runtime/src/__tests__/runtime-error.test.ts",
  "packages/connector-runtime/src/__tests__/runtime-context.test.ts",
  "packages/connector-runtime/src/__tests__/runtime-test-harness.test.ts",
  "packages/connector-runtime/src/__tests__/security.test.ts",
  "packages/connector-runtime/src/__tests__/telemetry.test.ts",
  "packages/connector-runtime/src/__tests__/timeout-policy.test.ts"
];
const requiredConnectorRuntimeFoundationExports = [
  "CONNECTOR_RUNTIME_BACKOFF_KINDS",
  "CONNECTOR_RUNTIME_CANCELLATION_REASON_CODES",
  "CONNECTOR_RUNTIME_CANCELLATION_STATES",
  "CONNECTOR_RUNTIME_AGGREGATE_RESULT_STATUSES",
  "CONNECTOR_RUNTIME_EXECUTION_STATES",
  "CONNECTOR_RUNTIME_PIPELINE_STAGE_KINDS",
  "CONNECTOR_RUNTIME_RATE_LIMIT_DECISIONS",
  "CONNECTOR_RUNTIME_RETRY_DECISIONS",
  "CONNECTOR_RUNTIME_TELEMETRY_EVENT_KINDS",
  "CONNECTOR_RUNTIME_TIMEOUT_RESULT_STATUSES",
  "CONNECTOR_RUNTIME_TIMEOUT_SCOPES",
  "CONNECTOR_RUNTIME_TRANSITION_KINDS",
  "ConnectorRuntimeAggregatedConnectorResult",
  "ConnectorRuntimeAggregateResultStatus",
  "ConnectorRuntimeAssertionHelper",
  "ConnectorRuntimeAttemptMetrics",
  "ConnectorRuntimeBackoffKind",
  "ConnectorRuntimeBackoffMetadata",
  "ConnectorRuntimeCancellationContextMetadata",
  "ConnectorRuntimeCancellationReasonCode",
  "ConnectorRuntimeCancellationRequest",
  "ConnectorRuntimeCancellationResult",
  "ConnectorRuntimeCancellationState",
  "ConnectorRuntimeCheckpoint",
  "ConnectorRuntimeCheckpointCursor",
  "ConnectorRuntimeCheckpointId",
  "ConnectorRuntimeConnectorReference",
  "ConnectorRuntimeContext",
  "ConnectorRuntimeCountMetrics",
  "ConnectorRuntimeDurationMetrics",
  "ConnectorRuntimeError",
  "ConnectorRuntimeErrorOptions",
  "ConnectorRuntimeExecutionPipeline",
  "ConnectorRuntimeExecutionMetrics",
  "ConnectorRuntimeExecutionResultAggregation",
  "ConnectorRuntimeExecutionState",
  "ConnectorRuntimeFailureMetrics",
  "ConnectorRuntimeFakeClock",
  "ConnectorRuntimeFakeConnectorFixture",
  "ConnectorRuntimeInfrastructureMetadata",
  "ConnectorRuntimeInvalidTransition",
  "ConnectorRuntimePipelineFailure",
  "ConnectorRuntimePipelineFixture",
  "ConnectorRuntimePipelineInput",
  "ConnectorRuntimePipelineOutput",
  "ConnectorRuntimePipelineResult",
  "ConnectorRuntimePipelineStage",
  "ConnectorRuntimePipelineStageKind",
  "ConnectorRuntimePipelineSuccess",
  "ConnectorRuntimeRateLimitDecision",
  "ConnectorRuntimeRateLimitDecisionKind",
  "ConnectorRuntimeRateLimitPolicy",
  "ConnectorRuntimeReplayReadiness",
  "ConnectorRuntimeRetryDecision",
  "ConnectorRuntimeRetryDecisionKind",
  "ConnectorRuntimeRetryPolicy",
  "ConnectorRuntimeStateTransition",
  "ConnectorRuntimeStateSnapshotMetadata",
  "ConnectorRuntimeRecordMetrics",
  "ConnectorRuntimeTelemetryContract",
  "ConnectorRuntimeTelemetryEvent",
  "ConnectorRuntimeTelemetryEventKind",
  "ConnectorRuntimeTelemetryPayload",
  "ConnectorRuntimeTestHarnessContract",
  "ConnectorRuntimeTimeoutDuration",
  "ConnectorRuntimeTimeoutPolicy",
  "ConnectorRuntimeTimeoutResult",
  "ConnectorRuntimeTimeoutResultStatus",
  "ConnectorRuntimeTimeoutScope",
  "ConnectorRuntimeTransitionKind",
  "SafeConnectorRuntimeErrorDetails",
  "createConnectorRuntimeError",
  "sanitizeConnectorRuntimeErrorMessage"
];
const requiredConnectorHostFoundationFiles = [
  "packages/connector-host/package.json",
  "packages/connector-host/README.md",
  "packages/connector-host/tsconfig.json",
  "packages/connector-host/vitest.config.ts",
  "packages/connector-host/src/index.ts",
  "packages/connector-host/src/bootstrap/connector-host-bootstrap.ts",
  "packages/connector-host/src/bootstrap/index.ts",
  "packages/connector-host/src/runner/connector-runner.ts",
  "packages/connector-host/src/runner/index.ts",
  "packages/connector-host/src/orchestration/runtime-orchestration.ts",
  "packages/connector-host/src/orchestration/index.ts",
  "packages/connector-host/src/lifecycle/connector-lifecycle-orchestration.ts",
  "packages/connector-host/src/lifecycle/index.ts",
  "packages/connector-host/src/bindings/connector-host-bindings.ts",
  "packages/connector-host/src/bindings/index.ts",
  "packages/connector-host/src/startup/connector-host-startup-validation.ts",
  "packages/connector-host/src/startup/index.ts",
  "packages/connector-host/src/shutdown/connector-host-shutdown.ts",
  "packages/connector-host/src/shutdown/index.ts",
  "packages/connector-host/src/health/connector-host-health.ts",
  "packages/connector-host/src/health/index.ts",
  "packages/connector-host/src/execution/connector-host-execution.ts",
  "packages/connector-host/src/execution/index.ts",
  "packages/connector-host/src/results/connector-host-result.ts",
  "packages/connector-host/src/results/index.ts",
  "packages/connector-host/src/errors/connector-host-error.ts",
  "packages/connector-host/src/errors/index.ts",
  "packages/connector-host/src/testing/connector-host-test-harness.ts",
  "packages/connector-host/src/testing/index.ts",
  "packages/connector-host/src/__tests__/package-boundary.test.ts",
  "packages/connector-host/src/__tests__/connector-host-bootstrap.test.ts",
  "packages/connector-host/src/__tests__/connector-runner.test.ts",
  "packages/connector-host/src/__tests__/runtime-orchestration.test.ts",
  "packages/connector-host/src/__tests__/connector-lifecycle-orchestration.test.ts",
  "packages/connector-host/src/__tests__/connector-host-bindings.test.ts",
  "packages/connector-host/src/__tests__/connector-host-startup-validation.test.ts",
  "packages/connector-host/src/__tests__/connector-host-shutdown.test.ts",
  "packages/connector-host/src/__tests__/connector-host-health.test.ts",
  "packages/connector-host/src/__tests__/connector-host-execution.test.ts",
  "packages/connector-host/src/__tests__/connector-host-result.test.ts",
  "packages/connector-host/src/__tests__/connector-host-error.test.ts",
  "packages/connector-host/src/__tests__/connector-host-test-harness.test.ts",
  "packages/connector-host/src/__tests__/exports.test.ts",
  "packages/connector-host/src/__tests__/contract-stability.test.ts",
  "packages/connector-host/src/__tests__/security.test.ts",
  "packages/connector-host/src/__tests__/dependency-boundary.test.ts"
];
const requiredConnectorHostFoundationExports = [
  "ConnectorHostBoundary",
  "CONNECTOR_HOST_BOOTSTRAP_STATUSES",
  "ConnectorHostBootstrapContract",
  "ConnectorHostBootstrapInfrastructure",
  "ConnectorHostBootstrapInput",
  "ConnectorHostBootstrapOutput",
  "ConnectorHostBootstrapStatus",
  "CONNECTOR_HOST_RUNNER_RESULT_STATUSES",
  "ConnectorHostRunnerContext",
  "ConnectorHostRunnerContract",
  "ConnectorHostRunnerFailure",
  "ConnectorHostRunnerInput",
  "ConnectorHostRunnerOutput",
  "ConnectorHostRunnerResult",
  "ConnectorHostRunnerResultStatus",
  "ConnectorHostRunnerSuccess",
  "CONNECTOR_HOST_RUNTIME_ORCHESTRATION_STATUSES",
  "ConnectorHostRuntimeOrchestrationContract",
  "ConnectorHostRuntimeOrchestrationInput",
  "ConnectorHostRuntimeOrchestrationOutput",
  "ConnectorHostRuntimeOrchestrationStatus",
  "ConnectorHostRuntimePolicySet",
  "CONNECTOR_HOST_LIFECYCLE_PHASES",
  "ConnectorHostLifecycleOrchestrationContract",
  "ConnectorHostLifecycleOrchestrationInput",
  "ConnectorHostLifecycleOrchestrationOutput",
  "ConnectorHostLifecyclePhase",
  "ConnectorHostBindingContext",
  "ConnectorHostBindings",
  "ConnectorHostConfigBinding",
  "ConnectorHostDependencyBindings",
  "ConnectorHostEventPublisherBinding",
  "ConnectorHostLoggerBinding",
  "CONNECTOR_HOST_STARTUP_CHECK_KINDS",
  "CONNECTOR_HOST_STARTUP_ISSUE_CODES",
  "CONNECTOR_HOST_STARTUP_RESULT_STATUSES",
  "ConnectorHostStartupCheckKind",
  "ConnectorHostStartupIssueCode",
  "ConnectorHostStartupResultStatus",
  "ConnectorHostStartupValidationCheck",
  "ConnectorHostStartupValidationFailure",
  "ConnectorHostStartupValidationIssue",
  "ConnectorHostStartupValidationResult",
  "ConnectorHostStartupValidationSuccess",
  "CONNECTOR_HOST_SHUTDOWN_RESULT_STATUSES",
  "ConnectorHostShutdownFailure",
  "ConnectorHostShutdownParticipant",
  "ConnectorHostShutdownPlan",
  "ConnectorHostShutdownResult",
  "ConnectorHostShutdownResultStatus",
  "ConnectorHostShutdownTimeoutMetadata",
  "CONNECTOR_HOST_HEALTH_STATUSES",
  "ConnectorHostConnectorHealthSummary",
  "ConnectorHostHealthAggregate",
  "ConnectorHostHealthMetadata",
  "ConnectorHostHealthResult",
  "ConnectorHostHealthStatus",
  "ConnectorHostRuntimeHealth",
  "CONNECTOR_HOST_EXECUTION_ORCHESTRATION_STATUSES",
  "ConnectorHostExecutionOrchestrationContext",
  "ConnectorHostExecutionOrchestrationContract",
  "ConnectorHostExecutionOrchestrationStatus",
  "ConnectorHostExecutionPolicyInput",
  "ConnectorHostExecutionRequest",
  "ConnectorHostExecutionResult",
  "ConnectorHostExecutionSafeFailure",
  "ConnectorHostExecutionSuccess",
  "CONNECTOR_HOST_RESULT_STATUSES",
  "ConnectorHostResult",
  "ConnectorHostResultFailure",
  "ConnectorHostResultMetadata",
  "ConnectorHostResultPartialSuccess",
  "ConnectorHostResultStatus",
  "ConnectorHostResultSuccess",
  "ConnectorHostShutdownFailureResult",
  "ConnectorHostValidationFailureResult",
  "ConnectorHostError",
  "ConnectorHostErrorOptions",
  "SafeConnectorHostErrorDetails",
  "createConnectorHostError",
  "sanitizeConnectorHostErrorMessage",
  "ConnectorHostAssertionHelper",
  "ConnectorHostFakeClock",
  "ConnectorHostFakeConfig",
  "ConnectorHostFakeConnectorFixture",
  "ConnectorHostFakeEventPublisherBinding",
  "ConnectorHostFakeLoggerBinding",
  "ConnectorHostFakeRuntimeContext",
  "ConnectorHostTestFixture",
  "ConnectorHostTestHarnessContract"
];
const requiredRedditConnectorFoundationFiles = [
  "packages/connectors-reddit/package.json",
  "packages/connectors-reddit/README.md",
  "packages/connectors-reddit/tsconfig.json",
  "packages/connectors-reddit/vitest.config.ts",
  "packages/connectors-reddit/src/index.ts",
  "packages/connectors-reddit/src/capabilities/index.ts",
  "packages/connectors-reddit/src/capabilities/reddit-capability.ts",
  "packages/connectors-reddit/src/configuration/index.ts",
  "packages/connectors-reddit/src/configuration/reddit-config.ts",
  "packages/connectors-reddit/src/data/index.ts",
  "packages/connectors-reddit/src/data/reddit-author.ts",
  "packages/connectors-reddit/src/data/reddit-comment.ts",
  "packages/connectors-reddit/src/data/reddit-data-envelope.ts",
  "packages/connectors-reddit/src/data/reddit-pagination.ts",
  "packages/connectors-reddit/src/data/reddit-post.ts",
  "packages/connectors-reddit/src/data/reddit-rate-limit.ts",
  "packages/connectors-reddit/src/data/reddit-shared.ts",
  "packages/connectors-reddit/src/data/reddit-subreddit.ts",
  "packages/connectors-reddit/src/errors/index.ts",
  "packages/connectors-reddit/src/errors/reddit-error.ts",
  "packages/connectors-reddit/src/factory/index.ts",
  "packages/connectors-reddit/src/factory/reddit-factory.ts",
  "packages/connectors-reddit/src/host/index.ts",
  "packages/connectors-reddit/src/host/reddit-host.ts",
  "packages/connectors-reddit/src/lifecycle/index.ts",
  "packages/connectors-reddit/src/lifecycle/reddit-lifecycle.ts",
  "packages/connectors-reddit/src/metadata/index.ts",
  "packages/connectors-reddit/src/metadata/reddit-metadata.ts",
  "packages/connectors-reddit/src/operations/index.ts",
  "packages/connectors-reddit/src/operations/reddit-operation.ts",
  "packages/connectors-reddit/src/testing/index.ts",
  "packages/connectors-reddit/src/testing/reddit-fixtures.ts",
  "packages/connectors-reddit/src/validation/index.ts",
  "packages/connectors-reddit/src/validation/reddit-validation.ts",
  "packages/connectors-reddit/src/__tests__/capability.test.ts",
  "packages/connectors-reddit/src/__tests__/config.test.ts",
  "packages/connectors-reddit/src/__tests__/contract-stability.test.ts",
  "packages/connectors-reddit/src/__tests__/data-shapes.test.ts",
  "packages/connectors-reddit/src/__tests__/dependency-boundary.test.ts",
  "packages/connectors-reddit/src/__tests__/error.test.ts",
  "packages/connectors-reddit/src/__tests__/exports.test.ts",
  "packages/connectors-reddit/src/__tests__/fixtures.test.ts",
  "packages/connectors-reddit/src/__tests__/lifecycle-factory-host.test.ts",
  "packages/connectors-reddit/src/__tests__/metadata.test.ts",
  "packages/connectors-reddit/src/__tests__/operation.test.ts",
  "packages/connectors-reddit/src/__tests__/package-boundary.test.ts",
  "packages/connectors-reddit/src/__tests__/security.test.ts",
  "packages/connectors-reddit/src/__tests__/validation.test.ts"
];
const requiredRedditConnectorFoundationExports = [
  "RedditConnectorBoundary",
  "REDDIT_CONNECTOR_METADATA",
  "RedditConnectorMetadata",
  "REDDIT_CONNECTOR_CAPABILITIES",
  "REDDIT_READ_CONTRACT_AREAS",
  "RedditConnectorCapability",
  "REDDIT_CONFIG_FIELD_KEYS",
  "REDDIT_OAUTH_CONFIG_FIELD_KEYS",
  "REDDIT_SENSITIVE_CONFIG_FIELD_KEYS",
  "RedditConnectorConfig",
  "RedditConnectorConfigInput",
  "RedditPost",
  "RedditComment",
  "RedditSubreddit",
  "RedditAuthor",
  "RedditPaginationMetadata",
  "RedditRateLimitMetadata",
  "RedditDataEnvelope",
  "RedditSafeRawMetadataPlaceholder",
  "REDDIT_OPERATION_NAMES",
  "RedditOperationContract",
  "REDDIT_LIFECYCLE_READINESS_STATES",
  "RedditLifecycleReadiness",
  "RedditConnectorFactory",
  "RedditConnectorFactoryInput",
  "RedditHostIntegrationContract",
  "REDDIT_CONNECTOR_ERROR_CODES",
  "RedditConnectorError",
  "createRedditConnectorError",
  "sanitizeRedditConnectorErrorMessage",
  "REDDIT_FAKE_POST",
  "REDDIT_FAKE_PAGINATION",
  "REDDIT_FAKE_RATE_LIMIT",
  "REDDIT_FAKE_HOST_CONTEXT",
  "REDDIT_FAKE_CONFIG",
  "RedditFixtureSet",
  "REDDIT_VALIDATION_ISSUE_CODES",
  "REDDIT_VALIDATION_TARGETS",
  "RedditValidationIssue",
  "RedditValidationResult"
];
const requiredRedditProviderTransportFiles = [
  "packages/connectors-reddit/src/provider/index.ts",
  "packages/connectors-reddit/src/provider/auth.ts",
  "packages/connectors-reddit/src/provider/transport.ts",
  "packages/connectors-reddit/src/provider/api-client.ts",
  "packages/connectors-reddit/src/provider/request-builder.ts",
  "packages/connectors-reddit/src/provider/response-parser.ts",
  "packages/connectors-reddit/src/provider/pagination-transport.ts",
  "packages/connectors-reddit/src/provider/rate-limit-parser.ts",
  "packages/connectors-reddit/src/provider/runtime-compatibility.ts",
  "packages/connectors-reddit/src/provider/auth-lifecycle.ts",
  "packages/connectors-reddit/src/provider/provider-error.ts",
  "packages/connectors-reddit/src/provider/telemetry.ts",
  "packages/connectors-reddit/src/provider/container-bindings.ts",
  "packages/connectors-reddit/src/provider/fixtures.ts",
  "packages/connectors-reddit/src/provider/fake-transport.ts",
  "packages/connectors-reddit/src/__tests__/provider-auth.test.ts",
  "packages/connectors-reddit/src/__tests__/provider-transport-api-client.test.ts",
  "packages/connectors-reddit/src/__tests__/provider-request-builder.test.ts",
  "packages/connectors-reddit/src/__tests__/provider-response-parser.test.ts",
  "packages/connectors-reddit/src/__tests__/provider-pagination-transport.test.ts",
  "packages/connectors-reddit/src/__tests__/provider-rate-limit-parser.test.ts",
  "packages/connectors-reddit/src/__tests__/provider-runtime-compatibility.test.ts",
  "packages/connectors-reddit/src/__tests__/provider-auth-lifecycle.test.ts",
  "packages/connectors-reddit/src/__tests__/provider-error.test.ts",
  "packages/connectors-reddit/src/__tests__/provider-telemetry-container.test.ts",
  "packages/connectors-reddit/src/__tests__/provider-fixtures.test.ts",
  "packages/connectors-reddit/src/__tests__/provider-fake-transport-integration.test.ts",
  "packages/connectors-reddit/src/__tests__/provider-security-hardening.test.ts",
  "packages/connectors-reddit/src/__tests__/provider-contract-stability.test.ts",
  "packages/connectors-reddit/src/__tests__/provider-dependency-boundary.test.ts"
];
const requiredRedditProviderTransportExports = [
  "REDDIT_AUTH_SENSITIVE_FIELD_KEYS",
  "REDDIT_HTTP_METHODS",
  "REDDIT_PROVIDER_AUTH_LIFECYCLE_STATES",
  "REDDIT_PROVIDER_BINDING_CONTRACT",
  "REDDIT_PROVIDER_ERROR_CODES",
  "REDDIT_PROVIDER_ENDPOINTS",
  "REDDIT_PROVIDER_FIXTURE_REQUEST",
  "REDDIT_PROVIDER_FIXTURE_TRANSPORT_RESPONSE",
  "REDDIT_PROVIDER_RATE_LIMIT_HEADER_KEYS",
  "REDDIT_PROVIDER_REDACTED_HEADER_VALUE",
  "REDDIT_PROVIDER_TELEMETRY_EVENT_NAMES",
  "REDDIT_PROVIDER_TRANSPORT_SCOPE",
  "REDDIT_PROVIDER_TRANSPORT_TOKEN",
  "RedditProviderError",
  "RedditFakeTransport",
  "RedditApiClient",
  "RedditApiClientContext",
  "RedditAuthState",
  "RedditProviderAuthLifecycleState",
  "RedditProviderParseResult",
  "RedditProviderRateLimitInput",
  "RedditHttpTransport",
  "RedditOAuthCredentials",
  "RedditOAuthToken",
  "RedditProviderNextPageRequest",
  "RedditProviderRequestDescription",
  "RedditProviderTelemetryContract",
  "createRedditFakeTransport",
  "createRedditProviderError",
  "mapRedditTransportFailureToRetryDecision",
  "mapRedditTimeoutMetadataToRuntimeResult",
  "mapRedditCancellationToRuntimeResult",
  "createRedditProviderPaginationMetadata",
  "createRedditProviderRequestDescription",
  "parseRedditProviderRateLimitMetadata",
  "parseRedditProviderResponse",
  "RedditProviderTransportScope"
];
const requiredRedditLiveProviderTransportFiles = [
  "packages/connectors-reddit/src/provider/live-config.ts",
  "packages/connectors-reddit/src/provider/oauth-client.ts",
  "packages/connectors-reddit/src/provider/live-http-transport.ts",
  "packages/connectors-reddit/src/provider/live-api-client.ts",
  "packages/connectors-reddit/src/provider/live-response-mapper.ts",
  "packages/connectors-reddit/src/provider/live-execution.ts",
  "packages/connectors-reddit/src/provider/live-dev-fetch.ts",
  "packages/connectors-reddit/src/__tests__/provider-live-transport.test.ts",
  "packages/connectors-reddit/src/__tests__/provider-live-security.test.ts",
  "packages/connectors-reddit/src/__tests__/provider-live.integration.test.ts",
  "docs/04_IMPLEMENTATION/04-018_REDDIT_LIVE_PROVIDER_TRANSPORT.md"
];
const requiredRedditLiveProviderTransportExports = [
  "REDDIT_LIVE_PROVIDER_ENV_KEYS",
  "RedditLiveProviderConfig",
  "RedditLiveProviderConfigResult",
  "createRedditLiveProviderConfigFromEnv",
  "exchangeRedditOAuthToken",
  "RedditOAuthTokenExchangeResult",
  "createRedditLiveHttpTransport",
  "RedditLiveHttpTransport",
  "createRedditLiveApiClient",
  "fetchRedditLivePublicPosts",
  "mapRedditLiveListingResponse",
  "RedditLivePublicPostsResult"
];
const approvedRedditLiveProviderTransportSourceFiles = [
  "packages/connectors-reddit/src/provider/index.ts",
  "packages/connectors-reddit/src/provider/live-api-client.ts",
  "packages/connectors-reddit/src/provider/live-config.ts",
  "packages/connectors-reddit/src/provider/live-dev-fetch.ts",
  "packages/connectors-reddit/src/provider/live-execution.ts",
  "packages/connectors-reddit/src/provider/live-http-transport.ts",
  "packages/connectors-reddit/src/provider/live-response-mapper.ts",
  "packages/connectors-reddit/src/provider/oauth-client.ts"
];
const requiredRawContentFoundationFiles = [
  "packages/raw-content/package.json",
  "packages/raw-content/README.md",
  "packages/raw-content/tsconfig.json",
  "packages/raw-content/vitest.config.ts",
  "packages/raw-content/src/index.ts",
  "packages/raw-content/src/content/raw-content-envelope.ts",
  "packages/raw-content/src/deduplication/deduplication.ts",
  "packages/raw-content/src/deduplication/fingerprint.ts",
  "packages/raw-content/src/errors/raw-content-error.ts",
  "packages/raw-content/src/events/raw-content-events.ts",
  "packages/raw-content/src/fixtures/raw-content-fixtures.ts",
  "packages/raw-content/src/mapping/reddit-to-raw-content.ts",
  "packages/raw-content/src/normalization/normalization-boundary.ts",
  "packages/raw-content/src/storage/raw-content-storage-port.ts",
  "packages/raw-content/src/validation/raw-content-validation.ts",
  "packages/raw-content/src/__tests__/dependency-boundary.test.ts",
  "packages/raw-content/src/__tests__/pipeline-contracts.test.ts",
  "packages/raw-content/src/__tests__/raw-content-contracts.test.ts",
  "packages/raw-content/src/__tests__/security.test.ts",
  "packages/raw-content/src/__tests__/stability.test.ts"
];
const requiredRawContentFoundationExports = [
  "RAW_CONTENT_FOUNDATION_PHASE",
  "RAW_CONTENT_PACKAGE_NAME",
  "RawContentPackageBoundary",
  "RAW_CONTENT_ERROR_CODES",
  "RawContentError",
  "RAW_CONTENT_FIXTURE_IDS",
  "rawContentFixturePostEnvelope",
  "RAW_CONTENT_VALIDATION_ISSUE_CODES",
  "RAW_CONTENT_EVENT_NAMES",
  "REDDIT_RAW_CONTENT_MAPPING_TARGETS"
];
const requiredNormalizationFoundationFiles = [
  "packages/normalization/package.json",
  "packages/normalization/README.md",
  "packages/normalization/tsconfig.json",
  "packages/normalization/vitest.config.ts",
  "packages/normalization/src/index.ts",
  "packages/normalization/src/__tests__/package-boundary.test.ts"
];
const requiredNormalizationFoundationExports = [
  "NORMALIZATION_FOUNDATION_PHASE",
  "NORMALIZATION_PACKAGE_NAME",
  "NormalizationPackageBoundary"
];
const requiredEmbeddingFoundationFiles = [
  "packages/embeddings/package.json",
  "packages/embeddings/README.md",
  "packages/embeddings/tsconfig.json",
  "packages/embeddings/vitest.config.ts",
  "packages/embeddings/src/index.ts"
];
const requiredEmbeddingFoundationExports = [
  "EMBEDDINGS_FOUNDATION_PHASE",
  "EMBEDDINGS_PACKAGE_NAME",
  "EmbeddingsPackageBoundary"
];
const requiredLlmAnalysisFoundationFiles = [
  "packages/llm-analysis/package.json",
  "packages/llm-analysis/README.md",
  "packages/llm-analysis/tsconfig.json",
  "packages/llm-analysis/vitest.config.ts",
  "packages/llm-analysis/src/index.ts"
];
const requiredLlmAnalysisFoundationExports = [
  "LLM_ANALYSIS_FOUNDATION_PHASE",
  "LLM_ANALYSIS_PACKAGE_NAME",
  "LlmAnalysisPackageBoundary"
];
const requiredStructuredAnalysisFoundationFiles = [
  "packages/analysis/package.json",
  "packages/analysis/README.md",
  "packages/analysis/tsconfig.json",
  "packages/analysis/vitest.config.ts",
  "packages/analysis/src/index.ts"
];
const requiredStructuredAnalysisFoundationExports = [
  "STRUCTURED_ANALYSIS_FOUNDATION_PHASE",
  "ANALYSIS_PACKAGE_NAME",
  "AnalysisPackageBoundary"
];
const requiredOpportunityEngineFoundationFiles = [
  "packages/opportunity-engine/package.json",
  "packages/opportunity-engine/README.md",
  "packages/opportunity-engine/tsconfig.json",
  "packages/opportunity-engine/vitest.config.ts",
  "packages/opportunity-engine/src/index.ts"
];
const requiredOpportunityEngineFoundationExports = [
  "OPPORTUNITY_ENGINE_FOUNDATION_PHASE",
  "OPPORTUNITY_ENGINE_PACKAGE_NAME",
  "OpportunityEnginePackageBoundary"
];
const requiredOpportunityPipelineFoundationFiles = [
  "packages/opportunity-pipeline/package.json",
  "packages/opportunity-pipeline/README.md",
  "packages/opportunity-pipeline/tsconfig.json",
  "packages/opportunity-pipeline/vitest.config.ts",
  "packages/opportunity-pipeline/src/index.ts"
];
const requiredOpportunityPipelineFoundationExports = [
  "OPPORTUNITY_PIPELINE_FOUNDATION_PHASE",
  "OPPORTUNITY_PIPELINE_PACKAGE_NAME",
  "OpportunityPipelinePackageBoundary"
];
const requiredOpportunityCandidatesFoundationFiles = [
  "packages/opportunity-candidates/package.json",
  "packages/opportunity-candidates/README.md",
  "packages/opportunity-candidates/tsconfig.json",
  "packages/opportunity-candidates/vitest.config.ts",
  "packages/opportunity-candidates/src/index.ts"
];
const requiredOpportunityCandidatesFoundationExports = [
  "OPPORTUNITY_CANDIDATES_FOUNDATION_PHASE",
  "OPPORTUNITY_CANDIDATES_PACKAGE_NAME",
  "OpportunityCandidatesPackageBoundary"
];
const requiredOpportunityGenerationFoundationFiles = [
  "packages/opportunity-generation/package.json",
  "packages/opportunity-generation/README.md",
  "packages/opportunity-generation/tsconfig.json",
  "packages/opportunity-generation/vitest.config.ts",
  "packages/opportunity-generation/src/index.ts"
];
const requiredOpportunityGenerationFoundationExports = [
  "OPPORTUNITY_GENERATION_FOUNDATION_PHASE",
  "OPPORTUNITY_GENERATION_PACKAGE_NAME",
  "OpportunityGenerationPackageBoundary"
];
const requiredOpportunityRankingFoundationFiles = [
  "packages/opportunity-ranking/package.json",
  "packages/opportunity-ranking/README.md",
  "packages/opportunity-ranking/tsconfig.json",
  "packages/opportunity-ranking/vitest.config.ts",
  "packages/opportunity-ranking/src/index.ts"
];
const requiredOpportunityRankingFoundationExports = [
  "OPPORTUNITY_RANKING_FOUNDATION_PHASE",
  "OPPORTUNITY_RANKING_PACKAGE_NAME",
  "OpportunityRankingPackageBoundary"
];
const requiredRestApiFoundationFiles = [
  "apps/api/package.json",
  "apps/api/README.md",
  "apps/api/tsconfig.json",
  "apps/api/src/index.ts",
  "apps/api/src/app.ts",
  "apps/api/src/bootstrap/index.ts",
  "apps/api/src/testing/api-fixtures.ts",
  "apps/api/src/testing/index.ts",
  "apps/api/src/__tests__/api-boundary.test.ts",
  "apps/api/src/__tests__/api-contract-stability.test.ts",
  "apps/api/src/__tests__/api-integration.test.ts",
  "apps/api/src/__tests__/api-security.test.ts"
];
const requiredRestApiFoundationExports = [
  "ApiApplication",
  "ApiBootstrapInput",
  "createApiApplication",
  "syntheticApiOpportunity",
  "syntheticApiRanking",
  "syntheticApiOpportunityPort",
  "syntheticApiRankingPort"
];
const requiredDashboardFoundationFiles = [
  "apps/web/package.json",
  "apps/web/README.md",
  "apps/web/tsconfig.json",
  "apps/web/next.config.ts",
  "apps/web/next-env.d.ts",
  "apps/web/src/app/layout.tsx",
  "apps/web/src/app/page.tsx",
  "apps/web/src/app/globals.css",
  "apps/web/playwright.config.ts",
  "apps/web/e2e/dashboard.spec.ts",
  "apps/web/src/__tests__/dashboard-security.test.ts",
  "apps/web/src/__tests__/dashboard-boundary.test.ts",
  "apps/web/src/__tests__/dashboard-route-stability.test.ts"
];
const requiredProductValidationFoundationFiles = [
  "apps/api/src/feedback/index.ts",
  "apps/api/src/feedback/feedback-reason-category.ts",
  "apps/api/src/feedback/feedback-rating.ts",
  "apps/api/src/feedback/feedback-status.ts"
];
const requiredPrivateBetaFoundationFiles = [
  ".github/workflows/deploy.yml",
  "config/private-beta.env.example",
  "apps/api/src/auth/invite-dto.ts",
  "apps/api/src/auth/invite-status.ts",
  "apps/api/src/auth/invite-store.ts",
  "apps/api/src/auth/invite-validation.ts",
  "apps/api/src/auth/session-status.ts",
  "apps/api/src/feedback/bug-report-dto.ts",
  "apps/api/src/feedback/bug-report-severity.ts",
  "apps/api/src/feedback/bug-report-status.ts",
  "apps/api/src/feedback/bug-report-validation.ts",
  "apps/api/src/feedback/in-memory-bug-report-store.ts",
  "apps/api/src/routes/auth/accept-invite-route.ts",
  "apps/api/src/routes/auth/create-invite-route.ts",
  "apps/api/src/routes/auth/get-session-route.ts",
  "apps/api/src/routes/auth/index.ts",
  "apps/api/src/routes/feedback/create-bug-report-route.ts",
  "apps/api/src/__tests__/private-beta-auth.test.ts",
  "apps/api/src/__tests__/private-beta-flow-security.test.ts",
  "apps/web/src/features/beta/beta-access-panel.tsx",
  "apps/web/src/features/beta/bug-report-panel.tsx",
  "apps/web/src/features/beta/index.ts",
  "apps/web/src/testing/fixtures/beta.ts",
  "packages/database/prisma/migrations/20260704000000_private_beta_invites_sessions/migration.sql",
  "packages/database/prisma/migrations/20260704010000_private_beta_feedback_bug_reports/migration.sql",
  "docs/04_IMPLEMENTATION/04-004_PRIVATE_BETA_DEPLOYMENT.md",
  "docs/04_IMPLEMENTATION/04-005_PRIVATE_BETA_OPERATIONS.md",
  "docs/04_IMPLEMENTATION/04-006_PRIVATE_BETA_RUNBOOK.md",
  "docs/04_IMPLEMENTATION/04-007_PRIVATE_BETA_CHECKLIST.md"
];
const sharedFoundationPackageRules = {
  "packages/config": {
    packageName: "@opportunity-os/config",
    allowedWorkspaceDependencies: []
  },
  "packages/types": {
    packageName: "@opportunity-os/types",
    allowedWorkspaceDependencies: []
  },
  "packages/errors": {
    packageName: "@opportunity-os/errors",
    allowedWorkspaceDependencies: ["@opportunity-os/types"]
  },
  "packages/utils": {
    packageName: "@opportunity-os/utils",
    allowedWorkspaceDependencies: []
  },
  "packages/shared": {
    packageName: "@opportunity-os/shared",
    allowedWorkspaceDependencies: [
      "@opportunity-os/config",
      "@opportunity-os/types",
      "@opportunity-os/errors",
      "@opportunity-os/utils"
    ]
  },
  "packages/events": {
    packageName: "@opportunity-os/events",
    allowedWorkspaceDependencies: []
  },
  "packages/database": {
    packageName: "@opportunity-os/database",
    allowedWorkspaceDependencies: [
      "@opportunity-os/config",
      "@opportunity-os/types",
      "@opportunity-os/errors",
      "@opportunity-os/utils",
      "@opportunity-os/shared",
      "@opportunity-os/events"
    ]
  },
  "packages/domain": {
    packageName: "@opportunity-os/domain",
    allowedWorkspaceDependencies: [
      "@opportunity-os/types",
      "@opportunity-os/errors",
      "@opportunity-os/events",
      "@opportunity-os/utils"
    ]
  },
  "packages/application": {
    packageName: "@opportunity-os/application",
    allowedWorkspaceDependencies: [
      "@opportunity-os/types",
      "@opportunity-os/errors",
      "@opportunity-os/events",
      "@opportunity-os/utils",
      "@opportunity-os/shared",
      "@opportunity-os/domain"
    ]
  },
  "packages/container": {
    packageName: "@opportunity-os/container",
    allowedWorkspaceDependencies: [
      "@opportunity-os/types",
      "@opportunity-os/errors",
      "@opportunity-os/utils",
      "@opportunity-os/shared",
      "@opportunity-os/config"
    ]
  },
  "packages/infrastructure": {
    packageName: "@opportunity-os/infrastructure",
    allowedWorkspaceDependencies: [
      "@opportunity-os/config",
      "@opportunity-os/shared",
      "@opportunity-os/events",
      "@opportunity-os/database",
      "@opportunity-os/domain",
      "@opportunity-os/errors",
      "@opportunity-os/application",
      "@opportunity-os/container"
    ]
  },
  "packages/connectors": {
    packageName: "@opportunity-os/connectors",
    allowedWorkspaceDependencies: [
      "@opportunity-os/config",
      "@opportunity-os/types",
      "@opportunity-os/errors",
      "@opportunity-os/utils",
      "@opportunity-os/shared",
      "@opportunity-os/events",
      "@opportunity-os/domain",
      "@opportunity-os/application",
      "@opportunity-os/container",
      "@opportunity-os/infrastructure"
    ]
  },
  "packages/connector-runtime": {
    packageName: "@opportunity-os/connector-runtime",
    allowedWorkspaceDependencies: [
      "@opportunity-os/connectors",
      "@opportunity-os/container",
      "@opportunity-os/application",
      "@opportunity-os/events",
      "@opportunity-os/shared",
      "@opportunity-os/infrastructure",
      "@opportunity-os/errors",
      "@opportunity-os/types",
      "@opportunity-os/utils"
    ]
  },
  "packages/connector-host": {
    packageName: "@opportunity-os/connector-host",
    allowedWorkspaceDependencies: [
      "@opportunity-os/config",
      "@opportunity-os/connectors",
      "@opportunity-os/connector-runtime",
      "@opportunity-os/container",
      "@opportunity-os/application",
      "@opportunity-os/errors",
      "@opportunity-os/events",
      "@opportunity-os/shared",
      "@opportunity-os/infrastructure"
    ]
  },
  "packages/connectors-reddit": {
    packageName: "@opportunity-os/connectors-reddit",
    allowedWorkspaceDependencies: [
      "@opportunity-os/connectors",
      "@opportunity-os/connector-host",
      "@opportunity-os/connector-runtime",
      "@opportunity-os/container",
      "@opportunity-os/events",
      "@opportunity-os/shared"
    ]
  },
  "packages/raw-content": {
    packageName: "@opportunity-os/raw-content",
    allowedWorkspaceDependencies: [
      "@opportunity-os/application",
      "@opportunity-os/connectors-reddit",
      "@opportunity-os/database",
      "@opportunity-os/domain",
      "@opportunity-os/events",
      "@opportunity-os/shared"
    ]
  },
  "packages/normalization": {
    packageName: "@opportunity-os/normalization",
    allowedWorkspaceDependencies: [
      "@opportunity-os/domain",
      "@opportunity-os/events",
      "@opportunity-os/raw-content",
      "@opportunity-os/shared"
    ]
  },
  "packages/embeddings": {
    packageName: "@opportunity-os/embeddings",
    allowedWorkspaceDependencies: [
      "@opportunity-os/events",
      "@opportunity-os/normalization",
      "@opportunity-os/raw-content",
      "@opportunity-os/shared"
    ]
  },
  "packages/llm-analysis": {
    packageName: "@opportunity-os/llm-analysis",
    allowedWorkspaceDependencies: [
      "@opportunity-os/embeddings",
      "@opportunity-os/events",
      "@opportunity-os/normalization",
      "@opportunity-os/raw-content",
      "@opportunity-os/shared"
    ]
  },
  "packages/analysis": {
    packageName: "@opportunity-os/analysis",
    allowedWorkspaceDependencies: [
      "@opportunity-os/embeddings",
      "@opportunity-os/events",
      "@opportunity-os/llm-analysis",
      "@opportunity-os/normalization",
      "@opportunity-os/raw-content"
    ]
  },
  "packages/opportunity-engine": {
    packageName: "@opportunity-os/opportunity-engine",
    allowedWorkspaceDependencies: [
      "@opportunity-os/analysis",
      "@opportunity-os/embeddings",
      "@opportunity-os/events",
      "@opportunity-os/llm-analysis",
      "@opportunity-os/normalization",
      "@opportunity-os/raw-content",
      "@opportunity-os/shared"
    ]
  },
  "packages/opportunity-pipeline": {
    packageName: "@opportunity-os/opportunity-pipeline",
    allowedWorkspaceDependencies: [
      "@opportunity-os/analysis",
      "@opportunity-os/embeddings",
      "@opportunity-os/events",
      "@opportunity-os/llm-analysis",
      "@opportunity-os/normalization",
      "@opportunity-os/opportunity-engine",
      "@opportunity-os/raw-content"
    ]
  },
  "packages/opportunity-candidates": {
    packageName: "@opportunity-os/opportunity-candidates",
    allowedWorkspaceDependencies: [
      "@opportunity-os/analysis",
      "@opportunity-os/embeddings",
      "@opportunity-os/llm-analysis",
      "@opportunity-os/opportunity-engine",
      "@opportunity-os/opportunity-pipeline"
    ]
  },
  "packages/opportunity-generation": {
    packageName: "@opportunity-os/opportunity-generation",
    allowedWorkspaceDependencies: [
      "@opportunity-os/analysis",
      "@opportunity-os/events",
      "@opportunity-os/opportunity-candidates",
      "@opportunity-os/opportunity-engine",
      "@opportunity-os/opportunity-pipeline",
      "@opportunity-os/shared"
    ]
  },
  "packages/opportunity-ranking": {
    packageName: "@opportunity-os/opportunity-ranking",
    allowedWorkspaceDependencies: [
      "@opportunity-os/analysis",
      "@opportunity-os/events",
      "@opportunity-os/opportunity-candidates",
      "@opportunity-os/opportunity-engine",
      "@opportunity-os/opportunity-generation",
      "@opportunity-os/opportunity-pipeline",
      "@opportunity-os/shared"
    ]
  }
};
const prohibitedSharedFoundationDependencyPatterns = [
  /(^|[/@-])apps?($|[/@-])/iu,
  /(^|[/@-])api($|[/@-])/iu,
  /(^|[/@-])ui($|[/@-])/iu,
  /(^|[/@-])frontend($|[/@-])/iu,
  /(^|[/@-])application($|[/@-])/iu,
  /(^|[/@-])acquisition($|[/@-])/iu,
  /(^|[/@-])connector(s)?($|[/@-])/iu,
  /(^|[/@-])ai($|[/@-])/iu,
  /(^|[/@-])workflow(s)?($|[/@-])/iu,
  /(^|[/@-])database($|[/@-])/iu,
  /(^|[/@-])domain($|[/@-])/iu,
  /(^|[/@-])business($|[/@-])/iu,
  /(^|[/@-])intelligence($|[/@-])/iu
];
const engineeringKitRequiredEnvironmentVariables = [
  "APP_NAME",
  "NODE_ENV",
  "PORT",
  "DATABASE_URL",
  "REDIS_URL",
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "OPENAI_MODEL",
  "ANTHROPIC_MODEL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "LOG_LEVEL",
  "OTEL_EXPORTER_ENDPOINT"
];
const allowedDatabasePackageDependencies = new Set([
  "@opportunity-os/config",
  "@opportunity-os/types",
  "@opportunity-os/errors",
  "@opportunity-os/utils",
  "@opportunity-os/shared",
  "@opportunity-os/events",
  "@prisma/client",
  "@types/node",
  "prisma",
  "vitest"
]);
const allowedDomainPackageDependencies = new Set([
  "@opportunity-os/types",
  "@opportunity-os/errors",
  "@opportunity-os/events",
  "@opportunity-os/utils",
  "@types/node",
  "vitest"
]);
const allowedApplicationPackageDependencies = new Set([
  "@opportunity-os/types",
  "@opportunity-os/errors",
  "@opportunity-os/events",
  "@opportunity-os/utils",
  "@opportunity-os/shared",
  "@opportunity-os/domain",
  "@types/node",
  "vitest"
]);
const allowedContainerPackageDependencies = new Set([
  "@opportunity-os/types",
  "@opportunity-os/errors",
  "@opportunity-os/utils",
  "@opportunity-os/shared",
  "@opportunity-os/config",
  "@types/node",
  "vitest"
]);
const allowedInfrastructurePackageDependencies = new Set([
  "@opportunity-os/config",
  "@opportunity-os/shared",
  "@opportunity-os/events",
  "@opportunity-os/database",
  "@opportunity-os/domain",
  "@opportunity-os/errors",
  "@opportunity-os/application",
  "@opportunity-os/container",
  "@types/node",
  "vitest"
]);
const allowedConnectorSdkPackageDependencies = new Set([
  "@opportunity-os/config",
  "@opportunity-os/types",
  "@opportunity-os/errors",
  "@opportunity-os/utils",
  "@opportunity-os/shared",
  "@opportunity-os/events",
  "@opportunity-os/domain",
  "@opportunity-os/application",
  "@opportunity-os/container",
  "@opportunity-os/infrastructure",
  "@types/node",
  "vitest"
]);
const allowedConnectorRuntimePackageDependencies = new Set([
  "@opportunity-os/connectors",
  "@opportunity-os/container",
  "@opportunity-os/application",
  "@opportunity-os/events",
  "@opportunity-os/shared",
  "@opportunity-os/infrastructure",
  "@opportunity-os/errors",
  "@opportunity-os/types",
  "@opportunity-os/utils",
  "@types/node",
  "vitest"
]);
const allowedConnectorHostPackageDependencies = new Set([
  "@opportunity-os/config",
  "@opportunity-os/connectors",
  "@opportunity-os/connector-runtime",
  "@opportunity-os/container",
  "@opportunity-os/application",
  "@opportunity-os/errors",
  "@opportunity-os/events",
  "@opportunity-os/shared",
  "@opportunity-os/infrastructure",
  "@types/node",
  "vitest"
]);
const allowedRedditConnectorPackageDependencies = new Set([
  "@opportunity-os/connectors",
  "@opportunity-os/connector-host",
  "@opportunity-os/connector-runtime",
  "@opportunity-os/container",
  "@opportunity-os/events",
  "@opportunity-os/shared",
  "@types/node",
  "vitest"
]);
const engineeringKitOptionalEnvironmentVariables = [
  "SENTRY_DSN",
  "LANGFUSE_API_KEY",
  "LANGSMITH_API_KEY",
  "OPPORTUNITY_OS_API_URL",
  "OPPORTUNITY_OS_WEB_URL",
  "NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL",
  "LLM_PROVIDER",
  "LLM_MODEL",
  "LLM_LIVE_ANALYSIS_ENABLED",
  "LLM_PROVIDER_TIMEOUT_MS"
];
const engineeringKitDevOnlyEnvironmentVariables = [
  "REDDIT_PRODUCTION_CLIENT_ID",
  "REDDIT_PRODUCTION_CLIENT_SECRET",
  "REDDIT_PRODUCTION_REFRESH_TOKEN",
  "REDDIT_PRODUCTION_USER_AGENT",
  "REDDIT_CLIENT_ID",
  "REDDIT_CLIENT_SECRET",
  "REDDIT_REFRESH_TOKEN",
  "REDDIT_USER_AGENT",
  "REDDIT_LIVE_TEST_ENABLED",
  "REDDIT_LIVE_SUBREDDIT",
  "REDDIT_LIVE_LIMIT"
];

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  let lastError;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const content = fs.readFileSync(fullPath, "utf8");
      if (content.length > 0 || fs.statSync(fullPath).size === 0 || attempt === 2) {
        return content;
      }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    } catch (error) {
      lastError = error;
      if (error.code !== "ETIMEDOUT" || attempt === 2) {
        throw error;
      }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    }
  }

  throw lastError;
}

function readTrimmed(relativePath) {
  return read(relativePath).trim();
}

const ignoredTraversalDirectories = new Set([
  ".git",
  ".next",
  ".pnpm-store",
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
  "playwright-report",
  "test-results",
  "youtube-ai-creator-watchlist"
]);

function listMarkdownFiles(dir) {
  const absoluteDir = path.join(root, dir);
  if (!fs.existsSync(absoluteDir)) return [];
  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    if (entry.isSymbolicLink()) {
      return [];
    }

    if (ignoredTraversalDirectories.has(entry.name)) {
      return [];
    }

    const relativePath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listMarkdownFiles(relativePath);
    return entry.isFile() && entry.name.endsWith(".md") ? [relativePath] : [];
  });
}

function listFiles(dir) {
  const absoluteDir = path.join(root, dir);
  if (!fs.existsSync(absoluteDir)) return [];
  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    if (entry.isSymbolicLink()) {
      return [];
    }

    if (ignoredTraversalDirectories.has(entry.name)) {
      return [];
    }

    const relativePath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(relativePath);
    return entry.isFile() ? [relativePath] : [];
  });
}

function fail(message) {
  errors.push(message);
}

function parseEnvExampleVariables(relativePath) {
  if (!exists(relativePath)) return [];

  return read(relativePath)
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((line) => line.match(/^([A-Z][A-Z0-9_]*)=/u)?.[1])
    .filter(Boolean);
}

function parseExportedConstArray(relativePath, exportName) {
  if (!exists(relativePath)) return [];

  const content = read(relativePath);
  const match = content.match(new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s+as\\s+const`, "u"));
  if (!match) return [];

  return [...match[1].matchAll(/"([A-Z][A-Z0-9_]*)"/gu)].map((entry) => entry[1]);
}

function assertSameVariableSet(label, expectedVariables, actualVariables) {
  const expected = new Set(expectedVariables);
  const actual = new Set(actualVariables);

  for (const variableName of expected) {
    if (!actual.has(variableName)) {
      fail(`${label} is missing required variable name: ${variableName}`);
    }
  }

  for (const variableName of actual) {
    if (!expected.has(variableName)) {
      fail(`${label} contains undocumented variable name: ${variableName}`);
    }
  }
}

function assertNoDuplicateVariables(label, variables) {
  const seen = new Set();
  for (const variableName of variables) {
    if (seen.has(variableName)) {
      fail(`${label} contains duplicate variable name: ${variableName}`);
    }
    seen.add(variableName);
  }
}

function assertSharedFoundationPackageDependencies(packageRoot, packageRule) {
  const packageJsonPath = `${packageRoot}/package.json`;
  if (!exists(packageJsonPath)) return;

  try {
    const packageJson = JSON.parse(read(packageJsonPath));
    if (packageJson.name !== packageRule.packageName) {
      fail(`${packageJsonPath} name must be "${packageRule.packageName}" but found "${packageJson.name ?? "missing"}"`);
    }

    const dependencyFields = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
    const allowedWorkspaceDependencies = new Set(packageRule.allowedWorkspaceDependencies);

    for (const dependencyField of dependencyFields) {
      const dependencies = packageJson[dependencyField] ?? {};
      for (const [dependencyName, dependencyVersion] of Object.entries(dependencies)) {
        const dependencyReference = `${dependencyName} ${dependencyVersion}`;
        const allowedWorkspaceDependency = dependencyName.startsWith("@opportunity-os/")
          && allowedWorkspaceDependencies.has(dependencyName);
        if (!allowedWorkspaceDependency && prohibitedSharedFoundationDependencyPatterns.some((pattern) => pattern.test(dependencyReference))) {
          fail(`${packageRoot} must not depend on apps, APIs, connectors, AI workflows, database, frontend, domain, intelligence, or business packages; found ${dependencyField}.${dependencyName}`);
        }

        if (dependencyName.startsWith("@opportunity-os/") && !allowedWorkspaceDependencies.has(dependencyName)) {
          fail(`${packageRoot} has prohibited reverse dependency ${dependencyField}.${dependencyName}; allowed workspace dependencies are ${JSON.stringify(packageRule.allowedWorkspaceDependencies)}`);
        }
      }
    }
  } catch (error) {
    fail(`${packageJsonPath} must be valid JSON: ${error.message}`);
  }
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function listPackageJsonFiles(dir = ".") {
  const absoluteDir = path.join(root, dir);
  if (!fs.existsSync(absoluteDir)) return [];

  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    if (entry.isSymbolicLink() || ignoredTraversalDirectories.has(entry.name)) {
      return [];
    }

    const relativePath = dir === "." ? entry.name : path.join(dir, entry.name);
    if (entry.isDirectory()) return listPackageJsonFiles(relativePath);
    return entry.isFile() && entry.name === "package.json" ? [relativePath] : [];
  });
}

function assertLoggingImplementationPolicy() {
  for (const file of requiredLoggingImplementationFiles) {
    if (!exists(file)) {
      fail(`Logging implementation is missing required file: ${file}`);
    }
  }

  const loggingIndexPath = "packages/shared/src/logging/index.ts";
  if (exists(loggingIndexPath)) {
    const loggingIndex = read(loggingIndexPath);
    for (const exportName of requiredLoggingExports) {
      if (!loggingIndex.includes(exportName)) {
        fail(`${loggingIndexPath} must export logging contract "${exportName}"`);
      }
    }
  }

  const sharedIndexPath = "packages/shared/src/index.ts";
  if (exists(sharedIndexPath)) {
    const sharedIndex = read(sharedIndexPath);
    for (const exportName of requiredLoggingExports) {
      if (!sharedIndex.includes(exportName)) {
        fail(`${sharedIndexPath} must re-export logging contract "${exportName}"`);
      }
    }
  }

  for (const packageJsonPath of listPackageJsonFiles()) {
    try {
      const packageJson = readJson(packageJsonPath);
      const dependencyFields = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
      for (const dependencyField of dependencyFields) {
        const dependencies = packageJson[dependencyField] ?? {};
        if ("pino" in dependencies && packageJsonPath !== "packages/shared/package.json") {
          fail(`Pino may only be declared by packages/shared; found ${dependencyField}.pino in ${packageJsonPath}`);
        }
      }
    } catch (error) {
      fail(`${packageJsonPath} must be valid JSON: ${error.message}`);
    }
  }
}

function assertEventFoundationPolicy() {
  for (const file of requiredEventFoundationFiles) {
    if (!exists(file)) {
      fail(`Event foundation is missing required file: ${file}`);
    }
  }

  const eventsIndexPath = "packages/events/src/index.ts";
  if (exists(eventsIndexPath)) {
    const eventsIndex = read(eventsIndexPath);
    for (const exportName of requiredEventFoundationExports) {
      if (!eventsIndex.includes(exportName)) {
        fail(`${eventsIndexPath} must export event foundation contract "${exportName}"`);
      }
    }
  }
}

function assertDatabaseFoundationPolicy() {
  for (const file of requiredDatabaseFoundationFiles) {
    if (!exists(file)) {
      fail(`Database foundation is missing required file: ${file}`);
    }
  }

  const schemaPath = "packages/database/prisma/schema.prisma";
  if (exists(schemaPath)) {
    const schema = read(schemaPath);
    if (!schema.includes('provider = "postgresql"')) {
      fail(`${schemaPath} must declare a PostgreSQL datasource provider`);
    }
    if (!schema.includes('provider = "prisma-client-js"')) {
      fail(`${schemaPath} must declare the Prisma client generator`);
    }

    const prohibitedModelNames = [
      "RawContent",
      "Connector",
      "EventStore",
      "AiWorkflow",
      "Api",
      "Frontend",
      "Business"
    ];
    for (const modelName of prohibitedModelNames) {
      if (new RegExp(`\\bmodel\\s+${modelName}\\b`, "u").test(schema)) {
        fail(`${schemaPath} must not define prohibited Slice A model: ${modelName}`);
      }
    }
  }

  const baselineMigrationPath = "packages/database/prisma/migrations/00000000000000_foundation_baseline/migration.sql";
  if (exists(baselineMigrationPath)) {
    const baselineMigration = read(baselineMigrationPath);
    if (/\bCREATE\s+TABLE\b/iu.test(baselineMigration)) {
      fail(`${baselineMigrationPath} must not create tables in Slice B`);
    }
  }

  const databaseIndexPath = "packages/database/src/index.ts";
  if (exists(databaseIndexPath)) {
    const databaseIndex = read(databaseIndexPath);
    for (const exportName of requiredDatabaseFoundationExports) {
      if (!databaseIndex.includes(exportName)) {
        fail(`${databaseIndexPath} must export database foundation contract "${exportName}"`);
      }
    }
  }

  const databaseClientPath = "packages/database/src/client.ts";
  if (exists(databaseClientPath)) {
    const databaseClient = read(databaseClientPath);
    if (databaseClient.includes("new PrismaClient")) {
      fail(`${databaseClientPath} must not create a process-level PrismaClient singleton`);
    }
    if (databaseClient.includes("process.env")) {
      fail(`${databaseClientPath} must not read process.env; pass explicit typed configuration instead`);
    }
    if (databaseClient.includes("$connect()")) {
      fail(`${databaseClientPath} must not automatically connect during client creation`);
    }
  }

  const databaseConfigPath = "packages/database/src/database-config.ts";
  if (exists(databaseConfigPath)) {
    const databaseConfig = read(databaseConfigPath);
    if (databaseConfig.includes("process.env")) {
      fail(`${databaseConfigPath} must not read process.env; consume explicit typed configuration input`);
    }
    if (!databaseConfig.includes("databaseUrl")) {
      fail(`${databaseConfigPath} must define databaseUrl as the explicit DATABASE_URL configuration field`);
    }
  }

  const databasePackageJsonPath = "packages/database/package.json";
  if (exists(databasePackageJsonPath)) {
    try {
      const databasePackageJson = readJson(databasePackageJsonPath);
      if (databasePackageJson.scripts?.["verify:local"] !== "prisma --config=./prisma.config.ts migrate status") {
        fail(`${databasePackageJsonPath} must define verify:local as optional Prisma migration status verification`);
      }
      if (databasePackageJson.scripts?.test?.includes("verify:local")) {
        fail(`${databasePackageJsonPath} test script must not require local database verification`);
      }
      for (const dependencyField of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
        const dependencies = databasePackageJson[dependencyField] ?? {};
        for (const dependencyName of Object.keys(dependencies)) {
          if (!allowedDatabasePackageDependencies.has(dependencyName)) {
            fail(`${databasePackageJsonPath} may depend only on approved shared infrastructure packages, Prisma dependencies, and deterministic test/build tooling; found ${dependencyField}.${dependencyName}`);
          }
        }
      }
    } catch (error) {
      fail(`${databasePackageJsonPath} must be valid JSON: ${error.message}`);
    }
  }

  const prismaConfigPath = "packages/database/prisma.config.ts";
  if (exists(prismaConfigPath)) {
    const prismaConfig = read(prismaConfigPath);
    if (!prismaConfig.includes("DATABASE_URL")) {
      fail(`${prismaConfigPath} must read DATABASE_URL for Prisma datasource configuration`);
    }
    if (!prismaConfig.includes('schema: "prisma/schema.prisma"')) {
      fail(`${prismaConfigPath} must point to prisma/schema.prisma`);
    }
  }

  for (const packageJsonPath of listPackageJsonFiles()) {
    try {
      const packageJson = readJson(packageJsonPath);
      const dependencyFields = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
      for (const dependencyField of dependencyFields) {
        const dependencies = packageJson[dependencyField] ?? {};
        for (const dependencyName of Object.keys(dependencies)) {
          if ((dependencyName === "prisma" || dependencyName === "@prisma/client") && packageJsonPath !== "packages/database/package.json") {
            fail(`Prisma dependencies may only be declared by packages/database; found ${dependencyField}.${dependencyName} in ${packageJsonPath}`);
          }
          if (["sequelize", "typeorm", "mongoose"].includes(dependencyName)) {
            fail(`Non-approved database library ${dependencyField}.${dependencyName} found in ${packageJsonPath}`);
          }
        }
      }
    } catch (error) {
      fail(`${packageJsonPath} must be valid JSON: ${error.message}`);
    }
  }
}

function assertDomainFoundationPolicy() {
  for (const file of requiredDomainFoundationFiles) {
    if (!exists(file)) {
      fail(`Domain foundation is missing required file: ${file}`);
    }
  }

  const domainIndexPath = "packages/domain/src/index.ts";
  if (exists(domainIndexPath)) {
    const domainIndex = read(domainIndexPath);
    if (!domainIndex.includes("Domain Foundation")) {
      fail(`${domainIndexPath} must document the Phase 1 Milestone 6 Domain Foundation public export boundary`);
    }
    for (const exportName of requiredDomainFoundationExports) {
      if (!domainIndex.includes(exportName)) {
        fail(`${domainIndexPath} must export domain foundation contract "${exportName}"`);
      }
    }
  }

  const domainPackageJsonPath = "packages/domain/package.json";
  if (exists(domainPackageJsonPath)) {
    try {
      const domainPackageJson = readJson(domainPackageJsonPath);
      for (const dependencyField of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
        const dependencies = domainPackageJson[dependencyField] ?? {};
        for (const dependencyName of Object.keys(dependencies)) {
          if (!allowedDomainPackageDependencies.has(dependencyName)) {
            fail(`${domainPackageJsonPath} may depend only on approved shared infrastructure packages and deterministic test/build tooling; found ${dependencyField}.${dependencyName}`);
          }
        }
      }
    } catch (error) {
      fail(`${domainPackageJsonPath} must be valid JSON: ${error.message}`);
    }
  }

  for (const file of listFiles("packages/domain")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/domain/dist/") ||
      file.startsWith("packages/domain/node_modules/") ||
      file.startsWith("packages/domain/.turbo/") ||
      file.includes("/__tests__/")
    ) {
      continue;
    }
    const content = read(file);
    const prohibitedTerms = [
      ["connector execution", /\bexecuteConnector\b|\bConnectorRunner\b|\bconnector execution\b/iu],
      ["Raw Content workflow", /\bRawContent\b|\braw content workflow\b/iu],
      ["AI workflow", /\bAIWorkflow\b|\bai workflow\b|\bworkflow runner\b/iu],
      ["API implementation", /\broute handler\b|\bapi route\b|\bcontroller\b/iu],
      ["frontend implementation", /\bReact\b|\btsx\b/iu],
      ["application service", /\bApplicationService\b|\bapplication service\b/iu],
      ["business scoring logic", /\bscoreOpportunity\b|\bscoring engine\b|\bbusiness scoring\b/iu],
      ["database repository implementation", /\bPrismaClient\b|\bsql\b|\bdatabase repository implementation\b/iu],
      ["production event store transport", /\bKafka\b|\bNATS\b|\bRedis stream\b|\bevent store transport\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Domain foundation must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertApplicationFoundationPolicy() {
  for (const file of requiredApplicationFoundationFiles) {
    if (!exists(file)) {
      fail(`Application foundation is missing required file: ${file}`);
    }
  }

  const applicationIndexPath = "packages/application/src/index.ts";
  if (exists(applicationIndexPath)) {
    const applicationIndex = read(applicationIndexPath);
    if (!applicationIndex.includes("Application Foundation")) {
      fail(`${applicationIndexPath} must document the Phase 1 Milestone 7 Application Foundation public export boundary`);
    }
    for (const exportName of requiredApplicationFoundationExports) {
      if (!applicationIndex.includes(exportName)) {
        fail(`${applicationIndexPath} must export application foundation contract "${exportName}"`);
      }
    }
  }

  const applicationPackageJsonPath = "packages/application/package.json";
  if (exists(applicationPackageJsonPath)) {
    try {
      const applicationPackageJson = readJson(applicationPackageJsonPath);
      for (const dependencyField of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
        const dependencies = applicationPackageJson[dependencyField] ?? {};
        for (const dependencyName of Object.keys(dependencies)) {
          if (!allowedApplicationPackageDependencies.has(dependencyName)) {
            fail(`${applicationPackageJsonPath} may depend only on approved foundation packages and deterministic test/build tooling; found ${dependencyField}.${dependencyName}`);
          }
        }
      }
    } catch (error) {
      fail(`${applicationPackageJsonPath} must be valid JSON: ${error.message}`);
    }
  }

  for (const file of listFiles("packages/application")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/application/dist/") ||
      file.startsWith("packages/application/node_modules/") ||
      file.startsWith("packages/application/.turbo/") ||
      file.includes("/__tests__/")
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["REST API route", /\bREST API route\b|\bapi route\b|\broute handler\b/iu],
      ["controller", /\bcontroller\b/iu],
      ["authentication implementation", /\bauthentication implementation\b|\bauthorization implementation\b|\bauth middleware\b/iu],
      ["connector execution", /\bexecuteConnector\b|\bConnectorRunner\b|\bconnector execution\b/iu],
      ["AI workflow", /\bAIWorkflow\b|\bai workflow\b|\bworkflow runner\b/iu],
      ["database repository implementation", /\bPrismaClient\b|\bsql\b|\bdatabase repository implementation\b/iu],
      ["frontend implementation", /\bReact\b|\btsx\b/iu],
      ["business scoring logic", /\bscoreOpportunity\b|\bscoring engine\b|\bbusiness scoring\b/iu],
      ["actual product use case", /\bOpportunityExplorer\b|\bClusterExplorer\b|\bTrendExplorer\b|\bConnectorManagement\b|\bactual product use case\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Application foundation must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertContainerFoundationPolicy() {
  for (const file of requiredContainerFoundationFiles) {
    if (!exists(file)) {
      fail(`Container foundation is missing required file: ${file}`);
    }
  }

  const containerIndexPath = "packages/container/src/index.ts";
  if (exists(containerIndexPath)) {
    const containerIndex = read(containerIndexPath);
    if (!containerIndex.includes("Container Foundation")) {
      fail(`${containerIndexPath} must document the Phase 1 Milestone 8 Container Foundation public export boundary`);
    }
    for (const exportName of requiredContainerFoundationExports) {
      if (!containerIndex.includes(exportName)) {
        fail(`${containerIndexPath} must export container foundation contract "${exportName}"`);
      }
    }
  }

  const containerPackageJsonPath = "packages/container/package.json";
  if (exists(containerPackageJsonPath)) {
    try {
      const containerPackageJson = readJson(containerPackageJsonPath);
      for (const dependencyField of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
        const dependencies = containerPackageJson[dependencyField] ?? {};
        for (const dependencyName of Object.keys(dependencies)) {
          if (!allowedContainerPackageDependencies.has(dependencyName)) {
            fail(`${containerPackageJsonPath} may depend only on approved foundation packages and deterministic test/build tooling; found ${dependencyField}.${dependencyName}`);
          }
        }
      }
    } catch (error) {
      fail(`${containerPackageJsonPath} must be valid JSON: ${error.message}`);
    }
  }

  for (const file of listFiles("packages/container")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/container/dist/") ||
      file.startsWith("packages/container/node_modules/") ||
      file.startsWith("packages/container/.turbo/") ||
      file.includes("/__tests__/")
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["REST API", /\bREST API\b|\bapi route\b|\broute handler\b/iu],
      ["controller", /\bcontroller\b/iu],
      ["authentication implementation", /\bauthentication implementation\b|\bauthorization implementation\b|\bauth middleware\b/iu],
      ["connector execution", /\bexecuteConnector\b|\bConnectorRunner\b|\bconnector execution\b/iu],
      ["AI workflow", /\bAIWorkflow\b|\bai workflow\b|\bworkflow runner\b/iu],
      ["database repository implementation", /\bPrismaClient\b|\bsql\b|\bdatabase repository implementation\b/iu],
      ["frontend implementation", /\bReact\b|\btsx\b|\bcomponent\b/iu],
      ["application service", /\bApplicationService\b|\bapplication service\b/iu],
      ["product workflow", /\bOpportunityExplorer\b|\bClusterExplorer\b|\bTrendExplorer\b|\bConnectorManagement\b|\bproduct workflow\b/iu],
      ["business logic", /\bscoreOpportunity\b|\bscoring engine\b|\bbusiness logic\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Container foundation must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertInfrastructureFoundationPolicy() {
  for (const file of requiredInfrastructureFoundationFiles) {
    if (!exists(file)) {
      fail(`Infrastructure composition foundation is missing required file: ${file}`);
    }
  }

  const infrastructureIndexPath = "packages/infrastructure/src/index.ts";
  if (exists(infrastructureIndexPath)) {
    const infrastructureIndex = read(infrastructureIndexPath);
    if (!infrastructureIndex.includes("Infrastructure Composition Foundation")) {
      fail(`${infrastructureIndexPath} must document the Phase 1 Milestone 9 Infrastructure Composition Foundation public export boundary`);
    }

    for (const exportName of requiredInfrastructureFoundationExports) {
      if (!infrastructureIndex.includes(exportName)) {
        fail(`${infrastructureIndexPath} must export ${exportName} from the infrastructure composition foundation public boundary`);
      }
    }
  }

  const infrastructurePackageJsonPath = "packages/infrastructure/package.json";
  if (exists(infrastructurePackageJsonPath)) {
    try {
      const infrastructurePackageJson = readJson(infrastructurePackageJsonPath);
      for (const dependencyField of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
        const dependencies = infrastructurePackageJson[dependencyField] ?? {};
        for (const dependencyName of Object.keys(dependencies)) {
          if (!allowedInfrastructurePackageDependencies.has(dependencyName)) {
            fail(`${infrastructurePackageJsonPath} may depend only on approved foundation packages and deterministic test/build tooling; found ${dependencyField}.${dependencyName}`);
          }
        }
      }
    } catch (error) {
      fail(`${infrastructurePackageJsonPath} must be valid JSON: ${error.message}`);
    }
  }

  for (const file of listFiles("packages/infrastructure")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/infrastructure/dist/") ||
      file.startsWith("packages/infrastructure/node_modules/") ||
      file.startsWith("packages/infrastructure/.turbo/") ||
      file.includes("/__tests__/")
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["REST API", /\bREST API\b|\bapi route\b|\broute handler\b/iu],
      ["controller", /\bcontroller\b/iu],
      ["authentication implementation", /\bauthentication implementation\b|\bauthorization implementation\b|\bauth middleware\b/iu],
      ["connector execution", /\bexecuteConnector\b|\bConnectorRunner\b|\bconnector execution\b/iu],
      ["AI workflow", /\bAIWorkflow\b|\bai workflow\b|\bworkflow runner\b/iu],
      ["database repository implementation", /\bPrismaClient\b|\bsql\b|\bdatabase repository implementation\b/iu],
      ["frontend implementation", /\bReact\b|\btsx\b|\bcomponent\b/iu],
      ["product workflow", /\bOpportunityExplorer\b|\bClusterExplorer\b|\bTrendExplorer\b|\bConnectorManagement\b|\bproduct workflow\b/iu],
      ["business logic", /\bscoreOpportunity\b|\bscoring engine\b|\bbusiness logic\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Infrastructure composition foundation must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertConnectorSdkFoundationPolicy() {
  for (const file of requiredConnectorSdkFoundationFiles) {
    if (!exists(file)) {
      fail(`Connector SDK foundation is missing required file: ${file}`);
    }
  }

  const connectorsIndexPath = "packages/connectors/src/index.ts";
  if (exists(connectorsIndexPath)) {
    const connectorsIndex = read(connectorsIndexPath);
    if (!connectorsIndex.includes("Connector SDK Foundation")) {
      fail(`${connectorsIndexPath} must document the Phase 2 Milestone 10 Connector SDK Foundation public export boundary`);
    }

    for (const exportName of requiredConnectorSdkFoundationExports) {
      if (!connectorsIndex.includes(exportName)) {
        fail(`${connectorsIndexPath} must export ${exportName} from the connector SDK foundation public boundary`);
      }
    }
  }

  const connectorsPackageJsonPath = "packages/connectors/package.json";
  if (exists(connectorsPackageJsonPath)) {
    try {
      const connectorsPackageJson = readJson(connectorsPackageJsonPath);
      for (const dependencyField of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
        const dependencies = connectorsPackageJson[dependencyField] ?? {};
        for (const dependencyName of Object.keys(dependencies)) {
          if (!allowedConnectorSdkPackageDependencies.has(dependencyName)) {
            fail(`${connectorsPackageJsonPath} may depend only on approved foundation packages and deterministic test/build tooling; found ${dependencyField}.${dependencyName}`);
          }
        }
      }
    } catch (error) {
      fail(`${connectorsPackageJsonPath} must be valid JSON: ${error.message}`);
    }
  }

  for (const file of listFiles("packages/connectors")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/connectors/dist/") ||
      file.startsWith("packages/connectors/node_modules/") ||
      file.startsWith("packages/connectors/.turbo/") ||
      file.includes("/__tests__/")
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["Reddit connector", /\breddit\b|\bRedditConnector\b/iu],
      ["YouTube connector", /\byoutube\b|\bYouTubeConnector\b/iu],
      ["OAuth implementation", /\boauth\b|\bOAuth\b/iu],
      ["HTTP client", /\bfetch\s*\(|\baxios\b|\bgot\b|\bundici\b|\bhttp client\b/iu],
      ["REST API", /\bREST API\b|\bapi route\b|\broute handler\b/iu],
      ["controller", /\bcontroller\b/iu],
      ["authentication implementation", /\bauthentication implementation\b|\bauthorization implementation\b|\bauth middleware\b/iu],
      ["AI workflow", /\bAIWorkflow\b|\bai workflow\b|\bworkflow runner\b/iu],
      ["frontend implementation", /\bReact\b|\btsx\b|\bcomponent\b/iu],
      ["business logic", /\bscoreOpportunity\b|\bscoring engine\b|\bbusiness logic\b/iu],
      ["concrete connector implementation", /\bConcreteConnector\b|\bProviderConnector\b|\bconnector implementation\b/iu],
      ["connector execution", /\bexecuteConnector\b|\bConnectorRunner\b|\bconnector execution\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Connector SDK foundation must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertConnectorRuntimeFoundationPolicy() {
  for (const file of requiredConnectorRuntimeFoundationFiles) {
    if (!exists(file)) {
      fail(`Connector Runtime foundation is missing required file: ${file}`);
    }
  }

  const connectorRuntimeIndexPath = "packages/connector-runtime/src/index.ts";
  if (exists(connectorRuntimeIndexPath)) {
    const connectorRuntimeIndex = read(connectorRuntimeIndexPath);
    if (!connectorRuntimeIndex.includes("Connector Runtime Foundation")) {
      fail(`${connectorRuntimeIndexPath} must document the Phase 2 Milestone 11 Connector Runtime Foundation public export boundary`);
    }

    for (const exportName of requiredConnectorRuntimeFoundationExports) {
      if (!connectorRuntimeIndex.includes(exportName)) {
        fail(`${connectorRuntimeIndexPath} must export ${exportName} from the connector runtime foundation public boundary`);
      }
    }
  }

  const connectorRuntimePackageJsonPath = "packages/connector-runtime/package.json";
  if (exists(connectorRuntimePackageJsonPath)) {
    try {
      const connectorRuntimePackageJson = readJson(connectorRuntimePackageJsonPath);
      for (const dependencyField of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
        const dependencies = connectorRuntimePackageJson[dependencyField] ?? {};
        for (const dependencyName of Object.keys(dependencies)) {
          if (!allowedConnectorRuntimePackageDependencies.has(dependencyName)) {
            fail(`${connectorRuntimePackageJsonPath} may depend only on approved foundation packages and deterministic test/build tooling; found ${dependencyField}.${dependencyName}`);
          }
        }
      }
    } catch (error) {
      fail(`${connectorRuntimePackageJsonPath} must be valid JSON: ${error.message}`);
    }
  }

  for (const file of listFiles("packages/connector-runtime")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/connector-runtime/dist/") ||
      file.startsWith("packages/connector-runtime/node_modules/") ||
      file.startsWith("packages/connector-runtime/.turbo/") ||
      file.includes("/__tests__/")
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["Reddit connector", /\breddit\b|\bRedditConnector\b/iu],
      ["YouTube connector", /\byoutube\b|\bYouTubeConnector\b/iu],
      ["OAuth implementation", /\boauth\b|\bOAuth\b/iu],
      ["HTTP client", /\bfetch\s*\(|\baxios\b|\bgot\b|\bundici\b|\bhttp client\b/iu],
      ["scheduler", /\bscheduler\b|\bscheduleConnector\b/iu],
      ["queue", /\bqueue\b|\bQueueWorker\b/iu],
      ["worker process", /\bworker process\b|\bWorkerProcess\b/iu],
      ["REST API", /\bREST API\b|\bapi route\b|\broute handler\b/iu],
      ["controller", /\bcontroller\b/iu],
      ["authentication implementation", /\bauthentication implementation\b|\bauthorization implementation\b|\bauth middleware\b/iu],
      ["AI workflow", /\bAIWorkflow\b|\bai workflow\b|\bworkflow runner\b/iu],
      ["frontend implementation", /\bReact\b|\btsx\b|\bcomponent\b/iu],
      ["business logic", /\bscoreOpportunity\b|\bscoring engine\b|\bbusiness logic\b/iu],
      ["provider integration", /\bprovider integration\b|\bprovider adapter\b|\bprovider client\b|\bprovider call\b/iu],
      ["actual connector execution", /\bexecuteConnector\b|\bConnectorRunner\b|\bconnector execution\b|\bactual connector execution\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Connector Runtime foundation must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertConnectorHostFoundationPolicy() {
  for (const file of requiredConnectorHostFoundationFiles) {
    if (!exists(file)) {
      fail(`Connector Host foundation is missing required file: ${file}`);
    }
  }

  const connectorHostIndexPath = "packages/connector-host/src/index.ts";
  if (exists(connectorHostIndexPath)) {
    const connectorHostIndex = read(connectorHostIndexPath);
    if (!connectorHostIndex.includes("Connector Host Foundation")) {
      fail(`${connectorHostIndexPath} must document the Phase 2 Milestone 12 Connector Host Foundation public export boundary`);
    }

    for (const exportName of requiredConnectorHostFoundationExports) {
      if (!connectorHostIndex.includes(exportName)) {
        fail(`${connectorHostIndexPath} must export ${exportName} from the connector host foundation public boundary`);
      }
    }
  }

  const connectorHostPackageJsonPath = "packages/connector-host/package.json";
  if (exists(connectorHostPackageJsonPath)) {
    try {
      const connectorHostPackageJson = readJson(connectorHostPackageJsonPath);
      for (const dependencyField of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
        const dependencies = connectorHostPackageJson[dependencyField] ?? {};
        for (const dependencyName of Object.keys(dependencies)) {
          if (!allowedConnectorHostPackageDependencies.has(dependencyName)) {
            fail(`${connectorHostPackageJsonPath} may depend only on approved foundation packages and deterministic test/build tooling; found ${dependencyField}.${dependencyName}`);
          }
        }
      }
    } catch (error) {
      fail(`${connectorHostPackageJsonPath} must be valid JSON: ${error.message}`);
    }
  }

  for (const file of listFiles("packages/connector-host")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/connector-host/dist/") ||
      file.startsWith("packages/connector-host/node_modules/") ||
      file.startsWith("packages/connector-host/.turbo/") ||
      file.includes("/__tests__/")
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["Reddit connector", /\breddit\b|\bRedditConnector\b/iu],
      ["YouTube connector", /\byoutube\b|\bYouTubeConnector\b/iu],
      ["OAuth implementation", /\boauth\s+(client|flow|exchange|implementation|provider|callback|redirect|grant)\b|\bOAuth\s+(client|flow|exchange|implementation|provider|callback|redirect|grant)\b/iu],
      ["HTTP client", /\bfetch\s*\(|\baxios\b|\bgot\b|\bundici\b|\bhttp client\b/iu],
      ["scheduler", /\bscheduler\b|\bscheduleConnector\b/iu],
      ["queue", /\bqueue\b|\bQueueWorker\b/iu],
      ["worker process", /\bworker\b|\bworker process\b|\bWorkerProcess\b/iu],
      ["API implementation", /\bREST API\b|\bapi route\b|\broute handler\b|\bAPI handler\b/iu],
      ["authentication implementation", /\bauthentication implementation\b|\bauthorization implementation\b|\bauth middleware\b/iu],
      ["AI workflow", /\bAIWorkflow\b|\bai workflow\b|\bworkflow runner\b/iu],
      ["frontend implementation", /\bReact\b|\btsx\b|\bcomponent\b/iu],
      ["business logic", /\bscoreOpportunity\b|\bscoring engine\b|\bbusiness logic\b/iu],
      ["actual connector execution", /\bexecuteConnector\b|\bConnectorRunner\b|\bconnector execution\b|\bactual connector execution\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Connector Host foundation must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertRedditConnectorFoundationPolicy() {
  for (const file of requiredRedditConnectorFoundationFiles) {
    if (!exists(file)) {
      fail(`Reddit Connector foundation is missing required file: ${file}`);
    }
  }

  const redditConnectorIndexPath = "packages/connectors-reddit/src/index.ts";
  if (exists(redditConnectorIndexPath)) {
    const redditConnectorIndex = read(redditConnectorIndexPath);
    if (!redditConnectorIndex.includes("Reddit Connector Foundation")) {
      fail(`${redditConnectorIndexPath} must document the Phase 2 Milestone 13 Reddit Connector Foundation public export boundary`);
    }

    for (const exportName of requiredRedditConnectorFoundationExports) {
      if (!redditConnectorIndex.includes(exportName)) {
        fail(`${redditConnectorIndexPath} must export ${exportName} from the Reddit connector foundation public boundary`);
      }
    }
  }

  const redditConnectorPackageJsonPath = "packages/connectors-reddit/package.json";
  if (exists(redditConnectorPackageJsonPath)) {
    try {
      const redditConnectorPackageJson = readJson(redditConnectorPackageJsonPath);
      for (const dependencyField of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
        const dependencies = redditConnectorPackageJson[dependencyField] ?? {};
        for (const dependencyName of Object.keys(dependencies)) {
          if (!allowedRedditConnectorPackageDependencies.has(dependencyName)) {
            fail(`${redditConnectorPackageJsonPath} may depend only on approved foundation packages and deterministic test/build tooling; found ${dependencyField}.${dependencyName}`);
          }
        }
      }
    } catch (error) {
      fail(`${redditConnectorPackageJsonPath} must be valid JSON: ${error.message}`);
    }
  }

  const hasApprovedRedditLiveProviderTransport = requiredRedditLiveProviderTransportFiles.every((file) => exists(file));

  for (const file of listFiles("packages/connectors-reddit")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/connectors-reddit/dist/") ||
      file.startsWith("packages/connectors-reddit/node_modules/") ||
      file.startsWith("packages/connectors-reddit/.turbo/") ||
      file.includes("/__tests__/") ||
      (hasApprovedRedditLiveProviderTransport && approvedRedditLiveProviderTransportSourceFiles.includes(file))
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["OAuth implementation", /\boauth\b|\bOAuth\b/iu],
      ["live API call", /\blive Reddit API\b|\breddit API call\b|\bapi\.reddit\.com\b|\boauth\.reddit\.com\b/iu],
      ["HTTP client", /\bfetch\s*\(|\baxios\b|\bgot\b|\bundici\b|\bhttp client\b/iu],
      ["scraping", /\bscrap(e|ing|er)\b|\bcheerio\b|\bplaywright\b|\bpuppeteer\b/iu],
      ["scheduler", /\bscheduler\b|\bscheduleConnector\b/iu],
      ["queue", /\bqueue\b|\bQueueWorker\b/iu],
      ["worker process", /\bworker\b|\bWorkerProcess\b/iu],
      ["database persistence", /\bPrismaClient\b|\bsql\b|\bdatabase persistence\b|\brepository implementation\b/iu],
      ["AI workflow", /\bAIWorkflow\b|\bai workflow\b|\bworkflow runner\b/iu],
      ["API implementation", /\bREST API\b|\bapi route\b|\broute handler\b|\bAPI handler\b/iu],
      ["frontend implementation", /\bReact\b|\btsx\b|\bcomponent\b/iu],
      ["business logic", /\bscoreOpportunity\b|\bscoring engine\b|\bbusiness logic\b/iu],
      ["actual connector execution", /\bexecuteConnector\b|\bConnectorRunner\b|\bconnector execution\b|\bactual connector execution\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Reddit Connector foundation must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertRedditRuntimeFoundationPolicy() {
  assertRedditConnectorFoundationPolicy();

  const redditReadmePath = "packages/connectors-reddit/README.md";
  if (exists(redditReadmePath)) {
    const redditReadme = read(redditReadmePath);
    const requiredBoundaryStatements = [
      "Phase 2 Milestone 14",
      "non-network Reddit runtime adapter",
      "No runtime execution exists in Slice A"
    ];

    for (const statement of requiredBoundaryStatements) {
      if (!redditReadme.includes(statement)) {
        fail(`${redditReadmePath} must document the Phase 2 Milestone 14 Reddit Runtime Foundation boundary: missing "${statement}"`);
      }
    }
  }
}

function assertRedditProviderTransportPolicy() {
  assertRedditRuntimeFoundationPolicy();

  for (const file of requiredRedditProviderTransportFiles) {
    if (!exists(file)) {
      fail(`Reddit Provider Transport boundary is missing required file: ${file}`);
    }
  }

  const providerIndexPath = "packages/connectors-reddit/src/provider/index.ts";
  if (exists(providerIndexPath)) {
    const providerIndex = read(providerIndexPath);
    for (const exportName of requiredRedditProviderTransportExports) {
      if (!providerIndex.includes(exportName)) {
        fail(`${providerIndexPath} must export ${exportName} from the provider transport boundary`);
      }
    }
  }

  const redditConnectorIndexPath = "packages/connectors-reddit/src/index.ts";
  if (exists(redditConnectorIndexPath)) {
    const redditConnectorIndex = read(redditConnectorIndexPath);
    for (const exportName of requiredRedditProviderTransportExports) {
      if (!redditConnectorIndex.includes(exportName)) {
        fail(`${redditConnectorIndexPath} must export ${exportName} from the Reddit connector package root`);
      }
    }
  }

  const redditReadmePath = "packages/connectors-reddit/README.md";
  if (exists(redditReadmePath)) {
    const redditReadme = read(redditReadmePath);
    const requiredBoundaryStatements = [
      "Phase 2 Milestone 15",
      "provider transport architecture only",
      "packages/connectors-reddit/src/provider/index.ts"
    ];

    for (const statement of requiredBoundaryStatements) {
      if (!redditReadme.includes(statement)) {
        fail(`${redditReadmePath} must document the Phase 2 Milestone 15 Reddit Provider Transport boundary: missing "${statement}"`);
      }
    }
  }
}

function assertRawContentFoundationPolicy() {
  assertRedditProviderTransportPolicy();

  for (const file of requiredRawContentFoundationFiles) {
    if (!exists(file)) {
      fail(`Raw Content Pipeline foundation is missing required file: ${file}`);
    }
  }

  const rawContentIndexPath = "packages/raw-content/src/index.ts";
  if (exists(rawContentIndexPath)) {
    const rawContentIndex = read(rawContentIndexPath);
    if (!rawContentIndex.includes("Raw Content Pipeline Foundation public export boundary")) {
      fail(`${rawContentIndexPath} must document the Phase 2 Milestone 16 Raw Content Pipeline Foundation public export boundary`);
    }

    for (const exportName of requiredRawContentFoundationExports) {
      if (!rawContentIndex.includes(exportName)) {
        fail(`${rawContentIndexPath} must export ${exportName} from the Raw Content public boundary`);
      }
    }
  }

  const rawContentReadmePath = "packages/raw-content/README.md";
  if (exists(rawContentReadmePath)) {
    const rawContentReadme = read(rawContentReadmePath);
    const requiredBoundaryStatements = [
      "Phase 2 Milestone 16",
      "Raw Content contracts only",
      "No persistence implementation"
    ];

    for (const statement of requiredBoundaryStatements) {
      if (!rawContentReadme.includes(statement)) {
        fail(`${rawContentReadmePath} must document the Phase 2 Milestone 16 Raw Content Pipeline Foundation boundary: missing "${statement}"`);
      }
    }
  }

  const rawContentPackageJsonPath = "packages/raw-content/package.json";
  if (exists(rawContentPackageJsonPath)) {
    const rawContentPackageJson = JSON.parse(read(rawContentPackageJsonPath));
    const dependencyNames = Object.keys({
      ...(rawContentPackageJson.dependencies ?? {}),
      ...(rawContentPackageJson.devDependencies ?? {}),
      ...(rawContentPackageJson.optionalDependencies ?? {}),
      ...(rawContentPackageJson.peerDependencies ?? {})
    });
    const prohibitedDependencyPatterns = [
      ["Prisma", /(^@prisma\/client$|^prisma$)/iu],
      ["AI SDK", /(^openai$|^@anthropic-ai\/sdk$|ai-sdk)/iu],
      ["API framework", /(^express$|^fastify$|^hono$|^@nestjs)/iu],
      ["frontend framework", /(^react$|^react-dom$|^next$|^vite$)/iu],
      ["scheduler or worker", /(^bullmq$|^agenda$|scheduler|worker|queue)/iu]
    ];

    for (const dependencyName of dependencyNames) {
      for (const [label, pattern] of prohibitedDependencyPatterns) {
        if (pattern.test(dependencyName)) {
          fail(`Raw Content Pipeline foundation must not depend on ${label}; found ${dependencyName} in ${rawContentPackageJsonPath}`);
        }
      }
    }
  }

  for (const file of listFiles("packages/raw-content")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/raw-content/dist/") ||
      file.startsWith("packages/raw-content/node_modules/") ||
      file.startsWith("packages/raw-content/.turbo/") ||
      file.includes("/__tests__/")
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["persistence implementation", /\bPrismaClient\b|\brepository implementation\b|\bwriteToDatabase\b|\bpersistRawContent\b/iu],
      ["Prisma repository", /\bPrisma.*Repository\b|\bRepository.*Prisma\b/iu],
      ["provider payload leakage", /\braw_provider_payload\b|\bprovider response\b|\braw provider payload\b/iu],
      ["secret leakage", /\b(access_token|refresh_token|client_secret)\s*[:=]\s*["']?[A-Za-z0-9_-]{8,}|\bauthorization:\s*bearer\s+[A-Za-z0-9_-]{8,}/iu],
      ["stack leakage", /\bstack trace\b|\bstack:\b/iu],
      ["AI workflow", /\bAIWorkflow\b|\bai workflow\b|\bworkflow runner\b/iu],
      ["opportunity generation", /\bgenerateOpportunity\b|\bOpportunityEngine\b|\bopportunity generation\b/iu],
      ["REST API", /\bREST API\b|\bapi route\b|\broute handler\b|\bAPI handler\b/iu],
      ["frontend", /\bReact\b|\btsx\b|\bcomponent\b/iu],
      ["scheduler", /\bscheduler\b|\bscheduleRawContent\b/iu],
      ["worker", /\bworker\b|\bWorkerProcess\b/iu],
      ["business scoring", /\bscoreOpportunity\b|\bscoring engine\b|\bbusiness scoring\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Raw Content Pipeline foundation must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertNormalizationFoundationPolicy() {
  assertRawContentFoundationPolicy();

  for (const file of requiredNormalizationFoundationFiles) {
    if (!exists(file)) {
      fail(`Normalization Pipeline foundation is missing required file: ${file}`);
    }
  }

  const normalizationIndexPath = "packages/normalization/src/index.ts";
  if (exists(normalizationIndexPath)) {
    const normalizationIndex = read(normalizationIndexPath);
    if (!normalizationIndex.includes("Normalization Pipeline Foundation public export boundary")) {
      fail(`${normalizationIndexPath} must document the Phase 2 Milestone 17 Normalization Pipeline Foundation public export boundary`);
    }

    for (const exportName of requiredNormalizationFoundationExports) {
      if (!normalizationIndex.includes(exportName)) {
        fail(`${normalizationIndexPath} must export ${exportName} from the Normalization public boundary`);
      }
    }
  }

  const normalizationReadmePath = "packages/normalization/README.md";
  if (exists(normalizationReadmePath)) {
    const normalizationReadme = read(normalizationReadmePath);
    const requiredBoundaryStatements = [
      "Phase 2 Milestone 17",
      "normalization package boundary only",
      "must not introduce embeddings"
    ];

    for (const statement of requiredBoundaryStatements) {
      if (!normalizationReadme.includes(statement)) {
        fail(`${normalizationReadmePath} must document the Phase 2 Milestone 17 Normalization Pipeline Foundation boundary: missing "${statement}"`);
      }
    }
  }

  const normalizationPackageJsonPath = "packages/normalization/package.json";
  if (exists(normalizationPackageJsonPath)) {
    const normalizationPackageJson = JSON.parse(read(normalizationPackageJsonPath));
    const dependencyNames = Object.keys({
      ...(normalizationPackageJson.dependencies ?? {}),
      ...(normalizationPackageJson.devDependencies ?? {}),
      ...(normalizationPackageJson.optionalDependencies ?? {}),
      ...(normalizationPackageJson.peerDependencies ?? {})
    });
    const prohibitedDependencyPatterns = [
      ["embedding or AI SDK", /(^openai$|^@anthropic-ai\/sdk$|ai-sdk|embed|embedding)/iu],
      ["Prisma", /(^@prisma\/client$|^prisma$)/iu],
      ["API framework", /(^express$|^fastify$|^hono$|^@nestjs)/iu],
      ["frontend framework", /(^react$|^react-dom$|^next$|^vite$)/iu],
      ["scheduler or worker", /(^bullmq$|^agenda$|scheduler|worker|queue)/iu]
    ];

    for (const dependencyName of dependencyNames) {
      for (const [label, pattern] of prohibitedDependencyPatterns) {
        if (pattern.test(dependencyName)) {
          fail(`Normalization Pipeline foundation must not depend on ${label}; found ${dependencyName} in ${normalizationPackageJsonPath}`);
        }
      }
    }
  }

  for (const file of listFiles("packages/normalization")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/normalization/dist/") ||
      file.startsWith("packages/normalization/node_modules/") ||
      file.startsWith("packages/normalization/.turbo/") ||
      file.includes("/__tests__/")
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["embeddings", /\bembedding(s)?\b|\bembedText\b|\bvectorize\b/iu],
      ["AI analysis", /\bAIAnalysis\b|\bai analysis\b|\bLLM\b|\bOpenAI\b|\bAnthropic\b/iu],
      ["opportunity generation", /\bgenerateOpportunity\b|\bOpportunityEngine\b|\bopportunity generation\b/iu],
      ["REST API", /\bREST API\b|\bapi route\b|\broute handler\b|\bAPI handler\b/iu],
      ["frontend", /\bReact\b|\btsx\b|\bcomponent\b/iu],
      ["scheduler", /\bscheduler\b|\bscheduleNormalization\b/iu],
      ["persistence implementation", /\bPrismaClient\b|\brepository implementation\b|\bwriteToDatabase\b|\bpersistNormalized\b/iu],
      ["Prisma repository", /\bPrisma.*Repository\b|\bRepository.*Prisma\b/iu],
      ["worker", /\bworker\b|\bWorkerProcess\b/iu],
      ["business scoring", /\bscoreOpportunity\b|\bscoring engine\b|\bbusiness scoring\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Normalization Pipeline foundation must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertEmbeddingFoundationPolicy() {
  assertNormalizationFoundationPolicy();

  for (const file of requiredEmbeddingFoundationFiles) {
    if (!exists(file)) {
      fail(`Embedding Foundation is missing required file: ${file}`);
    }
  }

  const embeddingsIndexPath = "packages/embeddings/src/index.ts";
  if (exists(embeddingsIndexPath)) {
    const embeddingsIndex = read(embeddingsIndexPath);
    if (!embeddingsIndex.includes("Embedding Foundation public export boundary")) {
      fail(`${embeddingsIndexPath} must document the Phase 2 Milestone 18 Embedding Foundation public export boundary`);
    }

    for (const exportName of requiredEmbeddingFoundationExports) {
      if (!embeddingsIndex.includes(exportName)) {
        fail(`${embeddingsIndexPath} must export ${exportName} from the Embedding Foundation public boundary`);
      }
    }
  }

  const embeddingsReadmePath = "packages/embeddings/README.md";
  if (exists(embeddingsReadmePath)) {
    const embeddingsReadme = read(embeddingsReadmePath);
    const requiredBoundaryStatements = [
      "Phase 2 Milestone 18",
      "package boundary only",
      "must not introduce OpenAI API calls"
    ];

    for (const statement of requiredBoundaryStatements) {
      if (!embeddingsReadme.includes(statement)) {
        fail(`${embeddingsReadmePath} must document the Phase 2 Milestone 18 Embedding Foundation boundary: missing "${statement}"`);
      }
    }
  }

  const embeddingsPackageJsonPath = "packages/embeddings/package.json";
  if (exists(embeddingsPackageJsonPath)) {
    const embeddingsPackageJson = JSON.parse(read(embeddingsPackageJsonPath));
    const dependencyNames = Object.keys({
      ...(embeddingsPackageJson.dependencies ?? {}),
      ...(embeddingsPackageJson.devDependencies ?? {}),
      ...(embeddingsPackageJson.optionalDependencies ?? {}),
      ...(embeddingsPackageJson.peerDependencies ?? {})
    });
    const prohibitedDependencyPatterns = [
      ["OpenAI API SDK", /(^openai$|^@openai)/iu],
      ["Gemini API SDK", /(^@google\/generative-ai$|^@google-genai|gemini)/iu],
      ["Voyage API SDK", /(^voyageai$|voyage)/iu],
      ["vector database", /(pinecone|weaviate|qdrant|milvus|chroma|pgvector)/iu],
      ["API framework", /(^express$|^fastify$|^hono$|^@nestjs)/iu],
      ["frontend framework", /(^react$|^react-dom$|^next$|^vite$)/iu],
      ["scheduler or worker", /(^bullmq$|^agenda$|scheduler|worker|queue)/iu],
      ["persistence implementation", /(^@prisma\/client$|^prisma$|typeorm|sequelize|mongoose)/iu]
    ];

    for (const dependencyName of dependencyNames) {
      for (const [label, pattern] of prohibitedDependencyPatterns) {
        if (pattern.test(dependencyName)) {
          fail(`Embedding Foundation must not depend on ${label}; found ${dependencyName} in ${embeddingsPackageJsonPath}`);
        }
      }
    }
  }

  for (const file of listFiles("packages/embeddings")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/embeddings/dist/") ||
      file.startsWith("packages/embeddings/node_modules/") ||
      file.startsWith("packages/embeddings/.turbo/") ||
      file.includes("/__tests__/")
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["OpenAI API implementation", /\bOpenAI\b|\bopenai\.(embeddings|responses|chat)\b|\bapi\.openai\.com\b/iu],
      ["Gemini API implementation", /\bGemini\b|\bgenerative-ai\b|\bgenerateContent\b/iu],
      ["Voyage API implementation", /\bVoyage\b|\bvoyageai\b/iu],
      ["vector database", /\bvector database\b|\bPinecone\b|\bWeaviate\b|\bQdrant\b|\bMilvus\b|\bChroma\b|\bpgvector\b/iu],
      ["AI reasoning", /\bAI reasoning\b|\breasoning model\b|\bLLM reasoning\b/iu],
      ["prompt execution", /\bprompt execution\b|\brunPrompt\b|\bexecutePrompt\b/iu],
      ["opportunity generation", /\bgenerateOpportunity\b|\bOpportunityEngine\b|\bopportunity generation\b/iu],
      ["REST API", /\bREST API\b|\bapi route\b|\broute handler\b|\bAPI handler\b/iu],
      ["frontend", /\bReact\b|\btsx\b|\bcomponent\b/iu],
      ["persistence implementation", /\bPrismaClient\b|\brepository implementation\b|\bwriteToDatabase\b|\bpersistEmbedding\b/iu],
      ["scheduler", /\bscheduler\b|\bscheduleEmbedding\b/iu],
      ["worker", /\bworker\b|\bWorkerProcess\b/iu],
      ["business logic", /\bbusiness logic\b|\bbusiness scoring\b|\bscoreOpportunity\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Embedding Foundation must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertLlmAnalysisFoundationPolicy() {
  assertEmbeddingFoundationPolicy();

  for (const file of requiredLlmAnalysisFoundationFiles) {
    if (!exists(file)) {
      fail(`LLM Analysis Foundation is missing required file: ${file}`);
    }
  }

  const llmAnalysisIndexPath = "packages/llm-analysis/src/index.ts";
  if (exists(llmAnalysisIndexPath)) {
    const llmAnalysisIndex = read(llmAnalysisIndexPath);
    if (!llmAnalysisIndex.includes("LLM Analysis Foundation public export boundary")) {
      fail(`${llmAnalysisIndexPath} must document the Phase 2 Milestone 19 LLM Analysis Foundation public export boundary`);
    }

    for (const exportName of requiredLlmAnalysisFoundationExports) {
      if (!llmAnalysisIndex.includes(exportName)) {
        fail(`${llmAnalysisIndexPath} must export ${exportName} from the LLM Analysis Foundation public boundary`);
      }
    }
  }

  const llmAnalysisReadmePath = "packages/llm-analysis/README.md";
  if (exists(llmAnalysisReadmePath)) {
    const llmAnalysisReadme = read(llmAnalysisReadmePath);
    const requiredBoundaryStatements = [
      "Phase 2 Milestone 19",
      "package boundary only",
      "must not introduce provider SDKs"
    ];

    for (const statement of requiredBoundaryStatements) {
      if (!llmAnalysisReadme.includes(statement)) {
        fail(`${llmAnalysisReadmePath} must document the Phase 2 Milestone 19 LLM Analysis Foundation boundary: missing "${statement}"`);
      }
    }
  }

  const llmAnalysisPackageJsonPath = "packages/llm-analysis/package.json";
  if (exists(llmAnalysisPackageJsonPath)) {
    const llmAnalysisPackageJson = JSON.parse(read(llmAnalysisPackageJsonPath));
    const dependencyNames = Object.keys({
      ...(llmAnalysisPackageJson.dependencies ?? {}),
      ...(llmAnalysisPackageJson.devDependencies ?? {}),
      ...(llmAnalysisPackageJson.optionalDependencies ?? {}),
      ...(llmAnalysisPackageJson.peerDependencies ?? {})
    });
    const prohibitedDependencyPatterns = [
      ["provider SDK", /(^openai$|^@openai|^@anthropic-ai\/sdk$|^@google\/generative-ai$|^@google-genai|gemini)/iu],
      ["API framework", /(^express$|^fastify$|^hono$|^@nestjs)/iu],
      ["frontend framework", /(^react$|^react-dom$|^next$|^vite$)/iu],
      ["scheduler or worker", /(^bullmq$|^agenda$|scheduler|worker|queue)/iu],
      ["persistence implementation", /(^@prisma\/client$|^prisma$|typeorm|sequelize|mongoose)/iu],
      ["opportunity engine", /(opportunity-engine|opportunity-generation|scoring)/iu]
    ];

    for (const dependencyName of dependencyNames) {
      for (const [label, pattern] of prohibitedDependencyPatterns) {
        if (pattern.test(dependencyName)) {
          fail(`LLM Analysis Foundation must not depend on ${label}; found ${dependencyName} in ${llmAnalysisPackageJsonPath}`);
        }
      }
    }
  }

  for (const file of listFiles("packages/llm-analysis")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/llm-analysis/dist/") ||
      file.startsWith("packages/llm-analysis/node_modules/") ||
      file.startsWith("packages/llm-analysis/.turbo/") ||
      file.includes("/__tests__/")
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["OpenAI API implementation", /\bOpenAI\b|\bopenai\.(responses|chat|completions|embeddings)\b|\bapi\.openai\.com\b/iu],
      ["Anthropic API implementation", /\bAnthropic\b|\bclaude\b|\bapi\.anthropic\.com\b/iu],
      ["Gemini API implementation", /\bGemini\b|\bgenerative-ai\b|\bgenerateContent\b/iu],
      ["provider SDK", /\bprovider SDK\b|\bOpenAIClient\b|\bAnthropicClient\b|\bGeminiClient\b/iu],
      ["live LLM call", /\blive LLM call\b|\bcallLlm\b|\bcallLLM\b|\binvokeModel\b|\bgenerateText\b/iu],
      ["prompt runtime", /\bprompt runtime\b|\brunPrompt\b|\bexecutePrompt\b|\brenderPrompt\b/iu],
      ["extraction workflow", /\bextraction workflow\b|\bpain point extraction\b|\bextractPainPoint\b/iu],
      ["opportunity generation", /\bgenerateOpportunity\b|\bOpportunityEngine\b|\bopportunity generation\b/iu],
      ["REST API", /\bREST API\b|\bapi route\b|\broute handler\b|\bAPI handler\b/iu],
      ["frontend", /\bReact\b|\btsx\b|\bcomponent\b/iu],
      ["persistence implementation", /\bPrismaClient\b|\brepository implementation\b|\bwriteToDatabase\b|\bpersistAnalysis\b/iu],
      ["scheduler", /\bscheduler\b|\bscheduleAnalysis\b/iu],
      ["worker", /\bworker\b|\bWorkerProcess\b/iu],
      ["business scoring", /\bbusiness scoring\b|\bscoreOpportunity\b|\bscoring engine\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`LLM Analysis Foundation must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertStructuredAnalysisFoundationPolicy() {
  assertLlmAnalysisFoundationPolicy();

  for (const file of requiredStructuredAnalysisFoundationFiles) {
    if (!exists(file)) {
      fail(`Structured Analysis Foundation is missing required file: ${file}`);
    }
  }

  const analysisIndexPath = "packages/analysis/src/index.ts";
  if (exists(analysisIndexPath)) {
    const analysisIndex = read(analysisIndexPath);
    if (!analysisIndex.includes("Structured Analysis Foundation public export boundary")) {
      fail(`${analysisIndexPath} must document the Phase 2 Milestone 20 Structured Analysis Foundation public export boundary`);
    }

    for (const exportName of requiredStructuredAnalysisFoundationExports) {
      if (!analysisIndex.includes(exportName)) {
        fail(`${analysisIndexPath} must export ${exportName} from the Structured Analysis Foundation public boundary`);
      }
    }
  }

  const analysisReadmePath = "packages/analysis/README.md";
  if (exists(analysisReadmePath)) {
    const analysisReadme = read(analysisReadmePath);
    const requiredBoundaryStatements = [
      "Phase 2 Milestone 20",
      "package boundary only",
      "must not introduce provider SDKs",
      "prompt execution",
      "opportunity generation"
    ];

    for (const statement of requiredBoundaryStatements) {
      if (!analysisReadme.includes(statement)) {
        fail(`${analysisReadmePath} must document the Phase 2 Milestone 20 Structured Analysis Foundation boundary: missing "${statement}"`);
      }
    }
  }

  const analysisPackageJsonPath = "packages/analysis/package.json";
  if (exists(analysisPackageJsonPath)) {
    const analysisPackageJson = JSON.parse(read(analysisPackageJsonPath));
    const dependencyNames = Object.keys({
      ...(analysisPackageJson.dependencies ?? {}),
      ...(analysisPackageJson.devDependencies ?? {}),
      ...(analysisPackageJson.optionalDependencies ?? {}),
      ...(analysisPackageJson.peerDependencies ?? {})
    });
    const prohibitedDependencyPatterns = [
      ["provider SDK", /(^openai$|^@openai|^@anthropic-ai\/sdk$|^@google\/generative-ai$|^@google-genai|gemini)/iu],
      ["API framework", /(^express$|^fastify$|^hono$|^@nestjs)/iu],
      ["frontend framework", /(^react$|^react-dom$|^next$|^vite$)/iu],
      ["scheduler or worker", /(^bullmq$|^agenda$|scheduler|worker|queue)/iu],
      ["persistence implementation", /(^@prisma\/client$|^prisma$|typeorm|sequelize|mongoose)/iu],
      ["opportunity engine", /(opportunity-engine|opportunity-generation|scoring)/iu]
    ];

    for (const dependencyName of dependencyNames) {
      for (const [label, pattern] of prohibitedDependencyPatterns) {
        if (pattern.test(dependencyName)) {
          fail(`Structured Analysis Foundation must not depend on ${label}; found ${dependencyName} in ${analysisPackageJsonPath}`);
        }
      }
    }
  }

  for (const file of listFiles("packages/analysis")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/analysis/dist/") ||
      file.startsWith("packages/analysis/node_modules/") ||
      file.startsWith("packages/analysis/.turbo/") ||
      file.includes("/__tests__/")
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["OpenAI API implementation", /\bOpenAI\b|\bopenai\.(responses|chat|completions|embeddings)\b|\bapi\.openai\.com\b/iu],
      ["Anthropic API implementation", /\bAnthropic\b|\bclaude\b|\bapi\.anthropic\.com\b/iu],
      ["Gemini API implementation", /\bGemini\b|\bgenerative-ai\b|\bgenerateContent\b/iu],
      ["provider SDK", /\bprovider SDK\b|\bOpenAIClient\b|\bAnthropicClient\b|\bGeminiClient\b/iu],
      ["prompt execution", /\bprompt execution\b|\brunPrompt\b|\bexecutePrompt\b|\brenderPrompt\b/iu],
      ["AI reasoning", /\bAI reasoning\b|\breasoning engine\b|\binferOpportunity\b/iu],
      ["pain point extraction", /\bpain point extraction\b|\bextractPainPoint\b/iu],
      ["opportunity generation", /\bgenerateOpportunity\b|\bOpportunityEngine\b|\bopportunity generation\b/iu],
      ["REST API", /\bREST API\b|\bapi route\b|\broute handler\b|\bAPI handler\b/iu],
      ["frontend", /\bReact\b|\btsx\b|\bcomponent\b/iu],
      ["persistence implementation", /\bPrismaClient\b|\brepository implementation\b|\bwriteToDatabase\b|\bpersistAnalysis\b/iu],
      ["scheduler", /\bscheduler\b|\bscheduleAnalysis\b/iu],
      ["worker", /\bworker\b|\bWorkerProcess\b/iu],
      ["business logic", /\bbusiness logic\b|\bbusiness scoring\b|\bscoreOpportunity\b|\bscoring engine\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Structured Analysis Foundation must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertOpportunityEngineFoundationPolicy() {
  assertStructuredAnalysisFoundationPolicy();

  for (const file of requiredOpportunityEngineFoundationFiles) {
    if (!exists(file)) {
      fail(`Opportunity Engine Foundation is missing required file: ${file}`);
    }
  }

  const opportunityEngineIndexPath = "packages/opportunity-engine/src/index.ts";
  if (exists(opportunityEngineIndexPath)) {
    const opportunityEngineIndex = read(opportunityEngineIndexPath);
    if (!opportunityEngineIndex.includes("Opportunity Engine Foundation public export boundary")) {
      fail(`${opportunityEngineIndexPath} must document the Phase 2 Milestone 21 Opportunity Engine Foundation public export boundary`);
    }

    for (const exportName of requiredOpportunityEngineFoundationExports) {
      if (!opportunityEngineIndex.includes(exportName)) {
        fail(`${opportunityEngineIndexPath} must export ${exportName} from the Opportunity Engine Foundation public boundary`);
      }
    }
  }

  const opportunityEngineReadmePath = "packages/opportunity-engine/README.md";
  if (exists(opportunityEngineReadmePath)) {
    const opportunityEngineReadme = read(opportunityEngineReadmePath);
    const requiredBoundaryStatements = [
      "Phase 2 Milestone 21",
      "package boundary only",
      "must not introduce REST APIs",
      "production ranking algorithms",
      "business workflows"
    ];

    for (const statement of requiredBoundaryStatements) {
      if (!opportunityEngineReadme.includes(statement)) {
        fail(`${opportunityEngineReadmePath} must document the Phase 2 Milestone 21 Opportunity Engine Foundation boundary: missing "${statement}"`);
      }
    }
  }

  const opportunityEnginePackageJsonPath = "packages/opportunity-engine/package.json";
  if (exists(opportunityEnginePackageJsonPath)) {
    const opportunityEnginePackageJson = JSON.parse(read(opportunityEnginePackageJsonPath));
    const dependencyNames = Object.keys({
      ...(opportunityEnginePackageJson.dependencies ?? {}),
      ...(opportunityEnginePackageJson.devDependencies ?? {}),
      ...(opportunityEnginePackageJson.optionalDependencies ?? {}),
      ...(opportunityEnginePackageJson.peerDependencies ?? {})
    });
    const prohibitedDependencyPatterns = [
      ["API framework", /(^express$|^fastify$|^hono$|^@nestjs)/iu],
      ["frontend framework", /(^react$|^react-dom$|^next$|^vite$)/iu],
      ["scheduler or worker", /(^bullmq$|^agenda$|scheduler|worker|queue)/iu],
      ["persistence implementation", /(^@prisma\/client$|^prisma$|typeorm|sequelize|mongoose)/iu],
      ["provider SDK", /(^openai$|^@openai|^@anthropic-ai\/sdk$|^@google\/generative-ai$|^@google-genai|gemini)/iu],
      ["billing", /(^stripe$|^@stripe|billing)/iu],
      ["user account implementation", /(clerk|auth0|next-auth|passport|user-account)/iu],
      ["production ranking implementation", /(ranker|ranking-engine|scoring-engine)/iu]
    ];

    for (const dependencyName of dependencyNames) {
      for (const [label, pattern] of prohibitedDependencyPatterns) {
        if (pattern.test(dependencyName)) {
          fail(`Opportunity Engine Foundation must not depend on ${label}; found ${dependencyName} in ${opportunityEnginePackageJsonPath}`);
        }
      }
    }
  }

  for (const file of listFiles("packages/opportunity-engine")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/opportunity-engine/dist/") ||
      file.startsWith("packages/opportunity-engine/node_modules/") ||
      file.startsWith("packages/opportunity-engine/.turbo/") ||
      file.includes("/__tests__/")
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["REST API", /\bREST API\b|\bapi route\b|\broute handler\b|\bAPI handler\b/iu],
      ["frontend", /\bReact\b|\btsx\b|\bcomponent\b/iu],
      ["persistence implementation", /\bPrismaClient\b|\brepository implementation\b|\bwriteToDatabase\b|\bpersistOpportunity\b/iu],
      ["scheduler", /\bscheduler\b|\bscheduleOpportunity\b/iu],
      ["worker", /\bworker\b|\bWorkerProcess\b/iu],
      ["live AI call", /\blive AI call\b|\bcallLlm\b|\bcallLLM\b|\binvokeModel\b|\bgenerateText\b/iu],
      ["prompt runtime", /\bprompt runtime\b|\brunPrompt\b|\bexecutePrompt\b|\brenderPrompt\b/iu],
      ["billing", /\bbilling\b|\bStripe\b|\bcheckout\b/iu],
      ["user accounts", /\buser accounts?\b|\bUserAccount\b|\bauthentication\b|\bauthorization\b/iu],
      ["production ranking algorithm", /\bproduction ranking algorithm\b|\branking algorithm\b|\branking engine\b|\bscoreOpportunity\b/iu],
      ["business workflow", /\bbusiness workflows?\b|\bworkflow engine\b|\bexecuteWorkflow\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Opportunity Engine Foundation must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertOpportunityPipelineFoundationPolicy() {
  assertOpportunityEngineFoundationPolicy();

  for (const file of requiredOpportunityPipelineFoundationFiles) {
    if (!exists(file)) {
      fail(`Opportunity Pipeline Foundation is missing required file: ${file}`);
    }
  }

  const opportunityPipelineIndexPath = "packages/opportunity-pipeline/src/index.ts";
  if (exists(opportunityPipelineIndexPath)) {
    const opportunityPipelineIndex = read(opportunityPipelineIndexPath);
    if (!opportunityPipelineIndex.includes("Opportunity Pipeline Foundation public export boundary")) {
      fail(`${opportunityPipelineIndexPath} must document the Phase 2 Milestone 22 Opportunity Pipeline Foundation public export boundary`);
    }

    for (const exportName of requiredOpportunityPipelineFoundationExports) {
      if (!opportunityPipelineIndex.includes(exportName)) {
        fail(`${opportunityPipelineIndexPath} must export ${exportName} from the Opportunity Pipeline Foundation public boundary`);
      }
    }
  }

  const opportunityPipelineReadmePath = "packages/opportunity-pipeline/README.md";
  if (exists(opportunityPipelineReadmePath)) {
    const opportunityPipelineReadme = read(opportunityPipelineReadmePath);
    const requiredBoundaryStatements = [
      "Phase 2 Milestone 22",
      "pipeline primitives",
      "evidence aggregation",
      "hypothesis assembly",
      "candidate opportunity",
      "must not introduce business scoring algorithms",
      "ranking algorithms",
      "recommendation engines",
      "provider SDKs"
    ];

    for (const statement of requiredBoundaryStatements) {
      if (!opportunityPipelineReadme.includes(statement)) {
        fail(`${opportunityPipelineReadmePath} must document the Phase 2 Milestone 22 Opportunity Pipeline Foundation boundary: missing "${statement}"`);
      }
    }
  }

  const opportunityPipelinePackageJsonPath = "packages/opportunity-pipeline/package.json";
  if (exists(opportunityPipelinePackageJsonPath)) {
    const opportunityPipelinePackageJson = JSON.parse(read(opportunityPipelinePackageJsonPath));
    const dependencyNames = Object.keys({
      ...(opportunityPipelinePackageJson.dependencies ?? {}),
      ...(opportunityPipelinePackageJson.devDependencies ?? {}),
      ...(opportunityPipelinePackageJson.optionalDependencies ?? {}),
      ...(opportunityPipelinePackageJson.peerDependencies ?? {})
    });
    const prohibitedDependencyPatterns = [
      ["API framework", /(^express$|^fastify$|^hono$|^@nestjs)/iu],
      ["frontend framework", /(^react$|^react-dom$|^next$|^vite$)/iu],
      ["persistence implementation", /(^@prisma\/client$|^prisma$|typeorm|sequelize|mongoose)/iu],
      ["scheduler or worker", /(^bullmq$|^agenda$|scheduler|worker|queue)/iu],
      ["provider SDK", /(^openai$|^@openai|^@anthropic-ai\/sdk$|^@google\/generative-ai$|^@google-genai|gemini)/iu],
      ["ranking or recommendation implementation", /(ranker|ranking-engine|recommendation-engine|scoring-engine)/iu]
    ];

    for (const dependencyName of dependencyNames) {
      for (const [label, pattern] of prohibitedDependencyPatterns) {
        if (pattern.test(dependencyName)) {
          fail(`Opportunity Pipeline Foundation must not depend on ${label}; found ${dependencyName} in ${opportunityPipelinePackageJsonPath}`);
        }
      }
    }
  }

  for (const file of listFiles("packages/opportunity-pipeline")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/opportunity-pipeline/dist/") ||
      file.startsWith("packages/opportunity-pipeline/node_modules/") ||
      file.startsWith("packages/opportunity-pipeline/.turbo/") ||
      file.includes("/__tests__/")
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["business scoring algorithm", /\bbusiness scoring algorithms?\b|\bscoreOpportunity\b|\bscoring implementation\b/iu],
      ["ranking algorithm", /\branking algorithms?\b|\branking engine\b|\brankOpportunity\b/iu],
      ["recommendation engine", /\brecommendation engines?\b|\brecommendCandidate\b/iu],
      ["REST API", /\bREST API\b|\bapi route\b|\broute handler\b|\bAPI handler\b/iu],
      ["frontend", /\bReact\b|\btsx\b|\bcomponent\b/iu],
      ["persistence implementation", /\bPrismaClient\b|\brepository implementation\b|\bwriteToDatabase\b|\bpersistOpportunity\b|\bpersistPipeline\b/iu],
      ["scheduler", /\bscheduler\b|\bschedulePipeline\b/iu],
      ["worker", /\bworker\b|\bWorkerProcess\b/iu],
      ["provider SDK", /\bprovider SDK\b|\bOpenAIClient\b|\bAnthropicClient\b|\bGeminiClient\b/iu],
      ["business workflow", /\bbusiness workflows?\b|\bworkflow engine\b|\bexecuteWorkflow\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Opportunity Pipeline Foundation must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertOpportunityCandidatesFoundationPolicy() {
  assertOpportunityPipelineFoundationPolicy();

  for (const file of requiredOpportunityCandidatesFoundationFiles) {
    if (!exists(file)) {
      fail(`Candidate Opportunity Engine is missing required file: ${file}`);
    }
  }

  const opportunityCandidatesIndexPath = "packages/opportunity-candidates/src/index.ts";
  if (exists(opportunityCandidatesIndexPath)) {
    const opportunityCandidatesIndex = read(opportunityCandidatesIndexPath);
    if (!opportunityCandidatesIndex.includes("Candidate Opportunity Engine public export boundary")) {
      fail(`${opportunityCandidatesIndexPath} must document the Phase 2 Milestone 23 Candidate Opportunity Engine public export boundary`);
    }

    for (const exportName of requiredOpportunityCandidatesFoundationExports) {
      if (!opportunityCandidatesIndex.includes(exportName)) {
        fail(`${opportunityCandidatesIndexPath} must export ${exportName} from the Candidate Opportunity Engine public boundary`);
      }
    }
  }

  const opportunityCandidatesReadmePath = "packages/opportunity-candidates/README.md";
  if (exists(opportunityCandidatesReadmePath)) {
    const opportunityCandidatesReadme = read(opportunityCandidatesReadmePath);
    const requiredBoundaryStatements = [
      "Phase 2 Milestone 23",
      "Candidate Opportunity Engine",
      "candidate opportunity",
      "must not introduce production ranking algorithms",
      "recommendation engines",
      "business scoring",
      "provider SDKs"
    ];

    for (const statement of requiredBoundaryStatements) {
      if (!opportunityCandidatesReadme.includes(statement)) {
        fail(`${opportunityCandidatesReadmePath} must document the Phase 2 Milestone 23 Candidate Opportunity Engine boundary: missing "${statement}"`);
      }
    }
  }

  const opportunityCandidatesPackageJsonPath = "packages/opportunity-candidates/package.json";
  if (exists(opportunityCandidatesPackageJsonPath)) {
    const opportunityCandidatesPackageJson = JSON.parse(read(opportunityCandidatesPackageJsonPath));
    const dependencyNames = Object.keys({
      ...(opportunityCandidatesPackageJson.dependencies ?? {}),
      ...(opportunityCandidatesPackageJson.devDependencies ?? {}),
      ...(opportunityCandidatesPackageJson.optionalDependencies ?? {}),
      ...(opportunityCandidatesPackageJson.peerDependencies ?? {})
    });
    const prohibitedDependencyPatterns = [
      ["API framework", /(^express$|^fastify$|^hono$|^@nestjs)/iu],
      ["frontend framework", /(^react$|^react-dom$|^next$|^vite$)/iu],
      ["persistence implementation", /(^@prisma\/client$|^prisma$|typeorm|sequelize|mongoose)/iu],
      ["scheduler or worker", /(^bullmq$|^agenda$|scheduler|worker|queue)/iu],
      ["provider SDK", /(^openai$|^@openai|^@anthropic-ai\/sdk$|^@google\/generative-ai$|^@google-genai|gemini)/iu],
      ["ranking or recommendation implementation", /(ranker|ranking-engine|recommendation-engine|scoring-engine)/iu]
    ];

    for (const dependencyName of dependencyNames) {
      for (const [label, pattern] of prohibitedDependencyPatterns) {
        if (pattern.test(dependencyName)) {
          fail(`Candidate Opportunity Engine must not depend on ${label}; found ${dependencyName} in ${opportunityCandidatesPackageJsonPath}`);
        }
      }
    }
  }

  for (const file of listFiles("packages/opportunity-candidates")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/opportunity-candidates/dist/") ||
      file.startsWith("packages/opportunity-candidates/node_modules/") ||
      file.startsWith("packages/opportunity-candidates/.turbo/") ||
      file.includes("/__tests__/")
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["production ranking algorithm", /\bproduction ranking algorithms?\b|\branking algorithms?\b|\branking engine\b|\brankCandidate\b/iu],
      ["recommendation engine", /\brecommendation engines?\b|\brecommendCandidate\b/iu],
      ["business scoring", /\bbusiness scoring\b|\bscoreCandidate\b|\bscoring implementation\b/iu],
      ["REST API", /\bREST API\b|\bapi route\b|\broute handler\b|\bAPI handler\b/iu],
      ["frontend", /\bReact\b|\btsx\b|\bcomponent\b/iu],
      ["persistence implementation", /\bPrismaClient\b|\brepository implementation\b|\bwriteToDatabase\b|\bpersistCandidate\b/iu],
      ["scheduler", /\bscheduler\b|\bscheduleCandidate\b/iu],
      ["worker", /\bworker\b|\bWorkerProcess\b/iu],
      ["provider SDK", /\bprovider SDK\b|\bOpenAIClient\b|\bAnthropicClient\b|\bGeminiClient\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Candidate Opportunity Engine must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertOpportunityGenerationFoundationPolicy() {
  assertOpportunityCandidatesFoundationPolicy();

  for (const file of requiredOpportunityGenerationFoundationFiles) {
    if (!exists(file)) {
      fail(`Opportunity Generation Workflow is missing required file: ${file}`);
    }
  }

  const opportunityGenerationIndexPath = "packages/opportunity-generation/src/index.ts";
  if (exists(opportunityGenerationIndexPath)) {
    const opportunityGenerationIndex = read(opportunityGenerationIndexPath);
    if (!opportunityGenerationIndex.includes("Opportunity Generation Workflow public export boundary")) {
      fail(`${opportunityGenerationIndexPath} must document the Phase 2 Milestone 24 Opportunity Generation Workflow public export boundary`);
    }

    for (const exportName of requiredOpportunityGenerationFoundationExports) {
      if (!opportunityGenerationIndex.includes(exportName)) {
        fail(`${opportunityGenerationIndexPath} must export ${exportName} from the Opportunity Generation Workflow public boundary`);
      }
    }
  }

  const opportunityGenerationReadmePath = "packages/opportunity-generation/README.md";
  if (exists(opportunityGenerationReadmePath)) {
    const opportunityGenerationReadme = read(opportunityGenerationReadmePath);
    const requiredBoundaryStatements = [
      "Phase 2 Milestone 24",
      "Opportunity Generation Workflow",
      "candidate-to-opportunity",
      "must not introduce production ranking",
      "recommendation engine",
      "provider SDKs",
      "live AI providers"
    ];

    for (const statement of requiredBoundaryStatements) {
      if (!opportunityGenerationReadme.includes(statement)) {
        fail(`${opportunityGenerationReadmePath} must document the Phase 2 Milestone 24 Opportunity Generation Workflow boundary: missing "${statement}"`);
      }
    }
  }

  const opportunityGenerationPackageJsonPath = "packages/opportunity-generation/package.json";
  if (exists(opportunityGenerationPackageJsonPath)) {
    const opportunityGenerationPackageJson = JSON.parse(read(opportunityGenerationPackageJsonPath));
    const dependencyNames = Object.keys({
      ...(opportunityGenerationPackageJson.dependencies ?? {}),
      ...(opportunityGenerationPackageJson.devDependencies ?? {}),
      ...(opportunityGenerationPackageJson.optionalDependencies ?? {}),
      ...(opportunityGenerationPackageJson.peerDependencies ?? {})
    });
    const prohibitedDependencyPatterns = [
      ["API framework", /(^express$|^fastify$|^hono$|^@nestjs)/iu],
      ["frontend framework", /(^react$|^react-dom$|^next$|^vite$)/iu],
      ["persistence implementation", /(^@prisma\/client$|^prisma$|typeorm|sequelize|mongoose)/iu],
      ["scheduler or worker", /(^bullmq$|^agenda$|scheduler|worker|queue)/iu],
      ["provider SDK", /(^openai$|^@openai|^@anthropic-ai\/sdk$|^@google\/generative-ai$|^@google-genai|gemini)/iu],
      ["billing or user account implementation", /(^stripe$|billing|user-account|accounts)/iu],
      ["ranking or recommendation implementation", /(ranker|ranking-engine|recommendation-engine|scoring-engine)/iu]
    ];

    for (const dependencyName of dependencyNames) {
      for (const [label, pattern] of prohibitedDependencyPatterns) {
        if (pattern.test(dependencyName)) {
          fail(`Opportunity Generation Workflow must not depend on ${label}; found ${dependencyName} in ${opportunityGenerationPackageJsonPath}`);
        }
      }
    }
  }

  for (const file of listFiles("packages/opportunity-generation")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/opportunity-generation/dist/") ||
      file.startsWith("packages/opportunity-generation/node_modules/") ||
      file.startsWith("packages/opportunity-generation/.turbo/") ||
      file.includes("/__tests__/")
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["production ranking", /\bproduction ranking\b|\branking algorithm\b|\branking engine\b|\brankOpportunity\b/iu],
      ["recommendation engine", /\brecommendation engine\b|\brecommendOpportunity\b/iu],
      ["REST API", /\bREST API\b|\bapi route\b|\broute handler\b|\bAPI handler\b/iu],
      ["frontend", /\bReact\b|\btsx\b|\bcomponent\b/iu],
      ["persistence implementation", /\bPrismaClient\b|\brepository implementation\b|\bwriteToDatabase\b|\bpersistOpportunity\b/iu],
      ["scheduler", /\bscheduler\b|\bscheduleGeneration\b/iu],
      ["worker", /\bworker\b|\bWorkerProcess\b/iu],
      ["billing", /\bbilling\b|\bStripe\b/iu],
      ["user accounts", /\buser accounts?\b|\bUserAccount\b/iu],
      ["provider SDK", /\bprovider SDK\b|\bOpenAIClient\b|\bAnthropicClient\b|\bGeminiClient\b/iu],
      ["live AI provider", /\blive AI providers?\b|\bcallLlm\b|\bcallLLM\b|\binvokeModel\b|\bgenerateText\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Opportunity Generation Workflow must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertOpportunityRankingFoundationPolicy() {
  assertOpportunityGenerationFoundationPolicy();

  for (const file of requiredOpportunityRankingFoundationFiles) {
    if (!exists(file)) {
      fail(`Opportunity Ranking Engine is missing required file: ${file}`);
    }
  }

  const opportunityRankingIndexPath = "packages/opportunity-ranking/src/index.ts";
  if (exists(opportunityRankingIndexPath)) {
    const opportunityRankingIndex = read(opportunityRankingIndexPath);
    if (!opportunityRankingIndex.includes("Opportunity Ranking Engine public export boundary")) {
      fail(`${opportunityRankingIndexPath} must document the Phase 3 Milestone 25 Opportunity Ranking Engine public export boundary`);
    }

    for (const exportName of requiredOpportunityRankingFoundationExports) {
      if (!opportunityRankingIndex.includes(exportName)) {
        fail(`${opportunityRankingIndexPath} must export ${exportName} from the Opportunity Ranking Engine public boundary`);
      }
    }
  }

  const opportunityRankingReadmePath = "packages/opportunity-ranking/README.md";
  if (exists(opportunityRankingReadmePath)) {
    const opportunityRankingReadme = read(opportunityRankingReadmePath);
    const requiredBoundaryStatements = [
      "Phase 3 Milestone 25",
      "Opportunity Ranking Engine",
      "Product Behavior phase",
      "deterministic ranking",
      "recommendation engine",
      "provider SDKs",
      "LLM calls"
    ];

    for (const statement of requiredBoundaryStatements) {
      if (!opportunityRankingReadme.includes(statement)) {
        fail(`${opportunityRankingReadmePath} must document the Phase 3 Milestone 25 Opportunity Ranking Engine boundary: missing "${statement}"`);
      }
    }
  }

  const opportunityRankingPackageJsonPath = "packages/opportunity-ranking/package.json";
  if (exists(opportunityRankingPackageJsonPath)) {
    const opportunityRankingPackageJson = JSON.parse(read(opportunityRankingPackageJsonPath));
    const dependencyNames = Object.keys({
      ...(opportunityRankingPackageJson.dependencies ?? {}),
      ...(opportunityRankingPackageJson.devDependencies ?? {}),
      ...(opportunityRankingPackageJson.optionalDependencies ?? {}),
      ...(opportunityRankingPackageJson.peerDependencies ?? {})
    });
    const prohibitedDependencyPatterns = [
      ["API framework", /(^express$|^fastify$|^hono$|^@nestjs)/iu],
      ["frontend framework", /(^react$|^react-dom$|^next$|^vite$)/iu],
      ["persistence implementation", /(^@prisma\/client$|^prisma$|typeorm|sequelize|mongoose)/iu],
      ["scheduler or worker", /(^bullmq$|^agenda$|scheduler|worker|queue)/iu],
      ["provider SDK", /(^openai$|^@openai|^@anthropic-ai\/sdk$|^@google\/generative-ai$|^@google-genai|gemini)/iu],
      ["billing or user account implementation", /(^stripe$|billing|user-account|accounts)/iu],
      ["recommendation implementation", /(recommendation-engine|recommender)/iu],
      ["ML implementation", /(^@tensorflow|tensorflow|onnx|scikit|ml-engine|machine-learning)/iu]
    ];

    for (const dependencyName of dependencyNames) {
      for (const [label, pattern] of prohibitedDependencyPatterns) {
        if (pattern.test(dependencyName)) {
          fail(`Opportunity Ranking Engine must not depend on ${label}; found ${dependencyName} in ${opportunityRankingPackageJsonPath}`);
        }
      }
    }
  }

  for (const file of listFiles("packages/opportunity-ranking")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/opportunity-ranking/dist/") ||
      file.startsWith("packages/opportunity-ranking/node_modules/") ||
      file.startsWith("packages/opportunity-ranking/.turbo/") ||
      file.includes("/__tests__/")
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["recommendation engine", /\brecommendation engine\b|\brecommendOpportunity\b/iu],
      ["REST API", /\bREST API\b|\bapi route\b|\broute handler\b|\bAPI handler\b/iu],
      ["frontend", /\bReact\b|\btsx\b|\bcomponent\b/iu],
      ["persistence implementation", /\bPrismaClient\b|\brepository implementation\b|\bwriteToDatabase\b|\bpersistOpportunity\b/iu],
      ["scheduler", /\bscheduler\b|\bscheduleRanking\b/iu],
      ["worker", /\bworker\b|\bWorkerProcess\b/iu],
      ["billing", /\bbilling\b|\bStripe\b/iu],
      ["user accounts", /\buser accounts?\b|\bUserAccount\b/iu],
      ["provider SDK", /\bprovider SDK\b|\bOpenAIClient\b|\bAnthropicClient\b|\bGeminiClient\b/iu],
      ["ML behavior", /\bmachine learning\b|\bML model\b|\btrainModel\b|\bpredictWithModel\b/iu],
      ["LLM call", /\bLLM calls?\b|\bcallLlm\b|\bcallLLM\b|\binvokeModel\b|\bgenerateText\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Opportunity Ranking Engine must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertRestApiFoundationPolicy() {
  assertOpportunityRankingFoundationPolicy();

  for (const file of requiredRestApiFoundationFiles) {
    if (!exists(file)) {
      fail(`REST API foundation is missing required file: ${file}`);
    }
  }

  const apiIndexPath = "apps/api/src/index.ts";
  if (exists(apiIndexPath)) {
    const apiIndex = read(apiIndexPath);
    if (!apiIndex.includes("Phase 3 Milestone 26 REST API public export boundary")) {
      fail(`${apiIndexPath} must document the Phase 3 Milestone 26 REST API public export boundary`);
    }

    for (const exportName of requiredRestApiFoundationExports) {
      if (!apiIndex.includes(exportName)) {
        fail(`${apiIndexPath} must export ${exportName} from the REST API public boundary`);
      }
    }
  }

  const apiReadmePath = "apps/api/README.md";
  if (exists(apiReadmePath)) {
    const apiReadme = read(apiReadmePath);
    const requiredBoundaryStatements = [
      "Phase 3 Milestone 26",
      "REST API",
      "API bootstrap",
      "routing",
      "OpenAPI contracts",
      "opportunity endpoints",
      "ranking endpoints",
      "authentication and authorization contracts",
      "production identity providers",
      "storage schema",
      "provider SDKs"
    ];

    for (const statement of requiredBoundaryStatements) {
      if (!apiReadme.includes(statement)) {
        fail(`${apiReadmePath} must document the Phase 3 Milestone 26 REST API boundary: missing "${statement}"`);
      }
    }
  }

  const apiPackageJsonPath = "apps/api/package.json";
  if (exists(apiPackageJsonPath)) {
    const apiPackageJson = JSON.parse(read(apiPackageJsonPath));
    const allowedWorkspaceDependencies = new Set([
      "@opportunity-os/opportunity-ranking",
      "@opportunity-os/opportunity-generation",
      "@opportunity-os/opportunity-candidates",
      "@opportunity-os/opportunity-pipeline",
      "@opportunity-os/opportunity-engine"
    ]);
    const dependencyFields = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
    const prohibitedDependencyPatterns = [
      ["frontend", /(^react$|^react-dom$|^next$|^vite$|frontend|ui)/iu],
      ["billing", /(^stripe$|billing)/iu],
      ["user management", /(user-management|user-account|accounts|clerk|auth0|descope)/iu],
      ["analytics", /(analytics|segment|posthog|amplitude|mixpanel)/iu],
      ["notifications", /(notification|novu|sendgrid|resend|twilio)/iu],
      ["production authentication provider", /(clerk|auth0|descope|passport|next-auth|auth-provider)/iu],
      ["persistence implementation", /(^@prisma\/client$|^prisma$|typeorm|sequelize|mongoose)/iu],
      ["scheduler or worker", /(^bullmq$|^agenda$|scheduler|worker|queue)/iu],
      ["provider SDK", /(^openai$|^@openai|^@anthropic-ai\/sdk$|^@google\/generative-ai$|^@google-genai|gemini)/iu]
    ];

    for (const dependencyField of dependencyFields) {
      const dependencies = apiPackageJson[dependencyField] ?? {};
      for (const dependencyName of Object.keys(dependencies)) {
        if (dependencyName.startsWith("@opportunity-os/") && !allowedWorkspaceDependencies.has(dependencyName)) {
          fail(`${apiPackageJsonPath} may depend only on approved Opportunity OS API upstream packages; found ${dependencyField}.${dependencyName}`);
        }

        for (const [label, pattern] of prohibitedDependencyPatterns) {
          if (pattern.test(dependencyName)) {
            fail(`REST API foundation must not depend on ${label}; found ${dependencyField}.${dependencyName} in ${apiPackageJsonPath}`);
          }
        }
      }
    }
  }

  for (const file of listFiles("apps/api")) {
    if (isReadmePlaceholder(file)) continue;
    if (file.startsWith("apps/api/dist/") || file.startsWith("apps/api/node_modules/") || file.startsWith("apps/api/.turbo/")) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["frontend", /\bReact\b|\btsx\b|\bcomponent\b|\buse client\b/iu],
      ["billing", /\bbilling\b|\bStripe\b/iu],
      ["user management", /\buser management\b|\bUserAccount\b|\buser account\b/iu],
      ["analytics", /\banalytics\b|\bSegment\b|\bPostHog\b|\bAmplitude\b|\bMixpanel\b/iu],
      ["notifications", /\bnotification\b|\bSendGrid\b|\bResend\b|\bTwilio\b/iu],
      ["production authentication provider", /\bClerk\b|\bAuth0\b|\bDescope\b|\bproduction auth provider\b/iu],
      ["persistence changes", /\bPrismaClient\b|\bmigration\b|\bwriteToDatabase\b|\bpersist\w+/iu],
      ["scheduler", /\bscheduler\b|\bschedule\w+/iu],
      ["worker", /\bworker\b|\bWorkerProcess\b/iu],
      ["provider SDK", /\bOpenAIClient\b|\bAnthropicClient\b|\bGeminiClient\b|\bprovider SDK\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`REST API foundation must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertDashboardFoundationPolicy() {
  assertRestApiFoundationPolicy();

  for (const file of requiredDashboardFoundationFiles) {
    if (!exists(file)) {
      fail(`Dashboard MVP foundation is missing required file: ${file}`);
    }
  }

  const webReadmePath = "apps/web/README.md";
  if (exists(webReadmePath)) {
    const webReadme = read(webReadmePath);
    const requiredBoundaryStatements = [
      "Phase 3 Milestone 27",
      "Dashboard MVP",
      "Next.js App Router",
      "apps/api",
      "application bootstrap",
      "routing",
      "layout",
      "navigation",
      "production identity provider wiring",
      "commercial account systems",
      "measurement platforms",
      "external outreach systems",
      "production account management",
      "deployment behavior",
      "storage changes",
      "recommendation engines",
      "mobile apps",
      "runtime jobs",
      "provider SDKs"
    ];

    for (const statement of requiredBoundaryStatements) {
      if (!webReadme.includes(statement)) {
        fail(`${webReadmePath} must document the Phase 3 Milestone 27 Dashboard MVP boundary: missing "${statement}"`);
      }
    }
  }

  const webPackageJsonPath = "apps/web/package.json";
  if (exists(webPackageJsonPath)) {
    const webPackageJson = JSON.parse(read(webPackageJsonPath));
    if (webPackageJson.name !== "@opportunity-os/web") {
      fail(`${webPackageJsonPath} name must be "@opportunity-os/web"`);
    }

    const allowedWorkspaceDependencies = new Set(["@opportunity-os/api"]);
    const allowedFrontendDependencies = new Set([
      "next",
      "react",
      "react-dom",
      "@playwright/test",
      "@types/node",
      "@types/react",
      "@types/react-dom",
      "typescript",
      "vitest"
    ]);
    const dependencyFields = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
    const prohibitedDependencyPatterns = [
      ["authentication provider", /(clerk|auth0|descope|next-auth|passport|auth-provider)/iu],
      ["billing", /(^stripe$|billing)/iu],
      ["analytics", /(analytics|segment|posthog|amplitude|mixpanel)/iu],
      ["notifications", /(notification|novu|sendgrid|resend|twilio)/iu],
      ["persistence implementation", /(^@prisma\/client$|^prisma$|typeorm|sequelize|mongoose)/iu],
      ["scheduler or worker", /(^bullmq$|^agenda$|scheduler|worker|queue)/iu],
      ["provider SDK", /(^openai$|^@openai|^@anthropic-ai\/sdk$|^@google\/generative-ai$|^@google-genai|gemini)/iu],
      ["mobile app", /(react-native|expo|capacitor|cordova)/iu]
    ];

    for (const dependencyField of dependencyFields) {
      const dependencies = webPackageJson[dependencyField] ?? {};
      for (const dependencyName of Object.keys(dependencies)) {
        if (dependencyName.startsWith("@opportunity-os/") && !allowedWorkspaceDependencies.has(dependencyName)) {
          fail(`${webPackageJsonPath} may depend only on approved Opportunity OS Dashboard MVP upstream packages; found ${dependencyField}.${dependencyName}`);
        }

        if (!dependencyName.startsWith("@opportunity-os/") && !allowedFrontendDependencies.has(dependencyName)) {
          fail(`${webPackageJsonPath} has an unapproved Dashboard MVP dependency: ${dependencyField}.${dependencyName}`);
        }

        for (const [label, pattern] of prohibitedDependencyPatterns) {
          if (pattern.test(dependencyName)) {
            fail(`Dashboard MVP foundation must not depend on ${label}; found ${dependencyField}.${dependencyName} in ${webPackageJsonPath}`);
          }
        }
      }
    }
  }

  for (const file of listFiles("apps/web")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("apps/web/.next/") ||
      file.startsWith("apps/web/dist/") ||
      file.startsWith("apps/web/node_modules/") ||
      file.startsWith("apps/web/.turbo/") ||
      file.startsWith("apps/web/test-results/") ||
      file.startsWith("apps/web/playwright-report/")
    ) {
      continue;
    }

    const content = read(file);
    const prohibitedTerms = [
      ["authentication implementation", /\bClerk\b|\bAuth0\b|\bDescope\b|\bnext-auth\b|\bsignIn\b|\bsignOut\b/iu],
      ["billing", /\bbilling\b|\bStripe\b/iu],
      ["analytics", /\banalytics\b|\bSegment\b|\bPostHog\b|\bAmplitude\b|\bMixpanel\b/iu],
      ["notifications", /\bnotification\b|\bSendGrid\b|\bResend\b|\bTwilio\b/iu],
      ["user accounts", /\buser accounts?\b|\bUserAccount\b|\buser management\b/iu],
      ["production deployment", /\bproduction deployment\b|\bvercel deploy\b|\bdeployment target\b/iu],
      ["persistence changes", /\bPrismaClient\b|\bmigration\b|\bwriteToDatabase\b|\bpersist\w+/iu],
      ["recommendation engine", /\brecommendation engine\b|\brecommendOpportunity\b/iu],
      ["mobile app", /\bReact Native\b|\bExpo\b|\bmobile app\b/iu],
      ["scheduler", /\bscheduler\b|\bschedule\w+/iu],
      ["worker", /\bworker\b|\bWorkerProcess\b/iu],
      ["provider SDK", /\bOpenAIClient\b|\bAnthropicClient\b|\bGeminiClient\b|\bprovider SDK\b/iu],
      ["unrelated backend changes", /\bAPI handler\b|\broute handler\b|\bcontroller\b|\bdatabase repository\b/iu]
    ];

    for (const [label, pattern] of prohibitedTerms) {
      if (pattern.test(content)) {
        fail(`Dashboard MVP foundation must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertProductValidationFoundationPolicy() {
  assertDashboardFoundationPolicy();

  for (const file of requiredProductValidationFoundationFiles) {
    if (!exists(file)) {
      fail(`Product Validation Loop foundation is missing required file: ${file}`);
    }
  }

  const apiIndexPath = "apps/api/src/index.ts";
  if (exists(apiIndexPath)) {
    const apiIndex = read(apiIndexPath);
    if (!apiIndex.includes("./feedback/index.js")) {
      fail(`${apiIndexPath} must export the Product Validation Loop feedback boundary from ./feedback/index.js`);
    }
  }

  const productValidationDocs = [
    ["README.md", ["Phase 3 Milestone 28", "Product Validation Loop", "deterministic product validation"]],
    ["CONTRIBUTING.md", ["Phase 3 Milestone 28", "Product Validation Loop", "deterministic product validation"]],
    ["apps/api/README.md", ["Phase 3 Milestone 28", "Product Validation Loop", "feedback vocabulary"]],
    [
      "docs/04_IMPLEMENTATION/04-001_ROADMAP.md",
      ["Phase 3 Milestone 28", "Product Validation Loop", "deterministic product validation"]
    ],
    [
      "docs/05_BOOTSTRAP/05-005_IMPLEMENTATION_ORDER.md",
      ["Phase 3 Milestone 28", "Product Validation Loop", "deterministic product validation"]
    ]
  ];

  for (const [file, requiredStatements] of productValidationDocs) {
    if (!exists(file)) {
      fail(`Product Validation Loop documentation is missing required file: ${file}`);
      continue;
    }

    const content = read(file);
    for (const statement of requiredStatements) {
      if (!content.includes(statement)) {
        fail(`${file} must document the Phase 3 Milestone 28 Product Validation Loop boundary: missing "${statement}"`);
      }
    }
  }

  const prohibitedTerms = [
    ["production persistence", /\bproduction persistence\b|\bPrismaClient\b|\bmigration\b|\bwriteToDatabase\b|\bpersist\w+/iu],
    ["billing", /\bbilling\b|\bStripe\b/iu],
    ["analytics platform", /\banalytics platform\b|\bSegment\b|\bPostHog\b|\bAmplitude\b|\bMixpanel\b/iu],
    ["notifications", /\bnotification\b|\bSendGrid\b|\bTwilio\b/iu],
    ["email integration", /\bemail integration\b|\bemail provider\b|\bResend\b|\bMailchimp\b/iu],
    ["CRM integration", /\bCRM\b|\bSalesforce\b|\bHubSpot\b/iu],
    ["scheduler", /\bscheduler\b|\bschedule\w+/iu],
    ["worker", /\bworker\b|\bWorkerProcess\b/iu],
    ["mobile app", /\bReact Native\b|\bExpo\b|\bmobile app\b/iu],
    ["complex admin console", /\bcomplex admin console\b|\badmin console\b/iu]
  ];

  for (const appRoot of ["apps/api", "apps/web"]) {
    for (const file of listFiles(appRoot)) {
      if (isReadmePlaceholder(file)) continue;
      if (
        file.startsWith(`${appRoot}/dist/`) ||
        file.startsWith(`${appRoot}/node_modules/`) ||
        file.startsWith(`${appRoot}/.turbo/`) ||
        file.startsWith(`${appRoot}/.next/`) ||
        file.startsWith(`${appRoot}/test-results/`) ||
        file.startsWith(`${appRoot}/playwright-report/`)
      ) {
        continue;
      }

      const content = read(file);
      for (const [label, pattern] of prohibitedTerms) {
        if (pattern.test(content)) {
          fail(`Product Validation Loop foundation must not introduce ${label}; found prohibited reference in ${file}`);
        }
      }
    }
  }
}

function assertPrivateBetaFoundationPolicy() {
  assertProductValidationFoundationPolicy();

  for (const file of requiredPrivateBetaFoundationFiles) {
    if (!exists(file)) {
      fail(`Private Beta foundation is missing required file: ${file}`);
    }
  }

  const deployWorkflowPath = ".github/workflows/deploy.yml";
  if (exists(deployWorkflowPath)) {
    const deployWorkflow = read(deployWorkflowPath);
    for (const statement of [
      "phase-3-milestone-29",
      "private-beta",
      "node scripts/verify-repository.mjs --phase phase-3-milestone-29",
      "pnpm lint",
      "pnpm build",
      "pnpm test",
      "docker compose config",
      "production config",
      "secrets management",
      "health monitoring",
      "operational logging",
      "monitoring strategy",
      "backup strategy"
    ]) {
      if (!deployWorkflow.includes(statement)) {
        fail(`${deployWorkflowPath} must define the Private Beta deployment readiness gate: missing "${statement}"`);
      }
    }
  }

  const privateBetaDocs = [
    ["README.md", ["Phase 3 Milestone 29", "Private Beta", "deployment readiness"]],
    ["CONTRIBUTING.md", ["Phase 3 Milestone 29", "Private Beta", "deployment readiness"]],
    ["apps/api/README.md", ["Phase 3 Milestone 29", "Private Beta", "invite-only"]],
    ["apps/web/README.md", ["Phase 3 Milestone 29", "Private Beta", "protected dashboard"]],
    [
      "docs/04_IMPLEMENTATION/04-001_ROADMAP.md",
      ["Phase 3 Milestone 29", "Private Beta", "deployment readiness"]
    ],
    [
      "docs/04_IMPLEMENTATION/04-004_PRIVATE_BETA_DEPLOYMENT.md",
      ["Phase 3 Milestone 29", "Private Beta", "deployment architecture"]
    ],
    [
      "docs/04_IMPLEMENTATION/04-005_PRIVATE_BETA_OPERATIONS.md",
      ["Phase 3 Milestone 29", "Private Beta", "production config", "config binding", "backup strategy", "Rollback Guidance"]
    ],
    [
      "docs/04_IMPLEMENTATION/04-006_PRIVATE_BETA_RUNBOOK.md",
      ["Phase 3 Milestone 29", "Private Beta", "Config Binding", "Deployment Procedure", "Rollback Guidance", "Monitoring Guidance"]
    ],
    [
      "docs/04_IMPLEMENTATION/04-007_PRIVATE_BETA_CHECKLIST.md",
      ["Phase 3 Milestone 29", "Private Beta", "Repository Gate", "Configuration Gate", "Rollback Gate", "Launch Decision"]
    ],
    [
      "docs/05_BOOTSTRAP/05-005_IMPLEMENTATION_ORDER.md",
      ["Phase 3 Milestone 29", "Private Beta", "deployment readiness", "Slice E"]
    ],
    ["config/README.md", ["Private Beta", "production config", "config binding", "config/private-beta.env.example"]],
    ["infrastructure/README.md", ["Private Beta", "deployment workflow", "backup strategy", "rollback guidance"]],
    ["packages/database/README.md", ["Private Beta", "PrivateBetaInvite", "PrivateBetaSession"]],
    ["scripts/README.md", ["Phase 3 Milestone 29", "Private Beta", "deployment readiness", "operational runbook", "beta checklist"]]
  ];

  for (const [file, requiredStatements] of privateBetaDocs) {
    if (!exists(file)) {
      fail(`Private Beta documentation is missing required file: ${file}`);
      continue;
    }

    const content = read(file);
    for (const statement of requiredStatements) {
      if (!content.includes(statement)) {
        fail(`${file} must document the Phase 3 Milestone 29 Private Beta boundary: missing "${statement}"`);
      }
    }
  }

  const prohibitedTerms = [
    ["payments", /\bpayments?\b|\bStripe\b|\bcheckout\b/iu],
    ["subscriptions", /\bsubscriptions?\b|\bsubscription plan\b/iu],
    ["enterprise features", /\benterprise features?\b|\bSAML\b|\bSCIM\b|\benterprise SSO\b/iu],
    ["notifications", /\bnotification\b|\bSendGrid\b|\bResend\b|\bTwilio\b|\bpush notification\b/iu],
    ["CRM", /\bCRM\b|\bSalesforce\b|\bHubSpot\b/iu],
    ["multi-tenancy", /\bmulti-tenan(?:cy|t)\b|\btenant isolation\b|\bTenantId\b/iu]
  ];

  for (const appRoot of ["apps/api", "apps/web"]) {
    for (const file of listFiles(appRoot)) {
      if (isReadmePlaceholder(file)) continue;
      if (
        file.startsWith(`${appRoot}/dist/`) ||
        file.startsWith(`${appRoot}/node_modules/`) ||
        file.startsWith(`${appRoot}/.turbo/`) ||
        file.startsWith(`${appRoot}/.next/`) ||
        file.startsWith(`${appRoot}/test-results/`) ||
        file.startsWith(`${appRoot}/playwright-report/`)
      ) {
        continue;
      }

      const content = read(file);
      for (const [label, pattern] of prohibitedTerms) {
        if (pattern.test(content)) {
          fail(`Private Beta foundation must not introduce ${label}; found prohibited reference in ${file}`);
        }
      }
    }
  }

  const schemaPath = "packages/database/prisma/schema.prisma";
  if (exists(schemaPath)) {
    const schema = read(schemaPath);
    for (const statement of [
      "model PrivateBetaInvite",
      "model PrivateBetaSession",
      "model PrivateBetaFeedback",
      "model PrivateBetaBugReport",
      "@@map(\"private_beta_invites\")",
      "@@map(\"private_beta_sessions\")",
      "@@map(\"private_beta_feedback\")",
      "@@map(\"private_beta_bug_reports\")",
      "inviteCodeHash String"
    ]) {
      if (!schema.includes(statement)) {
        fail(`${schemaPath} must define the Private Beta invite-only persistence schema: missing "${statement}"`);
      }
    }
    for (const prohibitedStatement of ["model UserAccount", "model Subscription", "model Tenant", "inviteCode String"]) {
      if (schema.includes(prohibitedStatement)) {
        fail(`${schemaPath} must not define prohibited Private Beta persistence shape: ${prohibitedStatement}`);
      }
    }
  }

  const migrationPath = "packages/database/prisma/migrations/20260704000000_private_beta_invites_sessions/migration.sql";
  if (exists(migrationPath)) {
    const migration = read(migrationPath);
    for (const statement of [
      'CREATE TABLE "private_beta_invites"',
      'CREATE TABLE "private_beta_sessions"',
      '"inviteCodeHash"'
    ]) {
      if (!migration.includes(statement)) {
        fail(`${migrationPath} must define invite-only authentication persistence: missing "${statement}"`);
      }
    }
    for (const prohibitedPattern of [/\btenant\b/iu, /\bbilling\b/iu, /\bsubscription\b/iu, /"inviteCode"/u]) {
      if (prohibitedPattern.test(migration)) {
        fail(`${migrationPath} must not introduce billing, subscription, multi-tenant, or raw invite-code persistence`);
      }
    }
  }

  const betaFeedbackMigrationPath = "packages/database/prisma/migrations/20260704010000_private_beta_feedback_bug_reports/migration.sql";
  if (exists(betaFeedbackMigrationPath)) {
    const migration = read(betaFeedbackMigrationPath);
    for (const statement of [
      'CREATE TABLE "private_beta_feedback"',
      'CREATE TABLE "private_beta_bug_reports"',
      '"reasonCategories" JSONB',
      '"ratings" JSONB',
      '"safeDescription" TEXT'
    ]) {
      if (!migration.includes(statement)) {
        fail(`${betaFeedbackMigrationPath} must define beta feedback and bug report persistence: missing "${statement}"`);
      }
    }
    for (const prohibitedPattern of [/\btenant\b/iu, /\bbilling\b/iu, /\bsubscription\b/iu]) {
      if (prohibitedPattern.test(migration)) {
        fail(`${betaFeedbackMigrationPath} must not introduce prohibited Private Beta persistence scope`);
      }
    }
  }
}

function assertBetaOperationsFoundationPolicy() {
  assertPrivateBetaFoundationPolicy();

  const betaOperationsDocs = [
    ["README.md", ["Phase 3 Milestone 30", "Beta Operations", "operations-only"]],
    [
      "CONTRIBUTING.md",
      ["Phase 3 Milestone 30", "Beta Operations", "operations-only", "Beta Operations review"]
    ],
    [
      ".github/pull_request_template.md",
      ["Beta Operations review", "Phase 3 Milestone 30", "operations-only"]
    ],
    [
      "docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md",
      ["Phase 3 Milestone 30", "Beta Operations", "04-016_BETA_TROUBLESHOOTING_GUIDE.md"]
    ],
    [
      "docs/04_IMPLEMENTATION/04-001_ROADMAP.md",
      ["Phase 3 Milestone 30", "Beta Operations", "operations-only", "Slice E"]
    ],
    [
      "docs/04_IMPLEMENTATION/README.md",
      ["04-008_BETA_OPERATIONS_VERIFICATION.md", "04-016_BETA_TROUBLESHOOTING_GUIDE.md"]
    ],
    [
      "docs/05_BOOTSTRAP/05-005_IMPLEMENTATION_ORDER.md",
      ["Phase 3 Milestone 30", "Beta Operations", "operations-only", "Slice E"]
    ],
    ["scripts/README.md", ["Phase 3 Milestone 30", "Beta Operations", "phase-3-milestone-30"]],
    [
      "docs/04_IMPLEMENTATION/04-008_BETA_OPERATIONS_VERIFICATION.md",
      ["deployment verification", "smoke", "rollback", "monitoring", "health", "log verification"]
    ],
    [
      "docs/04_IMPLEMENTATION/04-009_BETA_OPERATOR_HANDBOOK.md",
      ["operator", "daily beta operating loop", "launch"]
    ],
    [
      "docs/04_IMPLEMENTATION/04-010_BETA_USER_HANDBOOK.md",
      ["beta user", "Invite", "Onboarding"]
    ],
    [
      "docs/04_IMPLEMENTATION/04-011_BETA_SUPPORT_GUIDE.md",
      ["support", "Bug Triage", "Feature Request", "Feedback Review"]
    ],
    [
      "docs/04_IMPLEMENTATION/04-012_BETA_OPERATIONAL_WORKFLOWS.md",
      ["Bug Triage", "Feature Request", "Feedback Review"]
    ],
    [
      "docs/04_IMPLEMENTATION/04-013_PRODUCTION_READINESS_CHECKLIST.md",
      ["Production Readiness", "Repository Readiness", "Security Readiness"]
    ],
    [
      "docs/04_IMPLEMENTATION/04-014_RELEASE_CHECKLIST.md",
      ["Release Checklist", "Release Notes", "Promotion"]
    ],
    [
      "docs/04_IMPLEMENTATION/04-015_LAUNCH_CHECKLIST.md",
      ["Launch Checklist", "Before Inviting Design Partners", "After Launch"]
    ],
    [
      "docs/04_IMPLEMENTATION/04-016_BETA_TROUBLESHOOTING_GUIDE.md",
      ["Troubleshooting", "Invite Problems", "Operations Problems"]
    ]
  ];

  for (const [file, requiredStatements] of betaOperationsDocs) {
    if (!exists(file)) {
      fail(`Beta Operations documentation is missing required file: ${file}`);
      continue;
    }

    const content = read(file);
    for (const statement of requiredStatements) {
      if (!content.includes(statement)) {
        fail(`${file} must document the Phase 3 Milestone 30 Beta Operations boundary: missing "${statement}"`);
      }
    }
  }

  const prohibitedTerms = [
    ["new backend features", /\bnew backend features?\b|\bbackend feature\b|\bnew service implementation\b/iu],
    ["AI features", /\bAI feature\b|\bAI workflow\b|\bprovider LLM call\b|\bprompt execution\b|\bmodel execution\b/iu],
    ["payments", /\bpayments?\b|\bStripe\b|\bcheckout\b/iu],
    ["CRM", /\bCRM\b|\bSalesforce\b|\bHubSpot\b/iu],
    ["notifications", /\bnotification\b|\bSendGrid\b|\bResend\b|\bTwilio\b|\bpush notification\b/iu],
    ["analytics platform", /\banalytics platform\b|\bSegment\b|\bPostHog\b|\bAmplitude\b|\bMixpanel\b/iu],
    ["mobile app", /\bReact Native\b|\bExpo\b|\bmobile app\b/iu],
    ["scheduler", /\bscheduler\b|\bschedule\w+|\bcron\b/iu],
    ["worker", /\bworker\b|\bWorkerProcess\b|\bqueue consumer\b/iu]
  ];

  for (const implementationRoot of ["apps/api/src", "apps/web/src"]) {
    for (const file of listFiles(implementationRoot)) {
      if (isReadmePlaceholder(file)) continue;
      if (
        file.includes("/__tests__/") ||
        file.includes("/testing/") ||
        file.includes("/dist/") ||
        file.includes("/node_modules/") ||
        file.includes("/.turbo/") ||
        file.includes("/.next/") ||
        file.includes("/test-results/") ||
        file.includes("/playwright-report/")
      ) {
        continue;
      }

      const content = read(file);
      for (const [label, pattern] of prohibitedTerms) {
        if (pattern.test(content)) {
          fail(`Beta Operations must not introduce ${label}; found prohibited reference in ${file}`);
        }
      }
    }
  }
}

function assertLocalProductRuntimePolicy() {
  const requiredRuntimeFiles = [
    "apps/api/src/server.ts",
    "apps/api/src/__tests__/local-server.test.ts",
    "apps/web/src/api/local-data.ts",
    "docs/04_IMPLEMENTATION/04-017_LOCAL_PRODUCT_RUNTIME.md"
  ];

  for (const file of requiredRuntimeFiles) {
    if (!exists(file)) {
      fail(`Local Product Runtime is missing required file: ${file}`);
    }
  }

  const rootPackageJson = JSON.parse(read("package.json"));
  if (rootPackageJson.scripts?.dev !== "turbo run dev --parallel") {
    fail('Local Product Runtime requires root package.json script "dev" to run "turbo run dev --parallel".');
  }
  if (rootPackageJson.scripts?.["dev:api"] !== "pnpm --filter @opportunity-os/api dev") {
    fail('Local Product Runtime requires root package.json script "dev:api" to run the API dev command.');
  }
  if (rootPackageJson.scripts?.["dev:web"] !== "pnpm --filter @opportunity-os/web dev") {
    fail('Local Product Runtime requires root package.json script "dev:web" to run the dashboard dev command.');
  }

  const apiPackageJson = JSON.parse(read("apps/api/package.json"));
  if (apiPackageJson.scripts?.dev !== "pnpm build && node dist/server.js") {
    fail('Local Product Runtime requires apps/api package.json script "dev" to build and start dist/server.js.');
  }
  if (apiPackageJson.scripts?.start !== "node dist/server.js") {
    fail('Local Product Runtime requires apps/api package.json script "start" to run "node dist/server.js".');
  }

  const webPackageJson = JSON.parse(read("apps/web/package.json"));
  if (webPackageJson.scripts?.dev !== "next dev --hostname 127.0.0.1") {
    fail("Local Product Runtime requires apps/web to keep the existing 127.0.0.1 Next.js dev server command.");
  }

  const runtimeDoc = exists("docs/04_IMPLEMENTATION/04-017_LOCAL_PRODUCT_RUNTIME.md")
    ? read("docs/04_IMPLEMENTATION/04-017_LOCAL_PRODUCT_RUNTIME.md")
    : "";
  for (const statement of [
    "pnpm dev:api",
    "pnpm dev:web",
    "pnpm dev",
    "http://127.0.0.1:4000/health",
    "http://127.0.0.1:3000"
  ]) {
    if (!runtimeDoc.includes(statement)) {
      fail(`Local Product Runtime documentation must include "${statement}".`);
    }
  }

  const server = exists("apps/api/src/server.ts") ? read("apps/api/src/server.ts") : "";
  if (!server.includes("createServer")) {
    fail("Local Product Runtime API server must use the Node HTTP server boundary.");
  }
  if (!server.includes("DEFAULT_PORT = 4000")) {
    fail("Local Product Runtime API server must default to port 4000.");
  }

  const localData = exists("apps/web/src/api/local-data.ts") ? read("apps/web/src/api/local-data.ts") : "";
  if (!localData.includes("NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL")) {
    fail("Local Product Runtime dashboard data loader must read NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL.");
  }
  if (!localData.includes("http://127.0.0.1:4000")) {
    fail("Local Product Runtime dashboard data loader must default to http://127.0.0.1:4000.");
  }
  if (!localData.includes("dashboardOpportunityFixtures")) {
    fail("Local Product Runtime dashboard data loader must preserve deterministic fixture fallback.");
  }
}

function assertProductDataSchemaPolicy() {
  assertLocalProductRuntimePolicy();

  const schemaPath = "packages/database/prisma/schema.prisma";
  const migrationPath = "packages/database/prisma/migrations/20260705000000_product_data_schema/migration.sql";
  const requiredModels = [
    "RawSourceContent",
    "NormalizedContent",
    "AnalysisResult",
    "CandidateOpportunityRecord",
    "GeneratedOpportunityRecord",
    "OpportunityRankingResult",
    "OpportunityRankingItem"
  ];
  const requiredTables = [
    "raw_source_content",
    "normalized_content",
    "analysis_results",
    "candidate_opportunity_records",
    "generated_opportunity_records",
    "opportunity_ranking_results",
    "opportunity_ranking_items"
  ];

  if (!exists(schemaPath)) {
    fail("Product Data Schema requires packages/database/prisma/schema.prisma.");
    return;
  }

  const schema = read(schemaPath);
  for (const modelName of requiredModels) {
    if (!new RegExp(`\\bmodel\\s+${modelName}\\b`, "u").test(schema)) {
      fail(`Product Data Schema requires Prisma model ${modelName}.`);
    }
  }
  for (const tableName of requiredTables) {
    if (!schema.includes(`@@map("${tableName}")`)) {
      fail(`Product Data Schema requires table mapping ${tableName}.`);
    }
  }
  if (!schema.includes("opportunityRecordId String?")) {
    fail("Product Data Schema must link private beta feedback to generated opportunity records.");
  }

  for (const [label, pattern] of [
    ["provider ingestion tables", /\bmodel\s+(ProviderIngestion|ProviderRun|IngestionRun)\b/u],
    ["workflow execution tables", /\bmodel\s+WorkflowRun\b/u],
    ["scheduler tables", /\bmodel\s+SchedulerJob\b/u],
    ["worker tables", /\bmodel\s+WorkerJob\b/u],
    ["Prisma repository implementation", /\bPrismaRepository\b/u],
    ["raw provider payload persistence", /\b(providerPayload|rawProviderResponse)\b/u]
  ]) {
    if (pattern.test(schema)) {
      fail(`Product Data Schema must not introduce ${label}.`);
    }
  }

  if (!exists(migrationPath)) {
    fail(`Product Data Schema requires migration: ${migrationPath}`);
    return;
  }

  const migration = read(migrationPath);
  for (const tableName of requiredTables) {
    if (!new RegExp(`\\bCREATE\\s+TABLE\\s+"${tableName}"`, "iu").test(migration)) {
      fail(`Product Data Schema migration must create ${tableName}.`);
    }
  }
  if (!migration.includes('"private_beta_feedback_opportunityRecordId_fkey"')) {
    fail("Product Data Schema migration must add the feedback to generated opportunity foreign key.");
  }
  for (const [label, pattern] of [
    ["provider ingestion tables", /\b(provider_ingestion|provider_run|ingestion_run)\b/iu],
    ["workflow execution tables", /\bworkflow_run\b/iu],
    ["scheduler tables", /\bscheduler\b/iu],
    ["worker tables", /\bworker\b/iu],
    ["raw provider payload persistence", /\b(provider_payload|raw_provider_response)\b/iu]
  ]) {
    if (pattern.test(migration)) {
      fail(`Product Data Schema migration must not introduce ${label}.`);
    }
  }
}

function assertRedditLiveProviderTransportPolicy() {
  assertProductDataSchemaPolicy();

  for (const file of requiredRedditLiveProviderTransportFiles) {
    if (!exists(file)) {
      fail(`Reddit Live Provider Transport is missing required file: ${file}`);
    }
  }

  const providerIndexPath = "packages/connectors-reddit/src/provider/index.ts";
  if (exists(providerIndexPath)) {
    const providerIndex = read(providerIndexPath);
    for (const exportName of requiredRedditLiveProviderTransportExports) {
      if (!providerIndex.includes(exportName)) {
        fail(`${providerIndexPath} must export ${exportName} from the live provider transport boundary`);
      }
    }
  }

  const redditConnectorIndexPath = "packages/connectors-reddit/src/index.ts";
  if (exists(redditConnectorIndexPath)) {
    const redditConnectorIndex = read(redditConnectorIndexPath);
    for (const exportName of requiredRedditLiveProviderTransportExports) {
      if (!redditConnectorIndex.includes(exportName)) {
        fail(`${redditConnectorIndexPath} must export ${exportName} from the Reddit connector package root`);
      }
    }
  }

  const packageJsonPath = "packages/connectors-reddit/package.json";
  if (exists(packageJsonPath)) {
    const packageJson = JSON.parse(read(packageJsonPath));
    if (packageJson.scripts?.["dev:reddit:live"] !== "pnpm build && node dist/provider/live-dev-fetch.js") {
      fail("Reddit Live Provider Transport requires packages/connectors-reddit dev:reddit:live script.");
    }
  }

  const envExample = exists(".env.example") ? read(".env.example") : "";
  for (const envKey of [
    "REDDIT_CLIENT_ID",
    "REDDIT_CLIENT_SECRET",
    "REDDIT_REFRESH_TOKEN",
    "REDDIT_USER_AGENT",
    "REDDIT_LIVE_TEST_ENABLED",
    "REDDIT_LIVE_SUBREDDIT",
    "REDDIT_LIVE_LIMIT"
  ]) {
    if (!envExample.includes(envKey)) {
      fail(`Reddit Live Provider Transport requires .env.example to document ${envKey}.`);
    }
  }

  const redditReadmePath = "packages/connectors-reddit/README.md";
  if (exists(redditReadmePath)) {
    const redditReadme = read(redditReadmePath);
    for (const statement of [
      "Phase 4 Milestone 33",
      "controlled live Reddit provider access",
      "pnpm --filter @opportunity-os/connectors-reddit dev:reddit:live",
      "Default tests do not perform network calls"
    ]) {
      if (!redditReadme.includes(statement)) {
        fail(`${redditReadmePath} must document the Phase 4 Milestone 33 live provider transport boundary: missing "${statement}"`);
      }
    }
  }

  const liveDocPath = "docs/04_IMPLEMENTATION/04-018_REDDIT_LIVE_PROVIDER_TRANSPORT.md";
  if (exists(liveDocPath)) {
    const liveDoc = read(liveDocPath);
    for (const statement of [
      "OAuth token exchange",
      "Node 24 `fetch` based HTTP transport",
      "Default tests never call Reddit",
      "REDDIT_LIVE_TEST_ENABLED=true"
    ]) {
      if (!liveDoc.includes(statement)) {
        fail(`${liveDocPath} must document Reddit live provider transport: missing "${statement}"`);
      }
    }
  }

  for (const file of listFiles("packages/connectors-reddit/src")) {
    if (!file.endsWith(".ts")) continue;
    if (file.includes("/__tests__/")) continue;
    const content = read(file);
    for (const [label, pattern] of [
      ["Raw Content persistence", /\bRawContentRepository\b|\braw content persistence\b/iu],
      ["Prisma repository implementation", /\bPrismaClient\b|\bPrismaRepository\b/iu],
      ["AI workflow", /\bAIWorkflow\b|\bai workflow\b|\bprompt execution\b|\bLLM\b/iu],
      ["opportunity generation", /\bgenerateOpportunity\b|\bOpportunityGenerationService\b/iu],
      ["REST API", /\broute handler\b|\bREST API\b|\bcreateServer\b/iu],
      ["frontend changes", /\bReact\b|\btsx\b|\bcomponent\b/iu],
      ["scheduler", /\bscheduler\b|\bscheduleJob\b/iu],
      ["worker", /\bWorkerProcess\b|\bworker process\b/iu],
      ["business logic", /\bbusiness scoring\b|\brecommendation engine\b/iu]
    ]) {
      if (pattern.test(content)) {
        fail(`Reddit Live Provider Transport must not introduce ${label}; found prohibited reference in ${file}`);
      }
    }
  }
}

function assertExternalMvpRuntimePolicy() {
  assertRedditLiveProviderTransportPolicy();

  const externalRuntimeDocPath = "docs/04_IMPLEMENTATION/04-021_EXTERNAL_MVP_RUNTIME.md";
  if (!exists(externalRuntimeDocPath)) {
    fail(`External MVP Runtime is missing required documentation: ${externalRuntimeDocPath}`);
  }

  if (exists(externalRuntimeDocPath)) {
    const externalRuntimeDoc = read(externalRuntimeDocPath);
    for (const statement of [
      "Phase 4 Milestone 34",
      "hosted external MVP runtime",
      "production environment contract",
      "external URL verification",
      "Secrets must never be committed"
    ]) {
      if (!externalRuntimeDoc.includes(statement)) {
        fail(`${externalRuntimeDocPath} must document the Phase 4 Milestone 34 external runtime boundary: missing "${statement}"`);
      }
    }
  }

  const deployWorkflowPath = ".github/workflows/deploy.yml";
  if (!exists(deployWorkflowPath)) {
    fail("External MVP Runtime requires .github/workflows/deploy.yml.");
  }

  if (exists(deployWorkflowPath)) {
    const deployWorkflow = read(deployWorkflowPath);
    for (const statement of [
      "external-mvp",
      "phase-4-milestone-34",
      "pnpm lint",
      "pnpm build",
      "pnpm test",
      "docker compose config",
      "External URL verification"
    ]) {
      if (!deployWorkflow.includes(statement)) {
        fail(`${deployWorkflowPath} must document the hosted external MVP deployment gate: missing "${statement}"`);
      }
    }
  }

  const envExample = exists(".env.example") ? read(".env.example") : "";
  for (const envKey of [
    "OPPORTUNITY_OS_API_URL",
    "OPPORTUNITY_OS_WEB_URL",
    "NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL",
    "LLM_PROVIDER",
    "LLM_MODEL",
    "LLM_LIVE_ANALYSIS_ENABLED",
    "LLM_PROVIDER_TIMEOUT_MS"
  ]) {
    if (!envExample.includes(envKey)) {
      fail(`External MVP Runtime requires .env.example to document ${envKey}.`);
    }
  }

  for (const file of [
    "packages/llm-analysis/src/provider/live-config.ts",
    "packages/llm-analysis/src/provider/live-prompt-boundary.ts",
    "packages/llm-analysis/src/provider/openai-live-adapter.ts",
    "packages/llm-analysis/src/provider/live-smoke.ts",
    "packages/llm-analysis/src/__tests__/live-provider.test.ts",
    "packages/llm-analysis/src/__tests__/live-provider-security.test.ts"
  ]) {
    if (!exists(file)) {
      fail(`External MVP Runtime requires live LLM integration file: ${file}`);
    }
  }

  const llmAnalysisProviderIndexPath = "packages/llm-analysis/src/provider/index.ts";
  if (exists(llmAnalysisProviderIndexPath)) {
    const providerIndex = read(llmAnalysisProviderIndexPath);
    for (const exportName of [
      "createLiveLlmProviderConfigFromEnv",
      "createLiveLlmPromptBoundary",
      "createOpenAiLiveLlmProviderAdapter"
    ]) {
      if (!providerIndex.includes(exportName)) {
        fail(`${llmAnalysisProviderIndexPath} must export ${exportName} from the live LLM provider boundary`);
      }
    }
  }

  const llmAnalysisPackageJsonPath = "packages/llm-analysis/package.json";
  if (exists(llmAnalysisPackageJsonPath)) {
    const llmAnalysisPackageJson = JSON.parse(read(llmAnalysisPackageJsonPath));
    if (llmAnalysisPackageJson.scripts?.["dev:llm:live"] !== "pnpm build && node dist/provider/live-smoke.js") {
      fail(`${llmAnalysisPackageJsonPath} must define dev:llm:live as the env-gated live LLM smoke command`);
    }
  }

  const llmAnalysisReadmePath = "packages/llm-analysis/README.md";
  if (exists(llmAnalysisReadmePath)) {
    const llmAnalysisReadme = read(llmAnalysisReadmePath);
    for (const statement of [
      "Phase 4 Milestone 34 Slice C",
      "env-gated live provider adapter",
      "LLM_LIVE_ANALYSIS_ENABLED=true",
      "OPENAI_API_KEY",
      "dev:llm:live"
    ]) {
      if (!llmAnalysisReadme.includes(statement)) {
        fail(`${llmAnalysisReadmePath} must document live LLM integration: missing "${statement}"`);
      }
    }
  }

  const healthRoutePath = "apps/api/src/routes/health/health-route.ts";
  const healthSchemaPath = "apps/api/src/routes/health/health-schema.ts";
  for (const file of [healthRoutePath, healthSchemaPath]) {
    if (!exists(file)) {
      fail(`External MVP Runtime requires production health check file: ${file}`);
    }
  }
  if (exists(healthSchemaPath)) {
    const healthSchema = read(healthSchemaPath);
    for (const field of ["environment", "dependencies", "safeMessage"]) {
      if (!healthSchema.includes(field)) {
        fail(`${healthSchemaPath} must expose production health field "${field}".`);
      }
    }
  }

  const externalRuntimeSourceRoots = [
    ...fs.readdirSync(path.join(root, "apps"), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => `apps/${entry.name}/src`),
    ...fs.readdirSync(path.join(root, "packages"), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => `packages/${entry.name}/src`)
  ].filter((sourceRoot) => exists(sourceRoot));

  for (const sourceRoot of externalRuntimeSourceRoots) {
    for (const file of listFiles(sourceRoot)) {
      if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue;
      if (file.includes("/__tests__/") || file.includes("/testing/") || file.includes("/fixtures/")) continue;
      const content = read(file);
      for (const [label, pattern] of [
        ["YouTube connector", /\bYouTube\b|\byoutube\b/iu],
        ["X connector", /\bTwitter\b|\bX connector\b|\bx connector\b/iu],
        ["Product Hunt connector", /\bProduct Hunt\b|\bProductHunt\b/iu],
        ["scheduler", /\bscheduler\b|\bscheduleJob\b/iu],
        ["worker", /\bWorkerProcess\b|\bworker process\b/iu],
        ["billing", /\bbilling\b|\bsubscription\b|\bpayment\b/iu],
        ["CRM", /\bCRM\b|crm integration/iu],
        ["notification system", /\bnotification system\b|\bpush notification\b|\bemail notification\b/iu],
        ["multi-tenancy", /\bmulti-tenant\b|\bmultitenancy\b/iu],
        ["complex admin console", /\badmin console\b|\bAdminConsole\b/iu]
      ]) {
        if (pattern.test(content)) {
          fail(`External MVP Runtime must not introduce ${label}; found prohibited reference in ${file}`);
        }
      }
    }
  }
}

for (const file of requiredFoundationFiles) {
  if (!exists(file)) fail(`Missing foundation file: ${file}`);
}

for (const file of requiredReadmes) {
  if (!exists(file)) fail(`Missing README file: ${file}`);
}

if (exists("package.json")) {
  try {
    const packageJson = JSON.parse(read("package.json"));
    if (packageJson.packageManager !== expectedPackageManager) {
      fail(`package.json packageManager must be "${expectedPackageManager}" but found "${packageJson.packageManager ?? "missing"}"`);
    }
    if (packageJson.engines?.node !== expectedNodeEngine) {
      fail(`package.json engines.node must be "${expectedNodeEngine}" but found "${packageJson.engines?.node ?? "missing"}"`);
    }
    if (packageJson.engines?.pnpm !== expectedPnpmEngine) {
      fail(`package.json engines.pnpm must be "${expectedPnpmEngine}" but found "${packageJson.engines?.pnpm ?? "missing"}"`);
    }
  } catch (error) {
    fail(`package.json must be valid JSON: ${error.message}`);
  }
}

for (const versionFile of [".node-version", ".nvmrc"]) {
  if (exists(versionFile) && readTrimmed(versionFile) !== expectedNodeVersion) {
    fail(`${versionFile} must contain "${expectedNodeVersion}" but found "${readTrimmed(versionFile)}"`);
  }
}

function isReadmePlaceholder(file) {
  return path.basename(file) === "README.md";
}

function isAllowedPhaseImplementationFile(file) {
  const allowedImplementationRoots = isPhaseThirtyFour
    ? allowedPhaseThirtyFourImplementationRoots
    : isPhaseThirtyThree
    ? allowedPhaseThirtyThreeImplementationRoots
    : isPhaseThirtyTwo
    ? allowedPhaseThirtyTwoImplementationRoots
    : isPhaseThirtyOne
    ? allowedPhaseThirtyOneImplementationRoots
    : isPhaseThirty
      ? allowedPhaseThirtyImplementationRoots
    : isPhaseTwentyNine
    ? allowedPhaseTwentyNineImplementationRoots
    : isPhaseTwentyEight
    ? allowedPhaseTwentyEightImplementationRoots
    : isPhaseTwentySeven
    ? allowedPhaseTwentySevenImplementationRoots
    : isPhaseTwentySix
    ? allowedPhaseTwentySixImplementationRoots
    : isPhaseTwentyFive
    ? allowedPhaseTwentyFiveImplementationRoots
    : isPhaseTwentyFour
    ? allowedPhaseTwentyFourImplementationRoots
    : isPhaseTwentyThree
    ? allowedPhaseTwentyThreeImplementationRoots
    : isPhaseTwentyTwo
    ? allowedPhaseTwentyTwoImplementationRoots
    : isPhaseTwentyOne
    ? allowedPhaseTwentyOneImplementationRoots
    : isPhaseTwenty
    ? allowedPhaseTwentyImplementationRoots
    : isPhaseNineteen
    ? allowedPhaseNineteenImplementationRoots
    : isPhaseEighteen
    ? allowedPhaseEighteenImplementationRoots
    : isPhaseSeventeen
    ? allowedPhaseSeventeenImplementationRoots
    : isPhaseSixteen
    ? allowedPhaseSixteenImplementationRoots
    : isPhaseFifteen
    ? allowedPhaseFifteenImplementationRoots
    : isPhaseFourteen
    ? allowedPhaseFourteenImplementationRoots
    : isPhaseThirteen
    ? allowedPhaseThirteenImplementationRoots
    : isPhaseTwelve
    ? allowedPhaseTwelveImplementationRoots
    : isPhaseEleven
    ? allowedPhaseElevenImplementationRoots
    : isPhaseTen
    ? allowedPhaseTenImplementationRoots
    : isPhaseNine
    ? allowedPhaseNineImplementationRoots
    : isPhaseEight
    ? allowedPhaseEightImplementationRoots
    : isPhaseSeven
    ? allowedPhaseSevenImplementationRoots
    : isPhaseSix
    ? allowedPhaseSixImplementationRoots
    : isPhaseFive
    ? allowedPhaseFiveImplementationRoots
    : isPhaseFour
    ? allowedPhaseFourImplementationRoots
    : isPhaseTwo
    ? allowedPhaseTwoImplementationRoots
    : allowedPhaseOneImplementationRoots;

  return allowedImplementationRoots.some((implementationRoot) => file.startsWith(`${implementationRoot}/`)) && !isReadmePlaceholder(file);
}

for (const placeholderRoot of placeholderOnlyRoots) {
  for (const file of listFiles(placeholderRoot)) {
    if (isReadmePlaceholder(file)) continue;
    if ((isPhaseOne || isPhaseTwo) && isAllowedPhaseImplementationFile(file)) continue;

    const policyName = isPhaseOne || isPhaseTwo
      ? `Phase ${isPhaseTwo ? (isPhaseThirty ? "3 Milestone 30" : isPhaseTwentyNine ? "3 Milestone 29" : isPhaseTwentyEight ? "3 Milestone 28" : isPhaseTwentySeven ? "3 Milestone 27" : isPhaseTwentySix ? "3 Milestone 26" : isPhaseTwentyFive ? "3 Milestone 25" : isPhaseTwentyFour ? "2 Milestone 24" : isPhaseTwentyThree ? "2 Milestone 23" : isPhaseTwentyTwo ? "2 Milestone 22" : isPhaseTwentyOne ? "2 Milestone 21" : isPhaseTwenty ? "2 Milestone 20" : isPhaseNineteen ? "2 Milestone 19" : isPhaseEighteen ? "2 Milestone 18" : isPhaseSeventeen ? "2 Milestone 17" : isPhaseSixteen ? "2 Milestone 16" : isPhaseFifteen ? "2 Milestone 15" : isPhaseFourteen ? "2 Milestone 14" : isPhaseThirteen ? "2 Milestone 13" : isPhaseTwelve ? "2 Milestone 12" : isPhaseEleven ? "2 Milestone 11" : isPhaseTen ? "2 Milestone 10" : isPhaseNine ? "1 Milestone 9" : isPhaseEight ? "1 Milestone 8" : isPhaseSeven ? "1 Milestone 7" : isPhaseSix ? "1 Milestone 6" : isPhaseFive ? "1 Milestone 5" : isPhaseFour ? "1 Milestone 4" : isPhaseThree ? "1 Milestone 3" : "1 Milestone 2") : "1 Milestone 1"} permits implementation files only inside ${JSON.stringify(isPhaseThirty ? allowedPhaseThirtyImplementationRoots : isPhaseTwentyNine ? allowedPhaseTwentyNineImplementationRoots : isPhaseTwentyEight ? allowedPhaseTwentyEightImplementationRoots : isPhaseTwentySeven ? allowedPhaseTwentySevenImplementationRoots : isPhaseTwentySix ? allowedPhaseTwentySixImplementationRoots : isPhaseTwentyFive ? allowedPhaseTwentyFiveImplementationRoots : isPhaseTwentyFour ? allowedPhaseTwentyFourImplementationRoots : isPhaseTwentyThree ? allowedPhaseTwentyThreeImplementationRoots : isPhaseTwentyTwo ? allowedPhaseTwentyTwoImplementationRoots : isPhaseTwentyOne ? allowedPhaseTwentyOneImplementationRoots : isPhaseTwenty ? allowedPhaseTwentyImplementationRoots : isPhaseNineteen ? allowedPhaseNineteenImplementationRoots : isPhaseEighteen ? allowedPhaseEighteenImplementationRoots : isPhaseSeventeen ? allowedPhaseSeventeenImplementationRoots : isPhaseSixteen ? allowedPhaseSixteenImplementationRoots : isPhaseFifteen ? allowedPhaseFifteenImplementationRoots : isPhaseFourteen ? allowedPhaseFourteenImplementationRoots : isPhaseThirteen ? allowedPhaseThirteenImplementationRoots : isPhaseTwelve ? allowedPhaseTwelveImplementationRoots : isPhaseEleven ? allowedPhaseElevenImplementationRoots : isPhaseTen ? allowedPhaseTenImplementationRoots : isPhaseNine ? allowedPhaseNineImplementationRoots : isPhaseEight ? allowedPhaseEightImplementationRoots : isPhaseSeven ? allowedPhaseSevenImplementationRoots : isPhaseSix ? allowedPhaseSixImplementationRoots : isPhaseFive ? allowedPhaseFiveImplementationRoots : isPhaseFour ? allowedPhaseFourImplementationRoots : isPhaseTwo ? allowedPhaseTwoImplementationRoots : allowedPhaseOneImplementationRoots)}`
      : `Phase 0 placeholder directory "${placeholderRoot}/" may only contain README.md files`;
    fail(`${policyName}; found unauthorized file: ${file}`);
  }
}

for (const [packageRoot, packageRule] of Object.entries(sharedFoundationPackageRules)) {
  assertSharedFoundationPackageDependencies(packageRoot, packageRule);
}

if (isPhaseThirtyFour) {
  assertExternalMvpRuntimePolicy();
} else if (isPhaseThirtyThree) {
  assertRedditLiveProviderTransportPolicy();
} else if (isPhaseThirtyTwo) {
  assertProductDataSchemaPolicy();
} else if (isPhaseThirtyOne) {
  assertLocalProductRuntimePolicy();
} else if (isPhaseThirty) {
  assertBetaOperationsFoundationPolicy();
} else if (isPhaseTwentyNine) {
  assertPrivateBetaFoundationPolicy();
} else if (isPhaseTwentyEight) {
  assertProductValidationFoundationPolicy();
} else if (isPhaseTwentySeven) {
  assertDashboardFoundationPolicy();
} else if (isPhaseTwentySix) {
  assertRestApiFoundationPolicy();
} else if (isPhaseTwentyFive) {
  assertOpportunityRankingFoundationPolicy();
} else if (isPhaseTwentyFour) {
  assertOpportunityGenerationFoundationPolicy();
} else if (isPhaseTwentyThree) {
  assertOpportunityCandidatesFoundationPolicy();
} else if (isPhaseTwentyTwo) {
  assertOpportunityPipelineFoundationPolicy();
} else if (isPhaseTwentyOne) {
  assertOpportunityEngineFoundationPolicy();
} else if (isPhaseTwenty) {
  assertStructuredAnalysisFoundationPolicy();
} else if (isPhaseNineteen) {
  assertLlmAnalysisFoundationPolicy();
} else if (isPhaseEighteen) {
  assertEmbeddingFoundationPolicy();
} else if (isPhaseSeventeen) {
  assertNormalizationFoundationPolicy();
} else if (isPhaseSixteen) {
  assertRawContentFoundationPolicy();
} else if (isPhaseFifteen) {
  assertRedditProviderTransportPolicy();
} else if (isPhaseFourteen) {
  assertRedditRuntimeFoundationPolicy();
} else if (isPhaseThirteen) {
  assertRedditConnectorFoundationPolicy();
} else if (isPhaseTwelve) {
  assertConnectorHostFoundationPolicy();
} else if (isPhaseEleven) {
  assertConnectorRuntimeFoundationPolicy();
} else if (isPhaseTen) {
  assertConnectorSdkFoundationPolicy();
} else if (isPhaseNine) {
  assertInfrastructureFoundationPolicy();
} else if (isPhaseEight) {
  assertContainerFoundationPolicy();
} else if (isPhaseSeven) {
  assertApplicationFoundationPolicy();
} else if (isPhaseSix) {
  assertDomainFoundationPolicy();
} else if (isPhaseFive) {
  assertDatabaseFoundationPolicy();
} else if (isPhaseFour) {
  assertEventFoundationPolicy();
} else if (isPhaseThree) {
  assertLoggingImplementationPolicy();
}

const envExampleVariables = parseEnvExampleVariables(".env.example");
const envExampleSchemaVariables = envExampleVariables.filter(
  (variableName) => !engineeringKitDevOnlyEnvironmentVariables.includes(variableName)
);
const schemaRequiredVariables = parseExportedConstArray("packages/config/src/schema.ts", "REQUIRED_ENVIRONMENT_VARIABLES");
const schemaOptionalVariables = parseExportedConstArray("packages/config/src/schema.ts", "OPTIONAL_ENVIRONMENT_VARIABLES");
const schemaVariables = [...schemaRequiredVariables, ...schemaOptionalVariables];
const engineeringKitEnvironmentVariables = [
  ...engineeringKitRequiredEnvironmentVariables,
  ...engineeringKitOptionalEnvironmentVariables
];

assertNoDuplicateVariables(".env.example", envExampleVariables);
assertNoDuplicateVariables("packages/config schema required variables", schemaRequiredVariables);
assertNoDuplicateVariables("packages/config schema optional variables", schemaOptionalVariables);
assertSameVariableSet(".env.example", engineeringKitEnvironmentVariables, envExampleSchemaVariables);
assertSameVariableSet("packages/config required environment schema", engineeringKitRequiredEnvironmentVariables, schemaRequiredVariables);
assertSameVariableSet("packages/config optional environment schema", engineeringKitOptionalEnvironmentVariables, schemaOptionalVariables);
assertSameVariableSet("packages/config schema and .env.example", envExampleSchemaVariables, schemaVariables);

const docsFiles = listMarkdownFiles("docs").filter((file) => path.basename(file) !== "README.md");
const developerAiFiles = listMarkdownFiles("developer-ai").filter((file) => path.basename(file) !== "README.md");
const markdownFiles = [
  ...docsFiles,
  ...developerAiFiles,
  "README.md",
  "CONTRIBUTING.md",
  "CHANGELOG.md",
  "RELEASE_NOTES.md",
  "CONVERSION_REPORT.md"
].filter(exists);

const markdownByBaseName = new Map();
for (const file of [...docsFiles, ...developerAiFiles, "README.md", "CHANGELOG.md", "RELEASE_NOTES.md", "CONVERSION_REPORT.md"]) {
  const baseName = path.basename(file);
  const entries = markdownByBaseName.get(baseName) ?? [];
  entries.push(file);
  markdownByBaseName.set(baseName, entries);
}

for (const file of docsFiles) {
  const match = file.match(/^docs\/(\d{2})_[^/]+\/(\d{2})-(\d{3})_.+\.md$/);
  if (!match) {
    fail(`Documentation file is not numbered correctly: ${file}`);
    continue;
  }
  if (match[1] !== match[2]) {
    fail(`Folder number does not match document number: ${file}`);
  }
  const firstLine = read(file).split(/\r?\n/, 1)[0];
  if (firstLine !== `# ${path.basename(file)}`) {
    fail(`First heading does not match file name: ${file}`);
  }
}

const docsBySection = new Map();
for (const file of docsFiles) {
  const match = file.match(/^docs\/(\d{2})_[^/]+\/\d{2}-(\d{3})_.+\.md$/);
  if (!match) continue;
  const entries = docsBySection.get(match[1]) ?? [];
  entries.push(Number(match[2]));
  docsBySection.set(match[1], entries);
}

for (const [section, numbers] of docsBySection.entries()) {
  const sorted = numbers.toSorted((a, b) => a - b);
  for (let index = 0; index < sorted.length; index += 1) {
    const expected = index + 1;
    if (sorted[index] !== expected) {
      fail(`Document numbering gap in docs section ${section}: expected ${String(expected).padStart(3, "0")}`);
      break;
    }
  }
}

function resolvesReference(reference) {
  const cleanReference = reference.replace(/[`)>\]}.,;:]+$/u, "");
  if (cleanReference.startsWith("http://") || cleanReference.startsWith("https://") || cleanReference.startsWith("#")) {
    return true;
  }
  if (cleanReference.startsWith("developer-ai/") || cleanReference.startsWith("docs/")) {
    return exists(cleanReference);
  }
  if (cleanReference.startsWith(".ai/")) {
    return false;
  }
  if (exists(cleanReference)) {
    return true;
  }
  const baseName = path.basename(cleanReference);
  if (markdownByBaseName.has(baseName)) {
    return true;
  }
  return [...markdownByBaseName.keys()].some((knownBaseName) => knownBaseName.endsWith(`_${baseName}`));
}

const referencePattern = /(?<![A-Za-z0-9_.-])(?:\.ai\/|developer-ai\/|docs\/)?[A-Za-z0-9_./-]+\.md/g;

for (const file of markdownFiles) {
  const content = read(file);
  for (const match of content.matchAll(referencePattern)) {
    const reference = match[0];
    if (!resolvesReference(reference)) {
      fail(`Broken Markdown reference in ${file}: ${reference}`);
    }
  }
  if (content.includes(".ai/")) {
    fail(`Legacy .ai path reference found in ${file}`);
  }
}

if (errors.length > 0) {
  console.error("Repository verification failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Repository verification passed (${phase}).`);
