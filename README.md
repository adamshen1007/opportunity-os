# Opportunity OS

Opportunity OS is currently an Engineering Kit and repository foundation. The repository is prepared for future implementation, but it intentionally does not contain application code, business logic, connectors, APIs, or AI workflows yet.

## Start Here

1. Read `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md`.
2. Read `developer-ai/00_CONTEXT/MISSION.md`.
3. Read `docs/05_BOOTSTRAP/05-001_TECH_STACK.md`.
4. Read `docs/05_BOOTSTRAP/05-002_REPOSITORY_STRUCTURE.md`.
5. Read `docs/05_BOOTSTRAP/05-005_IMPLEMENTATION_ORDER.md`.
6. Use the relevant specification, Developer AI playbook, and checklist before any implementation work.

## Engineering Kit

The Engineering Kit is the source of truth for product intent, architecture, bootstrap rules, and implementation order.

Required reading order:

1. `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md`
2. `docs/01_FOUNDATION/01-001_VISION.md`
3. `docs/01_FOUNDATION/01-002_ENGINEERING_PRINCIPLES.md`
4. `docs/01_FOUNDATION/01-003_GLOSSARY.md`
5. `docs/02_ARCHITECTURE/02-001_ARCHITECTURE.md`
6. `docs/05_BOOTSTRAP/05-001_TECH_STACK.md`
7. `docs/05_BOOTSTRAP/05-002_REPOSITORY_STRUCTURE.md`
8. `docs/05_BOOTSTRAP/05-003_ENVIRONMENT_SPEC.md`
9. `docs/05_BOOTSTRAP/05-005_IMPLEMENTATION_ORDER.md`

Read task-specific specifications from `docs/03_SPECIFICATIONS/` before implementation work begins.

## Developer AI Documents

Developer AI documents define how AI-assisted work should be performed in this repository.

Required before implementation:

1. `developer-ai/00_CONTEXT/MISSION.md`
2. `developer-ai/00_CONTEXT/ARCHITECTURE_MAP.md`
3. `developer-ai/00_CONTEXT/REPOSITORY_OVERVIEW.md`
4. Relevant standards from `developer-ai/01_STANDARDS/`
5. Relevant patterns from `developer-ai/02_PATTERNS/`
6. Relevant playbook from `developer-ai/03_PLAYBOOKS/`
7. Relevant checklist from `developer-ai/05_CHECKLISTS/`

## Repository Areas

- `docs/` contains product, architecture, specification, implementation, and bootstrap documents.
- `developer-ai/` contains AI agent context, standards, patterns, playbooks, prompts, and checklists.
- `apps/` is reserved for future application entry points.
- `packages/` contains shared infrastructure workspace packages introduced in Phase 1. Current implemented packages are `packages/config`, `packages/types`, `packages/errors`, `packages/utils`, and `packages/shared`.
- `schemas/`, `prompts/`, `examples/`, `infrastructure/`, `docker/`, and `scripts/` are repository support areas.
- `.github/` contains contribution automation, issue templates, pull request templates, labels, owners, and CI workflows.

## Local Verification

```sh
node scripts/verify-repository.mjs --phase review
pnpm install
pnpm lint
pnpm build
pnpm test
```

During Phase 1 shared infrastructure work, these commands verify repository structure, document numbering, README coverage, cross references, package boundaries, logging foundation policy, and package-level tests for `packages/config`, `packages/types`, `packages/errors`, `packages/utils`, and `packages/shared`.

## Phase Workflow

Phase 0 is repository foundation work only. It may update documentation, repository verification, CI, Docker, environment guidance, and governance files. It must not add application code, business logic, APIs, connectors, AI workflows, or database schema implementation.

Phase 1 starts shared infrastructure work. It should begin only after Phase 0 verification passes and a scoped implementation task identifies the owning package, referenced Engineering Kit documents, and required tests.

## Phase 0 Completion Checklist

Phase 0 is complete when all of the following are true:

- repository verification passes with `node scripts/verify-repository.mjs --phase review`
- `pnpm lint`, `pnpm build`, and `pnpm test` pass
- Docker Compose validates with `docker compose config`
- `git status --short --ignored` shows no unexpected tracked or untracked files
- `apps/` and `packages/` contain only approved README placeholders
- no application code, business logic, APIs, connectors, AI workflows, or database schema implementation exists
- environment, logging, testing, security, and contributor guidance are documented
- Phase 1 work has a scoped task, owning package, referenced Engineering Kit documents, acceptance criteria, and required tests

When this checklist passes, the repository is ready for Phase 1 shared infrastructure work.

## Documentation Rules

Cross references must resolve to real files or approved Engineering Kit document aliases. Prefer repository-relative paths such as `docs/05_BOOTSTRAP/05-001_TECH_STACK.md` and `developer-ai/00_CONTEXT/MISSION.md`.

Numbered documents under `docs/` must keep their folder prefix and file heading aligned. For example, `docs/05_BOOTSTRAP/05-003_ENVIRONMENT_SPEC.md` belongs in the `05_BOOTSTRAP` section and starts with `# 05-003_ENVIRONMENT_SPEC.md`.

## Testing Strategy

During Phase 1 Milestone 2, `pnpm test` runs repository verification and package-level tests for `packages/config`, `packages/types`, `packages/errors`, `packages/utils`, and `packages/shared`. It does not run application, API, business logic, connector, AI workflow, database, or frontend tests because those implementations do not exist yet.

Future implementation phases should introduce tests in layers:

- Vitest for unit tests in shared packages and domain-level modules
- Supertest for Fastify API route and HTTP contract tests
- Playwright for end-to-end browser tests once the web application exists
- Contract testing for APIs, event envelopes, connectors, and AI workflow inputs/outputs
- Integration testing for database, Redis, queues, external-provider adapters, and cross-package workflows

Test dependencies should be added only when the corresponding implementation package or app is introduced.

## Environment Setup

Create a local environment file from the example:

```sh
cp .env.example .env
```

Required variables are grouped in `.env.example`:

- Application: `APP_NAME`, `NODE_ENV`, `PORT`
- Services: `DATABASE_URL`, `REDIS_URL`
- AI providers: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_MODEL`, `ANTHROPIC_MODEL`
- Authentication: `JWT_SECRET`, `JWT_EXPIRES_IN`
- Observability: `LOG_LEVEL`, `OTEL_EXPORTER_ENDPOINT`

Optional variables:

- `SENTRY_DSN`
- `LANGFUSE_API_KEY`
- `LANGSMITH_API_KEY`

Safe defaults are documented in `.env.example` and `packages/config/README.md`:

- `NODE_ENV=local`
- `PORT=3000`
- `LOG_LEVEL=info`

Runtime configuration validation fails fast when required values are missing or malformed. Required secrets do not receive fake defaults. Before implementation work uses AI providers, authentication, or external observability, fill the relevant values in your local `.env`; never commit real secrets.

Production environments must provide required variables through the deployment platform or secret manager. Production secrets must not be copied from local files, committed to Git, or stored in documentation.

## Config Package Usage

`packages/config` owns runtime configuration during Phase 1 Milestone 1.

Future packages should consume typed configuration from `@opportunity-os/config` rather than reading `process.env` directly. Use `loadRuntimeConfig()` for runtime environment loading and `createRuntimeConfig(requiredEnvironment, optionalEnvironment)` for tests or controlled package boundaries.

Typed config is grouped by `application`, `services`, `aiProviders`, `authentication`, `observability`, and `optionalIntegrations`.

Apps, APIs, connectors, AI workflows, and business logic are not part of this milestone. The next shared-infrastructure milestone should depend on `packages/config` for validated service name, environment, log level, exporter endpoint, and related runtime settings.

## Phase 1 Milestone 1 Readiness

Phase 1 Milestone 1 is complete when all of the following are true:

- `packages/config` implements environment schema validation, typed exports, fail-fast loading, and secret-safe configuration errors
- `packages/config` is documented, tested, and independently buildable through the workspace build
- `.env.example`, repository documentation, and the config schema describe the same required and optional variables
- `apps/` contains no application implementation
- no business logic, connectors, AI workflows, API routes, database implementation, or frontend implementation exists
- `node scripts/verify-repository.mjs --phase review`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

After this gate passes, the next shared infrastructure milestone may consume `@opportunity-os/config` instead of reading from `process.env` directly.

## Shared Foundation Usage

Phase 1 Milestone 2 establishes shared foundation packages without application behavior.

Package ownership:

- `packages/config` owns runtime configuration validation and typed configuration exports.
- `packages/types` owns generic shared TypeScript types such as branded primitives, result contracts, and metadata contracts.
- `packages/errors` owns generic error categories, stable error codes, base error contracts, and secret-safe error serialization.
- `packages/utils` owns generic deterministic object, string, redaction, and time utilities.
- `packages/shared` owns shared contracts and approved aggregation for logging, request/correlation context, validation results, and shared foundation exports.

Allowed dependency direction:

- `packages/types` and `packages/utils` sit at the base and should remain dependency-light.
- `packages/errors` may depend on `@opportunity-os/types`.
- `packages/shared` may depend on `@opportunity-os/config`, `@opportunity-os/types`, `@opportunity-os/errors`, and `@opportunity-os/utils`.

Future packages should consume shared foundation capabilities through the owning package first. Use `@opportunity-os/config` for runtime configuration, `@opportunity-os/types` for generic type contracts, `@opportunity-os/errors` for error contracts, `@opportunity-os/utils` for deterministic helpers, and `@opportunity-os/shared` for cross-cutting shared contracts. Do not create new shared abstractions inside apps, connectors, APIs, workflows, database packages, or frontend packages when an existing shared foundation package owns the concern.

Phase 1 Milestone 2 does not include business logic, connectors, APIs, AI workflows, database implementation, frontend implementation, or app code.

## Phase 1 Milestone 2 Readiness

Phase 1 Milestone 2 is complete when all of the following are true:

- `packages/config`, `packages/types`, `packages/errors`, `packages/utils`, and `packages/shared` are implemented, tested, documented, and independently buildable
- shared package boundaries and dependency direction are enforced by repository verification
- package-level tests run through `pnpm test`
- no business logic, connectors, APIs, AI workflows, database implementation, frontend implementation, or app code exists
- `node scripts/verify-repository.mjs --phase review`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

After this gate passes, the next milestone may depend on shared foundation packages for typed configuration, generic types, safe errors, deterministic utilities, logging contracts, request/correlation context contracts, and validation result contracts. Future implementation packages should consume these contracts instead of redefining them locally.

## Logging Architecture

Phase 1 Milestone 3 implements the structured logging foundation in `packages/shared`. `packages/shared` is the owner of the logging foundation, and Pino is the approved structured logging implementation.

The logging foundation must remain compatible with the Phase 1 Milestone 2 dependency direction:

- `packages/types` and `packages/utils` sit at the base.
- `packages/errors` may depend on `@opportunity-os/types`.
- `packages/shared` may depend on `@opportunity-os/config`, `@opportunity-os/types`, `@opportunity-os/errors`, and `@opportunity-os/utils`.

The logging foundation remains out of scope for application code, APIs, connectors, AI workflows, database implementation, frontend implementation, and business logic.

The Pino logger implementation consumes the shared logging contracts and emits structured logs with these required fields:

- `timestamp`
- `service`
- `environment`
- `severity`
- `correlationId`
- `requestId` when a request context exists
- `eventName`
- `message`

Logger usage:

- use `createLoggerConfig()` with explicit `service`, `environment`, and `logLevel`
- create logger instances with `createPinoLogger()`
- pass an injectable destination for deterministic tests when needed
- pass an injectable clock for deterministic timestamps when needed
- use `logger.child()` to inherit immutable correlation, request, and base context
- call `debug`, `info`, `warn`, or `error` with `correlationId`, `eventName`, `message`, and optional `requestId`, `context`, or `error`

Future packages should consume logging through `@opportunity-os/shared`; they must not create local logger factories, read `process.env` for logging settings, or declare their own Pino dependency. Application, API, connector, AI workflow, frontend, and database integration remain future milestones.

Sensitive data must never be logged. This includes API keys, tokens, passwords, raw authentication headers, credentials, and unredacted secret values.

The shared logger normalizes log entries and errors through secret-safe output. `OpportunityError` and unknown `Error` values are logged without stack traces, raw causes, provider keys, tokens, DSNs, passwords, or auth headers.

## Phase 1 Milestone 3 Readiness

Phase 1 Milestone 3 is complete when all of the following are true:

- `packages/shared` contains the Pino-backed logging foundation, logging contracts, context support, secret-safe normalization, and deterministic tests
- logger configuration is explicit and does not read `process.env`
- logger destinations and clocks are injectable for deterministic testing
- correlation IDs are required, request IDs are optional, and child loggers inherit immutable context
- `OpportunityError` and unknown `Error` logging remain stack-safe and secret-safe
- logging exports are available from `@opportunity-os/shared`
- repository verification enforces logging files, exports, dependency boundaries, and Pino scoping
- no application code, APIs, connectors, AI workflows, database implementation, frontend implementation, or business logic exists
- `node scripts/verify-repository.mjs --phase review`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

After this gate passes, the next milestone may consume `@opportunity-os/shared` logging from future implementation packages. Do not begin Phase 1 Milestone 4 until its owning package, scope, tests, and Engineering Kit references are approved.

## Local Services

The repository includes a Docker Compose baseline for local PostgreSQL and Redis only. It does not define application containers during Phase 1 Milestone 1.

Validate the Compose file:

```sh
docker compose config
```

Optionally start local services:

```sh
docker compose up postgres redis
```

## Implementation Guardrails

- Do not add business logic without approved implementation scope.
- Do not add connectors, APIs, database tables, or AI workflows in repository foundation changes.
- Keep TypeScript, pnpm, Turborepo, and Node.js versions aligned with the bootstrap documents.
- Keep documentation cross references valid.

## Pull Request Workflow

Every pull request should:

- link a GitHub issue or task
- identify the relevant Engineering Kit documents
- explain whether it is Phase 0 foundation work or Phase 1+ implementation work
- include verification output
- update documentation when behavior, structure, or workflow changes
- confirm no secrets or unrelated local artifacts are included

## Current Status

Phase 1 Milestone 3 establishes the shared logging foundation inside `packages/shared`. The repository remains free of business logic, connectors, APIs, AI workflows, database implementation, frontend implementation, and app code.
