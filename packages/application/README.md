# Application Package

Owns the Application Foundation for Phase 1 Milestone 7.

`packages/application` owns generic application-layer contracts only. It is the future home for application service contract interfaces, command and query contracts, use-case boundary contracts, dependency injection contracts, request context contracts, application error contracts, application event publishing contracts, and repository port contracts.

## Package Boundary

Slice A establishes:

- `@opportunity-os/application` workspace package setup
- strict TypeScript package configuration
- public package exports through `src/index.ts`
- repository verification support for `phase-1-milestone-7`
- dependency boundaries for approved foundation packages

Slice B adds generic contracts for:

- application commands and command handlers
- application queries and query handlers
- use-case inputs, contexts, and success/failure result shapes
- generic application service interfaces

Slice C adds generic contracts for:

- dependency injection tokens, providers, and container contracts
- application request contexts using shared context and logging concepts
- secret-safe application errors based on `@opportunity-os/errors`
- application event publishing and dispatch ports based on `@opportunity-os/events`
- repository ports based on `@opportunity-os/domain`
- transaction boundary ports without database implementation

Slice D hardens the package with:

- application result and validation outcome contracts
- handler execution context contracts
- public export stability tests
- package dependency boundary tests
- security tests for errors and validation failures
- root workspace pipeline coverage through lint, build, and test

`packages/application` may depend only on approved foundation packages when later slices require them:

- `@opportunity-os/types`
- `@opportunity-os/errors`
- `@opportunity-os/events`
- `@opportunity-os/utils`
- `@opportunity-os/shared`
- `@opportunity-os/domain`

Slice D implements no handler registry, dispatch engine, runtime container, service locator, app startup, dependency resolution, event bus, transport, database event store, connector behavior, workflow execution, repository implementation, persistence mapping, database client, concrete product command, concrete query, concrete use case, product handler, controller behavior, API behavior, auth behavior, scoring, or business behavior.

## Non-Goals

This package must not introduce:

- REST API routes
- controllers
- authentication implementation
- authorization implementation
- connector execution
- AI workflows
- database repository implementations
- frontend implementation
- business scoring logic
- actual product use cases

Future approved milestones may consume these generic application contracts. They must not add concrete commands, concrete queries, concrete use cases, runtime dispatch, HTTP behavior, persistence behavior, workflow behavior, connector behavior, auth behavior, frontend behavior, or business behavior inside `packages/application`.

## Consumer Rules

Future packages should use `@opportunity-os/application` for application-layer boundaries.

Use command and query contracts for:

- generic command and query message shapes
- command and query handler interfaces
- correlation and request metadata on application inputs

Use use-case boundaries for:

- generic use-case inputs
- application execution context
- success and failure result shapes

Use application service contracts for:

- interface-only application service boundaries
- generic service operation inputs
- controlled service outputs

Use dependency injection contracts for:

- dependency tokens
- value providers
- factory providers
- container interface shapes

Do not use the DI contracts as a runtime container, service locator, dependency resolver, or application startup implementation.

Use request context contracts for:

- required correlation IDs
- optional request IDs
- optional shared logger references

Use application error contracts for:

- application-layer error categories and codes
- safe error serialization
- secret-safe messages for local development and CI

Use event publishing contracts for:

- transport-agnostic event publishing ports
- event dispatch boundaries that accept `@opportunity-os/events` envelopes

Do not add event buses, production transports, database event stores, connector behavior, or workflow execution in this package.

Use repository ports for:

- application-facing repository boundaries
- domain entity and aggregate contracts from `@opportunity-os/domain`

Do not add Prisma, SQL, persistence mapping, database clients, or repository implementations in this package.

Use transaction boundary ports for:

- application transaction boundary contracts
- explicit operation scopes

Do not add database transactions, unit-of-work implementations, or persistence behavior in this package.

Use application result and validation contracts for:

- generic success/failure results
- generic validation issues
- secret-safe validation failure messages

Use handler execution context contracts for:

- handler inputs
- optional dependencies
- application context propagation

Do not add handler registries, dispatch engines, API controllers, product handlers, or product use cases in this package.

Future packages must not define local replacements for these contracts when `@opportunity-os/application` already owns the concept.

## Commands

Build the package:

```sh
pnpm --filter @opportunity-os/application build
```

Run deterministic package tests:

```sh
pnpm --filter @opportunity-os/application test
```

Run the package boundary through repository verification:

```sh
node scripts/verify-repository.mjs --phase phase-1-milestone-7
```
