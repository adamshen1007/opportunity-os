# 05-002_REPOSITORY_STRUCTURE.md

**Document ID:** 05-002
**Version:** 3.0.0
**Status:** Approved (Engineering Kit v3.0)
**Layer:** 4 - Repository Bootstrap
**Owner:** Architecture Team

# Repository Structure

This document defines the canonical repository structure after completion of Phase 2 Milestone 14.

Opportunity OS is a pnpm/Turborepo monorepo. The repository currently contains platform foundation packages and the deterministic Reddit runtime. It does not yet contain application entry points, REST APIs, frontend implementation, Raw Content persistence workflows, AI workflows, opportunity generation, schedulers, workers, or product business logic.

## Top-Level Structure

```text
opportunity-os/
├── apps/
├── config/
├── developer-ai/
├── docker/
├── docs/
├── examples/
├── infrastructure/
├── packages/
├── prompts/
├── schemas/
├── scripts/
├── .github/
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── RELEASE_NOTES.md
```

## Application Boundary

`apps/` is reserved for future application entry points.

As of Engineering Kit v3.0, `apps/` must not contain REST APIs, controllers, authentication implementation, frontend implementation, schedulers, workers, product workflows, or business logic.

## Package Architecture

Implemented packages through Phase 2 Milestone 14:

```text
packages/config
packages/types
packages/errors
packages/utils
packages/shared
packages/events
packages/database
packages/domain
packages/application
packages/container
packages/infrastructure
packages/connectors
packages/connector-runtime
packages/connector-host
packages/connectors-reddit
```

### packages/config

Owns runtime configuration schema validation, typed config exports, fail-fast loading, and secret-safe config errors.

### packages/types

Owns generic TypeScript contracts such as branded types, result types, and metadata helper types.

### packages/errors

Owns generic safe error categories, stable error codes, base error classes, and safe error serialization.

### packages/utils

Owns generic deterministic utility helpers for objects, strings, redaction, and time.

### packages/shared

Owns shared cross-cutting infrastructure contracts and implementations, including structured logging, logger configuration, context contracts, validation contracts, and shared exports.

### packages/events

Owns event envelope, metadata, category, versioning, publisher, consumer, serialization, idempotency, replay, and test-only in-memory event bus contracts.

### packages/database

Owns Prisma foundation, PostgreSQL datasource configuration, migration framework, database client factory contracts, repository interfaces, transaction contracts, seed placeholders, and database health contracts.

It does not own Raw Content workflow tables, connector persistence, AI workflow tables, event store tables, API tables, frontend tables, or business workflow persistence.

### packages/domain

Owns generic domain contracts: primitives, value objects, entities, aggregate roots, metadata, domain events, domain errors, repository interfaces, validation contracts, and result contracts.

It does not own concrete business aggregates, scoring logic, persistence implementations, application services, or workflows.

### packages/application

Owns generic application-layer contracts: commands, queries, use-case boundaries, application services, dependency injection contracts, request context contracts, application errors, event publishing ports, repository ports, transaction ports, results, validation outcomes, and handler context contracts.

It does not own REST routes, controllers, auth implementation, concrete product commands, product handlers, or use cases.

### packages/container

Owns dependency injection and composition contracts: dependency tokens, service registrations, lifetimes, resolvers, scopes, modules, composition roots, configuration binding, logger binding, validation, and container errors.

It does not own runtime service location, reflection, app startup, API boot, or product workflow composition.

### packages/infrastructure

Owns infrastructure composition contracts: modules, package registration metadata, bootstrap contracts, lifecycle contracts, startup validation, graceful shutdown, health aggregation, dependency graph validation, infrastructure results, infrastructure errors, and foundation package composition metadata.

It does not instantiate services, execute dependency graphs, open database connections, run migrations, dispatch commands, start APIs, or execute product workflows.

### packages/connectors

Owns the generic Connector SDK: metadata, capabilities, config, context, lifecycle, result, error, registry, factory, validation, health, limits, operation, and test utility contracts.

It does not own concrete connectors, OAuth implementation, HTTP clients, provider calls, or connector execution.

### packages/connector-runtime

Owns generic connector runtime contracts: execution pipeline, execution state, retry, timeout, cancellation, checkpoint, rate-limit, metrics, telemetry, result aggregation, runtime errors, and deterministic runtime test harness contracts.

It does not own provider-specific connectors, schedulers, queues, workers, HTTP clients, or actual connector execution.

### packages/connector-host

Owns connector host contracts: bootstrap, runner, runtime orchestration, lifecycle orchestration, dependency injection bindings, config bindings, logger bindings, event publisher bindings, startup validation, shutdown, health aggregation, execution orchestration, host results, host errors, and deterministic host test harness contracts.

It does not own host startup, worker loops, queues, schedulers, provider calls, APIs, frontend, or business logic.

### packages/connectors-reddit

Owns Reddit connector contracts and deterministic Reddit runtime implementation through Phase 2 Milestone 14.

Implemented responsibilities:

- Reddit metadata, capabilities, configuration, validation, data shapes, operations, lifecycle, factory, host integration, errors, and deterministic fixtures
- fake provider and fixture provider
- deterministic runtime construction
- explicit runtime config validation
- deterministic lifecycle readiness
- fixture-backed read operations for posts, comments, subreddits, and authors
- pagination and rate-limit metadata preservation
- result mapping
- safe runtime errors
- deterministic runtime harness with fake provider, fake clock, and fake context

Not implemented as of v3.0:

- OAuth implementation
- live Reddit API calls
- HTTP clients
- scraping
- scheduler
- queue
- worker process
- database persistence
- AI workflows
- REST APIs
- frontend
- business logic
- external connector execution

## Dependency Direction

Current dependency direction:

```text
apps (future)
  ↓
packages/infrastructure
  ↓
packages/container
  ↓
packages/application
  ↓
packages/domain
  ↓
packages/database, packages/events, packages/shared
  ↓
packages/config, packages/types, packages/errors, packages/utils

packages/connectors-reddit
  ↓
packages/connectors, packages/connector-host
  ↓
packages/connector-runtime, packages/container, packages/application, packages/events, packages/shared, packages/infrastructure
```

Reverse dependencies are prohibited unless a future Engineering Kit update explicitly changes the boundary.

## Phase 2 Transition

Engineering Kit v3.0 marks the transition point from platform foundation into real provider and product capability.

Starting with Phase 2 Milestone 15, implementation may introduce provider transport architecture for Reddit. This is still not permission to introduce Raw Content persistence, AI workflows, opportunity generation, REST APIs, frontend, schedulers, workers, or business logic.

## Verification

Repository structure and package boundaries are enforced by:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-14
```

Future Milestone 15 work must add and pass:

```sh
node scripts/verify-repository.mjs --phase phase-2-milestone-15
```

## Revision History

| Version | Summary |
|---------|---------|
| 2.0.0 | Initial repository structure exported from the Engineering Kit. |
| 3.0.0 | Updated repository and package architecture through Phase 2 Milestone 14 and defined the Milestone 15 transition boundary. |
