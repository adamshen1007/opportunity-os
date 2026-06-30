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
  "packages/config/README.md",
  "packages/database/README.md",
  "packages/domain/README.md",
  "packages/events/README.md",
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
const phaseSevenAliases = new Set(["review", "phase-1-milestone-7", "application-foundation"]);
const isPhaseOne = phaseOneAliases.has(phase);
const isPhaseTwo = phaseTwoAliases.has(phase) || phaseThreeAliases.has(phase) || phaseFourAliases.has(phase) || phaseFiveAliases.has(phase) || phaseSixAliases.has(phase) || phaseSevenAliases.has(phase);
const isPhaseThree = phaseThreeAliases.has(phase) || phaseFourAliases.has(phase) || phaseFiveAliases.has(phase) || phaseSixAliases.has(phase) || phaseSevenAliases.has(phase);
const isPhaseFour = phaseFourAliases.has(phase) || phaseFiveAliases.has(phase) || phaseSixAliases.has(phase) || phaseSevenAliases.has(phase);
const isPhaseFive = phaseFiveAliases.has(phase) || phaseSixAliases.has(phase) || phaseSevenAliases.has(phase);
const isPhaseSix = phaseSixAliases.has(phase) || phaseSevenAliases.has(phase);
const isPhaseSeven = phaseSevenAliases.has(phase);
const allowedPhaseOneImplementationRoots = ["packages/config"];
const allowedPhaseTwoImplementationRoots = ["packages/config", "packages/types", "packages/errors", "packages/utils", "packages/shared"];
const allowedPhaseFourImplementationRoots = [...allowedPhaseTwoImplementationRoots, "packages/events"];
const allowedPhaseFiveImplementationRoots = [...allowedPhaseFourImplementationRoots, "packages/database"];
const allowedPhaseSixImplementationRoots = [...allowedPhaseFiveImplementationRoots, "packages/domain"];
const allowedPhaseSevenImplementationRoots = [...allowedPhaseSixImplementationRoots, "packages/application"];
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
      ["frontend implementation", /\bReact\b|\btsx\b|\bcomponent\b/iu],
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
      ["frontend implementation", /\bReact\b|\btsx\b|\bcomponent\b/iu],
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
  const allowedImplementationRoots = isPhaseSeven
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
      ? `Phase ${isPhaseTwo ? (isPhaseSeven ? "1 Milestone 7" : isPhaseSix ? "1 Milestone 6" : isPhaseFive ? "1 Milestone 5" : isPhaseFour ? "1 Milestone 4" : isPhaseThree ? "1 Milestone 3" : "1 Milestone 2") : "1 Milestone 1"} permits implementation files only inside ${JSON.stringify(isPhaseSeven ? allowedPhaseSevenImplementationRoots : isPhaseSix ? allowedPhaseSixImplementationRoots : isPhaseFive ? allowedPhaseFiveImplementationRoots : isPhaseFour ? allowedPhaseFourImplementationRoots : isPhaseTwo ? allowedPhaseTwoImplementationRoots : allowedPhaseOneImplementationRoots)}`
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
