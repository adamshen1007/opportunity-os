# Database Package

Owns the Database Foundation for Phase 1 Milestone 5.

`packages/database` is the only package that may own Prisma setup, PostgreSQL schema foundation, migration framework commands, database client creation, repository interface contracts, transaction boundary contracts, seed framework placeholders, and database health check contracts.

Package dependencies must remain limited to Prisma dependencies, deterministic test/build tooling, and explicitly approved shared infrastructure packages. Do not add application, connector, API, AI workflow, frontend, domain, intelligence, acquisition, application service, or business package dependencies.

## Package Boundary

Owned responsibilities for Slice A:

- `@opportunity-os/database` workspace package setup
- strict TypeScript package configuration
- Prisma dependency and package scripts
- PostgreSQL datasource declaration
- Prisma client generator declaration
- public package exports through `src/index.ts`
- documentation boundaries for future database work

Owned responsibilities for Slice B:

- migration command documentation
- foundation baseline migration
- database client factory
- database configuration consumption boundary

Owned responsibilities for Slice C:

- repository interface contracts
- transaction boundary contracts
- seed framework placeholders
- database health check contracts
- database lifecycle contracts
- secret-safe database error contracts

Owned responsibilities for Slice D:

- schema policy tests
- database security tests
- optional local database verification command
- package export stability tests
- package boundary tests

## Prisma Foundation

The Prisma schema foundation lives at `packages/database/prisma/schema.prisma`. Prisma CLI configuration lives at `packages/database/prisma.config.ts`.

Slice A declares only:

- PostgreSQL datasource
- migration datasource URL from `DATABASE_URL` in `prisma.config.ts`
- local placeholder URL fallback for schema validation when `DATABASE_URL` is not set
- Prisma client generator

No data models are defined in Slice A.

The placeholder URL is only for deterministic Prisma CLI validation. Real local and production database operations must provide `DATABASE_URL` through environment configuration.

## Migration Policy

Migration files live under `packages/database/prisma/migrations/`.

Slice B adds a foundation baseline migration that intentionally creates no tables. Future migrations must be generated through Prisma, reviewed before commit, and scoped to an approved database task.

Migration commands:

```sh
pnpm --filter @opportunity-os/database migrate:dev
pnpm --filter @opportunity-os/database migrate:status
pnpm --filter @opportunity-os/database migrate:deploy
```

Do not create connector persistence, Raw Content workflow, event store, AI workflow, API, frontend, application service, or business tables in Database Foundation slices unless a later approved task explicitly scopes those tables.

## Configuration Boundary

Database runtime configuration is created from explicit typed input:

```ts
createDatabaseConfig({
  databaseUrl: "postgresql://user:password@localhost:5432/opportunity_os"
});
```

`DATABASE_URL` remains the required connection source. The database package does not read arbitrary environment values for runtime client creation.

## Client Factory Boundary

`createDatabaseClient()` accepts explicit database configuration and an injected client creator. It does not create a process-level singleton, connect during import, or automatically call `$connect()`.

Application startup, API integration, connector persistence, and service orchestration remain out of scope.

## Lifecycle Contracts

Database lifecycle contracts define:

- `connectDatabase(client)`
- `disconnectDatabase(client)`
- `safelyShutdownDatabase(client)`

These helpers operate on injected client contracts. They do not create clients, read environment variables, start applications, or register process handlers.

## Repository Contracts

Repository contracts are generic and domain-agnostic:

- `findById`
- `save`
- `deleteById`

Do not add domain-specific repository methods, connector persistence methods, Raw Content workflow methods, event store methods, API methods, frontend methods, or business methods in Database Foundation contracts.

## Transaction Contracts

Transaction contracts define a generic `runInTransaction` boundary with optional isolation and timeout settings.

Transactions are coordinated through injected runners. The package does not implement application service workflows or nested business transactions.

## Error Contracts

Database errors map to safe infrastructure error details with:

- stable code
- `infrastructure` category
- safe message
- optional operation

Safe database errors must not expose credentials, connection strings, SQL payloads, raw Prisma internals, stack traces, or raw causes.

## Health Contract

`checkDatabaseHealth()` accepts an injected probe and clock. It returns structured health status for future callers, but it does not implement API routes or application health endpoints.

## Seed Placeholder

`createSeedPlaceholder()` documents seed plan intent and always returns `skipped`.

No seed data is inserted during Database Foundation.

## Non-Goals

This package must not introduce:

- connector persistence
- Raw Content workflow tables
- event store tables
- AI workflow tables
- API tables
- frontend tables
- business tables
- application services
- business logic
- production event store transport

Database Foundation may define schema and migration infrastructure, but full business workflows belong to later approved milestones.

## Commands

Validate the Prisma schema:

```sh
pnpm --filter @opportunity-os/database prisma validate
```

Build the package:

```sh
pnpm --filter @opportunity-os/database build
```

Run deterministic package tests:

```sh
pnpm --filter @opportunity-os/database test
```

Optional local database verification:

```sh
pnpm --filter @opportunity-os/database verify:local
```

`verify:local` checks migration status against a reachable PostgreSQL database. It is intentionally not part of the default CI, lint, build, or test pipeline.
