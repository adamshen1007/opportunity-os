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
  "packages/events/README.md",
  "packages/infrastructure/README.md",
  "packages/intelligence/README.md",
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
const phaseFourteenAliases = new Set(["review", "phase-2-milestone-14", "reddit-runtime-foundation", "reddit-connector-runtime-implementation"]);
const phaseFifteenAliases = new Set(["phase-2-milestone-15", "reddit-provider-transport"]);
const isPhaseOne = phaseOneAliases.has(phase);
const isPhaseFifteen = phaseFifteenAliases.has(phase);
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
  "LANGSMITH_API_KEY"
];

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readTrimmed(relativePath) {
  return read(relativePath).trim();
}

function listMarkdownFiles(dir) {
  const absoluteDir = path.join(root, dir);
  if (!fs.existsSync(absoluteDir)) return [];
  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
  return entries.flatMap((entry) => {
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
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") {
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

  for (const file of listFiles("packages/connectors-reddit")) {
    if (isReadmePlaceholder(file)) continue;
    if (
      file.startsWith("packages/connectors-reddit/dist/") ||
      file.startsWith("packages/connectors-reddit/node_modules/") ||
      file.startsWith("packages/connectors-reddit/.turbo/") ||
      file.includes("/__tests__/")
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
  const allowedImplementationRoots = isPhaseFifteen
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
      ? `Phase ${isPhaseTwo ? (isPhaseFifteen ? "2 Milestone 15" : isPhaseFourteen ? "2 Milestone 14" : isPhaseThirteen ? "2 Milestone 13" : isPhaseTwelve ? "2 Milestone 12" : isPhaseEleven ? "2 Milestone 11" : isPhaseTen ? "2 Milestone 10" : isPhaseNine ? "1 Milestone 9" : isPhaseEight ? "1 Milestone 8" : isPhaseSeven ? "1 Milestone 7" : isPhaseSix ? "1 Milestone 6" : isPhaseFive ? "1 Milestone 5" : isPhaseFour ? "1 Milestone 4" : isPhaseThree ? "1 Milestone 3" : "1 Milestone 2") : "1 Milestone 1"} permits implementation files only inside ${JSON.stringify(isPhaseFifteen ? allowedPhaseFifteenImplementationRoots : isPhaseFourteen ? allowedPhaseFourteenImplementationRoots : isPhaseThirteen ? allowedPhaseThirteenImplementationRoots : isPhaseTwelve ? allowedPhaseTwelveImplementationRoots : isPhaseEleven ? allowedPhaseElevenImplementationRoots : isPhaseTen ? allowedPhaseTenImplementationRoots : isPhaseNine ? allowedPhaseNineImplementationRoots : isPhaseEight ? allowedPhaseEightImplementationRoots : isPhaseSeven ? allowedPhaseSevenImplementationRoots : isPhaseSix ? allowedPhaseSixImplementationRoots : isPhaseFive ? allowedPhaseFiveImplementationRoots : isPhaseFour ? allowedPhaseFourImplementationRoots : isPhaseTwo ? allowedPhaseTwoImplementationRoots : allowedPhaseOneImplementationRoots)}`
      : `Phase 0 placeholder directory "${placeholderRoot}/" may only contain README.md files`;
    fail(`${policyName}; found unauthorized file: ${file}`);
  }
}

for (const [packageRoot, packageRule] of Object.entries(sharedFoundationPackageRules)) {
  assertSharedFoundationPackageDependencies(packageRoot, packageRule);
}

if (isPhaseThree) {
  assertLoggingImplementationPolicy();
}

if (isPhaseFour) {
  assertEventFoundationPolicy();
}

if (isPhaseFive) {
  assertDatabaseFoundationPolicy();
}

if (isPhaseSix) {
  assertDomainFoundationPolicy();
}

if (isPhaseSeven) {
  assertApplicationFoundationPolicy();
}

if (isPhaseEight) {
  assertContainerFoundationPolicy();
}

if (isPhaseNine) {
  assertInfrastructureFoundationPolicy();
}

if (isPhaseTen) {
  assertConnectorSdkFoundationPolicy();
}

if (isPhaseEleven) {
  assertConnectorRuntimeFoundationPolicy();
}

if (isPhaseTwelve) {
  assertConnectorHostFoundationPolicy();
}

if (isPhaseThirteen) {
  assertRedditConnectorFoundationPolicy();
}

if (isPhaseFourteen) {
  assertRedditRuntimeFoundationPolicy();
}

if (isPhaseFifteen) {
  assertRedditProviderTransportPolicy();
}

const envExampleVariables = parseEnvExampleVariables(".env.example");
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
assertSameVariableSet(".env.example", engineeringKitEnvironmentVariables, envExampleVariables);
assertSameVariableSet("packages/config required environment schema", engineeringKitRequiredEnvironmentVariables, schemaRequiredVariables);
assertSameVariableSet("packages/config optional environment schema", engineeringKitOptionalEnvironmentVariables, schemaOptionalVariables);
assertSameVariableSet("packages/config schema and .env.example", envExampleVariables, schemaVariables);

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
