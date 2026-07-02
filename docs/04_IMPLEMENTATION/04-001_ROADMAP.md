# 04-001_ROADMAP.md


**Document ID:** 04-001
**Version:** 3.0.0
**Status:** Approved (Implementation)
**Layer:** 3 – Implementation
**Owner:** Engineering Team

# Development Roadmap

## Purpose

This document defines the implementation roadmap for Opportunity OS Version 1.0.

It specifies:

- development phases

- milestones

- dependencies

- deliverables

- acceptance criteria

The roadmap is optimized for iterative, AI-assisted software development.

# Roadmap Principles

Development follows these principles:

- architecture first

- vertical slices over horizontal layers

- working software at every milestone

- automated testing

- continuous integration

- documentation-driven development

Every completed phase should produce a deployable system.

# Engineering Kit v3.0 Roadmap State

Engineering Kit v3.0 supersedes the initial high-level phase sketch with the milestone sequence completed through Phase 2 Milestone 14.

Completed:

- Phase 0 Repository Foundation
- Phase 1 M1 Runtime Configuration
- Phase 1 M2 Shared Foundation
- Phase 1 M3 Logging Foundation
- Phase 1 M4 Event Foundation
- Phase 1 M5 Database Foundation
- Phase 1 M6 Domain Foundation
- Phase 1 M7 Application Foundation
- Phase 1 M8 Dependency Injection & Composition
- Phase 1 M9 Infrastructure Composition
- Phase 2 M10 Connector SDK Foundation
- Phase 2 M11 Connector Runtime Foundation
- Phase 2 M12 Connector Host Foundation
- Phase 2 M13 Reddit Connector Foundation
- Phase 2 M14 Reddit Runtime
- Phase 2 M15 Reddit Provider Transport
- Phase 2 M16 Raw Content Pipeline
- Phase 2 M17 Normalization Pipeline
- Phase 2 M18 Embedding Foundation

Future:

- Phase 2 M19 AI Analysis Pipeline
- Phase 2 M20 Opportunity Engine
- Phase 2 M21 REST API
- Phase 2 M22 Dashboard

From Milestone 15 onward, Opportunity OS transitions from platform foundation to real provider and product capability. This transition remains staged: provider transport precedes Raw Content contracts, Raw Content precedes normalization, normalization precedes embeddings, embeddings precede AI analysis, AI analysis precedes opportunity generation, opportunity generation precedes REST APIs, and REST APIs precede the dashboard.

Do not begin Phase 2 Milestone 19 until an implementation task explicitly scopes it.

# Phase 0 — Repository Foundation

## Goal

Create the engineering foundation.

Deliverables:

- repository structure

- CI pipeline

- coding standards

- shared libraries

- database migrations

- local development environment

- automated testing framework

Milestone:

Every engineer and AI coding agent can build and run the project locally.

## Completion Checklist

Phase 0 is complete when:

- repository structure matches the Engineering Kit

- package manager, Node, workspace, and TypeScript policies are enforced

- repository verification passes

- lint, build, and test commands pass

- Docker Compose configuration validates

- local PostgreSQL and Redis services are documented

- environment setup, production configuration expectations, and future validation contract are documented

- logging architecture and sensitive data policy are documented

- testing strategy is documented

- contribution, pull request, security, cross-reference, and document-numbering rules are documented

- no application code exists

- no business logic exists

- no APIs, connectors, AI workflows, or database schema implementation exists

## Phase 1 Readiness

Phase 1 may begin only after the Phase 0 completion checklist passes.

The first Phase 1 task must identify:

- owning package

- referenced Engineering Kit documents

- dependencies

- acceptance criteria

- required tests

- documentation updates

## Phase 1 Milestone 1 — Runtime Configuration And Validation

Goal:

Establish typed runtime configuration in `packages/config`.

Deliverables:

- environment schema validation

- typed configuration exports

- fail-fast configuration loading

- secret-safe validation errors

- package-level tests

- environment documentation consistency checks

Usage rule:

Future packages should consume configuration from `@opportunity-os/config`. They should not read `process.env` directly once they depend on this shared package.

Out of scope:

- apps

- APIs

- connectors

- AI workflows

- database behavior

- domain logic

- intelligence logic

- business processes

Next milestone dependency:

The next shared-infrastructure milestone must depend on `packages/config` for validated runtime values such as service name, environment, log level, exporter endpoint, service URLs, provider keys, and authentication settings.

Readiness gate:

- `packages/config` is implemented, tested, documented, and independently buildable through the workspace build

- all required and optional environment variables are validated and documented

- configuration errors are clear for local development and CI while remaining secret-safe

- `apps/` contains no application implementation

- no business logic, connectors, AI workflows, API routes, database implementation, or frontend implementation exists

- repository verification, lint, build, tests, and Docker Compose config pass

Handoff:

After this gate passes, the next shared-infrastructure milestone may consume `@opportunity-os/config` as the canonical source for runtime configuration.

## Phase 1 Milestone 2 — Shared Foundation

Goal:

Define and implement shared foundation packages without business behavior.

Packages:

- `packages/types`

- `packages/utils`

- `packages/errors`

- `packages/shared`

Ownership boundaries:

- `packages/types` owns generic shared TypeScript types only.

- `packages/utils` owns generic deterministic utilities only.

- `packages/errors` owns generic shared error contracts only.

- `packages/shared` owns shared infrastructure contracts and approved aggregation only.

Dependency direction:

- `packages/types` and `packages/utils` sit at the base.

- `packages/errors` may depend on `packages/types`.

- `packages/shared` may depend on `packages/config`, `packages/types`, `packages/errors`, and `packages/utils`.

Out of scope:

- business logic

- connectors

- APIs or API routes

- AI workflows

- database implementation

- frontend implementation

- app code

Implementation guardrail:

Phase 1 Milestone 2 must not introduce domain behavior, connector behavior, persistence behavior, application behavior, or user interface behavior.

Readiness gate:

- `packages/config`, `packages/types`, `packages/errors`, `packages/utils`, and `packages/shared` are implemented, tested, documented, and independently buildable

- repository verification enforces package boundaries and shared foundation dependency direction

- package-level tests run through the root workspace pipeline

- no business logic, connectors, APIs, AI workflows, database implementation, frontend implementation, or app code exists

- repository verification, lint, build, tests, and Docker Compose config pass

Next milestone dependency:

The next milestone must depend on the shared foundation packages for runtime configuration, generic type contracts, generic error contracts, deterministic utilities, logging contracts, request and correlation context contracts, and validation result contracts. Downstream implementation packages must not redefine these shared contracts locally.

## Phase 1 Milestone 3 — Logging Foundation

Goal:

Implement the structured logging foundation without application behavior.

Owner:

- `packages/shared`

Approved implementation:

- Pino-based structured logger

Required capabilities:

- structured log entries based on the shared logging contracts

- correlation ID support

- request ID support

- secret-safe logging behavior

- logger tests

- documentation updates

- repository verification updates if needed

Dependency direction:

- `packages/types` and `packages/utils` remain base shared foundation packages.

- `packages/errors` may depend on `packages/types`.

- `packages/shared` may depend on `packages/config`, `packages/types`, `packages/errors`, and `packages/utils`.

Compatibility rule:

Phase 1 Milestone 3 must preserve the Phase 1 Milestone 2 dependency direction. It must not introduce reverse dependencies from base packages into `packages/shared`, apps, APIs, connectors, AI workflows, database packages, frontend packages, or business packages.

Out of scope:

- application code

- APIs or API routes

- connectors

- AI workflows

- database implementation

- frontend implementation

- business logic

Implementation guardrail:

Phase 1 Milestone 3 must not introduce domain behavior, connector behavior, API behavior, persistence behavior, application behavior, user interface behavior, or business rules.

Readiness gate:

- `packages/shared` owns and exports the Pino-backed logging foundation

- logger configuration is explicit and never reads `process.env`

- log level mapping to Pino is deterministic and rejects unsupported severities

- clocks and destinations are injectable for deterministic tests

- correlation IDs are required, request IDs are optional, and child loggers inherit immutable parent context

- severity methods `debug`, `info`, `warn`, and `error` emit structured log entries

- `OpportunityError` and unknown `Error` values are normalized without stack traces, raw causes, credentials, tokens, provider keys, DSNs, passwords, or raw auth headers

- secret redaction, schema stability, workspace exports, and repository verification are covered

- repository verification continues blocking apps, APIs, connectors, AI workflows, frontend, database, domain, intelligence, and business implementation

- `node scripts/verify-repository.mjs --phase review`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

Handoff:

After this gate passes, future milestones may consume `@opportunity-os/shared` logging. Phase 1 Milestone 4 must not begin until its scope, owning package, Engineering Kit references, acceptance criteria, and required tests are approved.

## Phase 1 Milestone 4 — Event Foundation

Goal:

Implement shared event foundation contracts without persistence, transport, application, or business behavior.

Owner:

- `packages/events`

Deliverables:

- `@opportunity-os/events` TypeScript package

- stable infrastructure-level event category contracts

- event metadata contracts

- generic event versioning contracts

- generic event envelope contracts

- event context contracts for correlation, causation, and request IDs

- library-agnostic event schema contracts

- transport-agnostic event publisher and consumer interfaces

- deterministic event serialization and safe deserialization

- idempotency contracts

- replay-readiness contracts

- generic event result and event error contracts

- test-only in-memory event bus support

- event contract stability tests

- event privacy and secret-safety tests

- documentation boundaries

Dependency direction:

- `packages/events` is a shared infrastructure package.

- `packages/events` must not depend on apps, APIs, connectors, AI workflows, database packages, frontend packages, domain packages, intelligence packages, acquisition packages, application packages, or business packages.

- `packages/events` currently remains independent of other workspace packages unless a future approved milestone changes the boundary.

Out of scope:

- database event store

- Kafka, NATS, Redis, or other event transport

- connectors

- APIs or API routes

- AI workflows

- frontend implementation

- business logic

- business events or domain-specific event names

- domain payload models

Implementation guardrail:

Phase 1 Milestone 4 must not introduce persistence behavior, transport behavior, connector behavior, API behavior, workflow behavior, application behavior, user interface behavior, domain behavior, intelligence behavior, acquisition behavior, or business rules.

Readiness gate:

- `packages/events` is scaffolded as `@opportunity-os/events`

- strict TypeScript is enabled

- public exports route through `packages/events/src/index.ts`

- event categories are stable infrastructure-level constants

- event metadata includes event ID, event name, category, version, timestamp, source, correlation ID, optional causation ID, optional request ID, and optional idempotency key

- event version format is generic, documented, and deterministic

- event envelopes, context, schemas, publisher and consumer interfaces, serialization, idempotency, replay, results, and errors are generic and documented

- in-memory event bus support is test-only and explicitly not production transport

- package-level tests cover categories, metadata, versioning, envelopes, context, schemas, publisher and consumer interfaces, serialization, idempotency, replay, results, safe errors, in-memory bus behavior, contract stability, and event privacy

- repository verification permits `packages/events` while continuing to block apps, APIs, connectors, AI workflows, frontend, database, domain, intelligence, acquisition, application, and business implementation

- repository verification rejects prohibited reverse dependencies

- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-1-milestone-4`, `pnpm lint`, `pnpm build`, and `pnpm test` pass

Handoff:

After this gate passes, future milestones may consume `@opportunity-os/events` contracts. Phase 1 Milestone 5 must not begin until its scope, owning package, Engineering Kit references, acceptance criteria, and required tests are approved.

## Phase 1 Milestone 5 — Database Foundation

Goal:

Establish the database package and Prisma foundation without connector persistence, application services, production event store transport, or business workflows.

Owner:

- `packages/database`

Completed deliverables:

- `@opportunity-os/database` TypeScript package

- strict TypeScript package setup

- Prisma dependency scoped to `packages/database`

- PostgreSQL datasource using `DATABASE_URL`

- Prisma client generator

- package scripts for build, lint, test, and Prisma validation

- public exports through `packages/database/src/index.ts`

- documentation boundaries

Slice B deliverables:

- migration framework documentation and validation

- empty foundation baseline migration

- explicit typed database configuration input

- database client factory

Slice C deliverables:

- repository interface contracts

- transaction boundary contracts

- seed framework placeholders

- database health check contracts

- database lifecycle contracts

- secret-safe database error contracts

Slice D deliverables:

- schema policy tests that verify no prohibited business models or tables exist

- database security tests for secret-safe errors and health failures

- optional local database integration verification command

- public export stability tests

- package boundary tests

Dependency direction:

- `packages/database` is a persistence infrastructure package.

- Slice A must not depend on apps, APIs, connectors, AI workflows, frontend packages, domain packages, intelligence packages, acquisition packages, application packages, or business packages.

- Slice A does not add workspace package dependencies.

Out of scope:

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

Implementation guardrail:

Phase 1 Milestone 5 Slice D may define Prisma and PostgreSQL schema foundation, migration policy, explicit database configuration input, database client factory contracts, lifecycle contracts, generic repository contracts, transaction contracts, safe error contracts, health contracts, seed placeholders, schema policy tests, database security tests, optional local verification, public export stability tests, and package boundary tests only. It must not implement full business workflows, connector persistence, application services, API behavior, workflow behavior, frontend behavior, or production event transport.

Readiness gate for Slice A:

- `packages/database` is scaffolded as `@opportunity-os/database`

- strict TypeScript is enabled

- public exports route through `packages/database/src/index.ts`

- Prisma schema declares PostgreSQL datasource and Prisma client generator

- no Prisma data models are introduced

- foundation baseline migration creates no tables

- database configuration is created from explicit typed input and keeps `DATABASE_URL` as the required connection source

- database client factory accepts explicit config, uses injected client creation, does not create a process-level singleton, and does not automatically connect during import

- lifecycle contracts define connect, disconnect, and safe shutdown around injected clients

- repository and transaction contracts are generic and contain no domain-specific methods

- database errors serialize to safe infrastructure shapes without credentials, connection strings, SQL payloads, raw causes, stack traces, or Prisma internals

- database health check contract is injectable and does not implement API routes

- seed framework is placeholder-only and inserts no seed data

- schema policy tests verify prohibited business models and tables are absent

- database security tests verify errors and health failures do not leak credentials, connection strings, SQL payloads, auth headers, provider details, raw causes, stack traces, or Prisma internals

- optional local database verification is available without becoming part of the default CI, lint, build, or test pipeline

- public exports and package boundaries are covered by deterministic tests

- Prisma dependencies are scoped to `packages/database`

- repository verification permits `packages/database` while continuing to block apps, APIs, connectors, AI workflows, frontend, domain, intelligence, acquisition, application, and business implementation

- `pnpm install --frozen-lockfile`, `pnpm --filter @opportunity-os/database prisma validate`, `pnpm --filter @opportunity-os/database build`, `pnpm lint`, `pnpm build`, and `pnpm test` pass

Handoff:

After this gate passes, future Database Foundation slices may add documentation and final readiness checks. Do not begin connector persistence, Raw Content workflow persistence, API, AI workflow, frontend, application service, business logic, or production event store transport work until a later approved milestone scopes it.

## Phase 1 Milestone 6 — Domain Foundation

Goal:

Establish the domain package boundary and prepare generic domain contract implementation without business behavior.

Owner:

- `packages/domain`

Completed deliverables:

- `@opportunity-os/domain` TypeScript package

- strict TypeScript package setup

- public exports through `packages/domain/src/index.ts`

- dependency boundary documentation

- repository verification support for `phase-1-milestone-6`

Slice B deliverables:

- generic domain ID, timestamp, and version contracts

- immutable value object contracts

- generic entity contracts with identity and metadata

- aggregate root contracts with identity, version, and pending domain event references

- generic created, updated, and version metadata contracts

- deterministic contract tests

Slice C deliverables:

- generic domain event contracts that reuse `@opportunity-os/events` concepts

- domain event collection contracts without publication, persistence, transport, or workflow behavior

- domain error contracts that use `@opportunity-os/errors` patterns

- secret-safe domain error tests

- generic domain repository interface contracts

- generic validation contracts

- generic domain result contracts

Slice D deliverables:

- public export stability tests

- package dependency boundary tests

- domain contract stability tests

- root workspace pipeline coverage for lint, build, and test

Slice E deliverables:

- repository verification and documentation for `phase-1-milestone-6`

- Domain Foundation usage guidance for future packages

- PR checklist governance for domain contract review

- readiness gate and next milestone dependency documentation

Dependency direction:

- `packages/domain` owns generic domain contracts only.

- `packages/domain` may depend only on `@opportunity-os/types`, `@opportunity-os/errors`, `@opportunity-os/events`, and optionally `@opportunity-os/utils`.

- `packages/domain` must not depend on apps, APIs, connectors, AI workflows, frontend packages, database implementation packages, intelligence packages, acquisition packages, application packages, or business packages.

Out of scope:

- connector execution

- Raw Content persistence workflows

- AI workflows

- APIs

- frontend implementation

- application services

- business scoring logic

- database repository implementations

- production event store transport

- business rules

Implementation guardrail:

Phase 1 Milestone 6 may define package ownership, strict TypeScript setup, public export routing, dependency policy, documentation boundaries, repository verification, generic domain primitives, immutable value object contracts, entity contracts, aggregate root contracts, metadata contracts, generic domain event contracts, domain event collection contracts, generic domain error contracts, generic repository interface contracts, generic validation contracts, generic result contracts, public export stability tests, package boundary tests, contract stability tests, deterministic contract tests, usage documentation, PR governance, and readiness documentation only. It must not implement concrete aggregate types, concrete event names, concrete payloads, scoring, command handlers, application services, business processes, runtime behavior, persistence behavior, workflow behavior, API behavior, or frontend behavior.

Readiness gate for Phase 1 Milestone 6:

- `packages/domain` is scaffolded as `@opportunity-os/domain`

- strict TypeScript is enabled

- public exports route through `packages/domain/src/index.ts`

- package dependencies are limited to approved shared infrastructure packages and deterministic test/build tooling

- repository verification permits `packages/domain` while continuing to block connector execution, Raw Content workflows, AI workflows, APIs, frontend, application services, business scoring logic, database repository implementations, and production event store transport

- generic primitive, value object, entity, aggregate root, and metadata contracts are tested

- generic domain event, error, repository, validation, and result contracts are tested

- domain errors serialize without secrets, tokens, auth headers, provider keys, credentials, raw payloads, or stack traces by default

- public exports are stable and routed through `packages/domain/src/index.ts`

- package-boundary tests verify `packages/domain` has no app, API, connector, AI workflow, frontend, database implementation, acquisition, intelligence, application, or business package dependencies

- future packages are instructed to consume `@opportunity-os/domain` contracts rather than bypassing or redefining them

- PR governance includes domain contract review when domain files change

- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-1-milestone-6`, `pnpm --filter @opportunity-os/domain test`, `pnpm --filter @opportunity-os/domain build`, `pnpm lint`, `pnpm build`, and `pnpm test` pass

Handoff:

After this gate passes, the next milestone may depend on `@opportunity-os/domain` for generic domain contracts. Do not begin connector execution, Raw Content persistence workflows, AI workflows, APIs, frontend, application services, business scoring logic, database repository implementations, or production event store transport until later approved milestones scope them.

## Phase 1 Milestone 7 — Application Foundation

Goal:

Establish the application package boundary and prepare generic application-layer contract implementation without product use cases.

Owner:

- `packages/application`

Completed deliverables:

- `@opportunity-os/application` TypeScript package

- strict TypeScript package setup

- public exports through `packages/application/src/index.ts`

- dependency boundary documentation

- repository verification support for `phase-1-milestone-7`

Slice B deliverables:

- generic application command and command handler contracts

- generic application query and query handler contracts

- use-case boundary contracts and success/failure result shapes

- generic application service interfaces

- deterministic contract tests

Slice C deliverables:

- dependency injection token and provider contracts

- application request context contracts using shared context and logging concepts

- secret-safe application error contracts using `@opportunity-os/errors`

- application event publishing contracts using `@opportunity-os/events`

- repository port contracts using `@opportunity-os/domain`

- transaction boundary port contracts without database implementation

- deterministic contract tests for each contract family

Slice D deliverables:

- generic application result and validation outcome contracts

- handler execution context contracts

- public export stability tests

- package dependency boundary tests

- security tests for application errors and validation failures

- root workspace pipeline integration for lint, build, and test

Slice E deliverables:

- Application Foundation usage documentation for future packages

- roadmap readiness and next milestone dependency documentation

- PR checklist governance for application contract review

Dependency direction:

- `packages/application` owns generic application-layer contracts only.

- `packages/application` may depend only on approved foundation packages when later scoped slices require them.

- `packages/application` must not depend on apps, REST APIs, controllers, connectors, AI workflows, frontend packages, database repository implementations, intelligence packages, acquisition packages, or business packages.

Out of scope:

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

Implementation guardrail:

Phase 1 Milestone 7 may define package ownership, strict TypeScript setup, public export routing, dependency policy, documentation boundaries, repository verification, generic command contracts, generic query contracts, use-case boundary contracts, generic result shapes, generic validation outcomes, generic handler execution context contracts, generic application service interfaces, dependency injection contracts, application request context contracts, application error contracts, application event publishing contracts, repository port contracts, transaction boundary port contracts, public export stability tests, package boundary tests, security tests, deterministic contract tests, usage documentation, PR governance, and readiness documentation only. It must not implement concrete commands, concrete queries, concrete use cases, product handlers, runtime dispatch, handler registries, runtime containers, service locators, app startup, dependency resolution, HTTP behavior, authentication behavior, authorization behavior, persistence behavior, workflow behavior, connector behavior, frontend behavior, scoring behavior, event transport, repository implementation, or business behavior.

Readiness gate for Phase 1 Milestone 7:

- `packages/application` is scaffolded as `@opportunity-os/application`

- strict TypeScript is enabled

- public exports route through `packages/application/src/index.ts`

- package dependencies are limited to deterministic test/build tooling and approved foundation packages

- repository verification permits `packages/application` while continuing to block REST API routes, controllers, auth implementation, connector execution, AI workflows, database repository implementations, frontend, business scoring, and actual product use cases

- generic command, query, use-case, result, and application service contracts are tested

- DI, request context, application error, event publishing, repository port, and transaction boundary contracts are tested

- result, validation, handler, export stability, package boundary, and security contracts are tested

- future packages are instructed to consume `@opportunity-os/application` contracts rather than bypassing or redefining them

- PR governance includes application contract review when application files change

- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-1-milestone-7`, `pnpm --filter @opportunity-os/application test`, `pnpm --filter @opportunity-os/application build`, `pnpm lint`, `pnpm build`, and `pnpm test` pass

Handoff:

After this gate passes, the next milestone may depend on `@opportunity-os/application` for generic application-layer contracts. Do not begin REST APIs, controllers, authentication, authorization, connector execution, AI workflows, database repository implementations, frontend, business scoring logic, or actual product use cases until later approved milestones scope them.

## Phase 1 Milestone 8 — Dependency Injection And Composition Foundation

Goal:

Define dependency injection and composition contracts without application startup, product workflows, or business behavior.

Owner:

- `packages/container`

Deliverables:

- `@opportunity-os/container` TypeScript package

- strict TypeScript package setup

- public exports through `packages/container/src/index.ts`

- package boundary documentation

- repository verification support for `phase-1-milestone-8`

- dependency policy for approved foundation packages

- dependency token contracts

- service registration contracts

- singleton, scoped, and transient lifetime contracts

- factory registration contracts

- class and value registration contracts

- resolver and container contracts

- scope and scoped container contracts

- composition root contracts

- module registration contracts

- configuration binding contracts

- logger integration contracts

- registration validation contracts

- secret-safe container error contracts

- export stability tests

- dependency boundary tests

- contract stability tests

- deterministic tests

Dependency direction:

- `packages/container` is a shared composition infrastructure package.

- It may depend only on approved foundation packages when a scoped slice requires them: `packages/config`, `packages/types`, `packages/errors`, `packages/utils`, and `packages/shared`.

- It must not depend on apps, APIs, controllers, auth implementations, connectors, AI workflows, database repositories, frontend packages, application services, product workflows, or business packages.

Out of scope:

- REST APIs

- controllers

- authentication implementation

- authorization implementation

- connector execution

- AI workflows

- database repositories

- frontend implementation

- application services

- product workflows

- business logic

Verification commands:

- `node scripts/verify-repository.mjs --phase review`

- `node scripts/verify-repository.mjs --phase phase-1-milestone-8`

- `pnpm install --frozen-lockfile`

- `pnpm --filter @opportunity-os/container test`

- `pnpm --filter @opportunity-os/container build`

- `pnpm lint`

- `pnpm build`

- `pnpm test`

- `docker compose config`

Implementation guardrail:

Phase 1 Milestone 8 may define package ownership, strict TypeScript setup, public export routing, dependency policy, documentation boundaries, repository verification, dependency token contracts, service registration contracts, lifetime contracts, resolver contracts, scope contracts, module contracts, composition root contracts, config binding contracts, logger binding contracts, registration validation contracts, container error contracts, export stability tests, dependency boundary tests, contract stability tests, and deterministic package tests only. It must not implement runtime dependency resolution, service locator behavior, reflection, app startup, API boot, module loading, product workflow composition, or business behavior.

Readiness gate for Phase 1 Milestone 8:

- `packages/container` is scaffolded as `@opportunity-os/container`

- strict TypeScript is enabled

- public exports route through `packages/container/src/index.ts`

- repository verification permits `packages/container` while continuing to block APIs, controllers, auth, connectors, AI workflows, database repositories, frontend, application services, product workflows, and business logic

- package dependencies are limited to approved foundation packages and deterministic test/build tooling

- dependency token, registration, lifetime, resolver, scope, module, composition root, config binding, logger binding, validation, and error contracts are implemented and documented

- config binding contracts consume explicit typed config and do not read `process.env`

- logger binding contracts do not introduce logger singletons, transports, or app integration

- container errors serialize safely without secrets, tokens, auth headers, credentials, raw config values, stack traces, or raw causes

- export stability, dependency boundary, contract stability, and package tests pass

- future packages are instructed to consume `@opportunity-os/container` contracts rather than bypassing or redefining them

- PR governance includes DI boundary review, lifetime review, config binding review, logger binding review, and non-goal confirmation when container files change

- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-1-milestone-8`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

Handoff:

After this gate passes, the next milestone may depend on `@opportunity-os/container` for generic dependency injection and composition contracts. Do not begin REST APIs, controllers, authentication, authorization, connector execution, AI workflows, database repository implementations, frontend, application services, product workflows, or business logic until later approved milestones scope them.

## Phase 1 Milestone 9 — Infrastructure Composition Foundation

Goal:

Define infrastructure composition contracts without app startup, product workflows, or business behavior.

Owner:

- `packages/infrastructure`

Deliverables:

- `@opportunity-os/infrastructure` TypeScript package

- strict TypeScript package setup

- public exports through `packages/infrastructure/src/index.ts`

- package boundary documentation

- repository verification support for `phase-1-milestone-9`

- dependency policy for approved foundation packages

- infrastructure module contracts

- composition module contracts

- package registration module contracts

- infrastructure bootstrap contracts

- lifecycle orchestration contracts

- startup validation contracts

- shutdown orchestration contracts

- health aggregation contracts

- dependency graph validation contracts

- infrastructure result and error contracts

- foundation package composition contracts for config, logging, events, database, domain metadata, and application metadata

- export stability, dependency boundary, contract stability, and security tests

- deterministic tests

Dependency direction:

- `packages/infrastructure` is an infrastructure composition package.

- It may depend only on approved foundation packages: `packages/config`, `packages/shared`, `packages/events`, `packages/database`, `packages/domain`, `packages/errors`, `packages/application`, and `packages/container`.

- It must not depend on apps, APIs, controllers, auth implementations, connectors, AI workflows, database repository implementations, frontend packages, product workflows, or business packages.

Out of scope:

- REST APIs

- controllers

- authentication implementation

- authorization implementation

- connector execution

- AI workflows

- database repositories

- frontend implementation

- product workflows

- business logic

Implementation guardrail:

Phase 1 Milestone 9 may define generic infrastructure composition contracts only. It must not implement runtime infrastructure composition, app startup, API boot, lifecycle execution, dependency graph execution, process signal handling, API health routes, connector behavior, workflow behavior, database repository behavior, product use cases, or business behavior.

Readiness gate:

- `packages/infrastructure` is implemented as `@opportunity-os/infrastructure`

- strict TypeScript is enabled

- public exports route through `packages/infrastructure/src/index.ts`

- repository verification permits `packages/infrastructure` while continuing to block REST APIs, controllers, auth, connectors, AI workflows, database repositories, frontend, product workflows, and business logic

- package dependencies are limited to approved foundation packages and deterministic test/build tooling

- module, package registration, bootstrap, lifecycle, startup validation, shutdown, health aggregation, dependency graph, result, error, and foundation package composition contracts are documented

- export stability, dependency boundary, contract stability, and security tests pass

- no REST APIs, controllers, auth implementation, connector execution, AI workflows, database repositories, frontend, product workflows, application services, or business logic exists

- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-1-milestone-9`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

Handoff:

After this gate passes, the next milestone may depend on `@opportunity-os/infrastructure` for generic infrastructure composition contracts. Do not begin REST APIs, controllers, authentication, authorization, connector execution, AI workflows, database repository implementations, frontend, product workflows, application services, business logic, app startup, API boot, production event transport, database event stores, command dispatch, product handlers, or scoring until later approved milestones scope them.

## Phase 2 Milestone 10 — Connector SDK Foundation

Goal:

Define connector SDK package boundaries without concrete connectors, provider integration, or connector execution.

Owner:

- `packages/connectors`

Deliverables:

- `@opportunity-os/connectors` TypeScript package

- strict TypeScript package setup

- public exports through `packages/connectors/src/index.ts`

- package boundary documentation

- repository verification support for `phase-2-milestone-10`

- dependency policy for approved foundation packages

- generic connector interface contracts

- connector lifecycle contracts

- connector execution context contracts

- connector configuration contracts

- connector capability contracts

- connector metadata contracts

- connector result contracts

- connector error contracts

- connector registry contracts

- connector factory contracts

- connector validation contracts

- connector operation contracts

- connector health contracts

- connector rate-limit and quota metadata contracts

- connector test utility contracts

Dependency direction:

- `packages/connectors` is a connector SDK foundation package.

- It may depend only on approved foundation packages and deterministic test/build tooling when a scoped task requires them.

- It must not depend on apps, APIs, controllers, auth implementations, concrete connector implementations, OAuth packages, HTTP client packages, AI workflows, frontend packages, product workflows, or business packages.

Out of scope:

- Reddit connector

- YouTube connector

- OAuth implementation

- HTTP clients

- REST APIs

- controllers

- authentication implementation

- authorization implementation

- AI workflows

- frontend implementation

- business logic

- connector execution

Implementation guardrail:

Phase 2 Milestone 10 may define generic connector SDK contracts only. It must not implement concrete connector behavior, provider behavior, OAuth behavior, HTTP behavior, runtime connector execution, API behavior, AI workflow behavior, frontend behavior, or business behavior.

Verification commands:

- `node scripts/verify-repository.mjs --phase review`

- `node scripts/verify-repository.mjs --phase phase-2-milestone-10`

- `pnpm install --frozen-lockfile`

- `pnpm lint`

- `pnpm build`

- `pnpm test`

- `docker compose config`

Readiness gate:

- `packages/connectors` is scaffolded as `@opportunity-os/connectors`

- strict TypeScript is enabled

- public exports route through `packages/connectors/src/index.ts`

- metadata, capability, config, context, lifecycle, results, errors, registry, factory, validation, health, operation, limit, and testing contracts are documented for future consumers

- future concrete connectors are directed to consume `@opportunity-os/connectors`

- repository verification permits `packages/connectors` while continuing to block apps, APIs, auth, AI workflows, frontend, business logic, concrete connector implementations, OAuth, HTTP clients, and connector execution

- package dependencies are limited to approved foundation packages and deterministic test/build tooling

- export stability, dependency boundary, contract stability, and security tests pass

- no Reddit connector or YouTube connector exists

- no OAuth implementation, HTTP clients, APIs, authentication implementation, AI workflows, frontend implementation, business logic, concrete connector implementation, or connector execution exists

- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-10`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

Handoff:

After this gate passes, the next milestone may depend on `@opportunity-os/connectors` for generic connector SDK contracts. Do not begin Reddit connector, YouTube connector, OAuth, HTTP clients, APIs, authentication, AI workflows, frontend, business logic, provider behavior, or connector execution until later approved milestones scope them.

## Phase 2 Milestone 11 — Connector Runtime Foundation

Goal:

Define generic connector runtime contracts without provider connectors, provider integration, or actual connector execution.

Owner:

- `packages/connector-runtime`

Deliverables:

- `@opportunity-os/connector-runtime` TypeScript package

- strict TypeScript package setup

- public exports through `packages/connector-runtime/src/index.ts`

- package boundary documentation

- repository verification support for `phase-2-milestone-11`

- dependency policy for approved foundation packages

- connector execution pipeline contracts

- execution state machine contracts

- retry policy contracts

- timeout policy contracts

- cancellation contracts

- checkpoint contracts

- execution metrics contracts

- execution telemetry contracts

- rate-limit policy contracts

- execution result aggregation contracts

- runtime error contracts

- deterministic runtime test harness contracts

- export stability, contract stability, security, dependency boundary, and package-boundary tests

Dependency direction:

- `packages/connector-runtime` is a connector runtime foundation package.

- It may depend only on `@opportunity-os/connectors`, `@opportunity-os/container`, `@opportunity-os/application`, `@opportunity-os/errors`, `@opportunity-os/events`, `@opportunity-os/shared`, `@opportunity-os/infrastructure`, and explicitly justified `@opportunity-os/types` or `@opportunity-os/utils`.

- It must not depend on apps, APIs, controllers, auth implementations, concrete connector implementations, OAuth packages, HTTP client packages, scheduler packages, queue packages, worker packages, AI workflows, frontend packages, product workflows, or business packages.

Out of scope:

- Reddit connector

- YouTube connector

- OAuth implementation

- HTTP clients

- scheduler

- queue

- worker process

- REST APIs

- controllers

- authentication implementation

- authorization implementation

- AI workflows

- frontend implementation

- business logic

- actual connector execution

Implementation guardrail:

Phase 2 Milestone 11 may define generic connector runtime contracts only. It must not implement concrete connector behavior, provider behavior, OAuth behavior, HTTP behavior, scheduler behavior, queue behavior, worker behavior, runtime connector execution, API behavior, AI workflow behavior, frontend behavior, or business behavior.

Verification commands:

- `node scripts/verify-repository.mjs --phase review`

- `node scripts/verify-repository.mjs --phase phase-2-milestone-11`

- `pnpm install --frozen-lockfile`

- `pnpm lint`

- `pnpm build`

- `pnpm test`

- `docker compose config`

Readiness gate:

- `packages/connector-runtime` is scaffolded as `@opportunity-os/connector-runtime`

- strict TypeScript is enabled

- public exports route through `packages/connector-runtime/src/index.ts`

- connector runtime contracts are documented for future consumers

- repository verification permits `packages/connector-runtime` while continuing to block Reddit, YouTube, OAuth, HTTP clients, scheduler, queue, worker process, APIs, auth, AI workflows, frontend, business logic, and actual connector execution

- package dependencies are limited to approved foundation packages and deterministic test/build tooling

- package-boundary tests document approved dependencies

- export stability tests confirm approved contracts are importable from `@opportunity-os/connector-runtime`

- contract stability tests lock state values, lifecycle vocabularies, policy decision values, telemetry event names, metric keys, result shapes, and error shapes

- security tests confirm runtime failures, telemetry, metrics, checkpoints, and aggregation output do not leak secrets, tokens, auth headers, credentials, provider keys, DSNs, database URLs, raw config, raw payloads, stack traces, raw causes, or dependency internals

- no Reddit connector or YouTube connector exists

- no OAuth implementation, HTTP clients, scheduler, queue, worker process, APIs, authentication implementation, AI workflows, frontend implementation, business logic, provider integration, or actual connector execution exists

- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-11`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

Handoff:

After this gate passes, the next milestone may depend on `@opportunity-os/connector-runtime` for generic connector runtime contracts. Do not begin Reddit connector, YouTube connector, OAuth, HTTP clients, scheduler, queue, worker process, APIs, authentication, AI workflows, frontend, business logic, provider behavior, or actual connector execution until later approved milestones scope them.

## Phase 2 Milestone 12 — Connector Host Foundation

Goal:

Define generic connector host contracts without provider connectors, provider integration, host execution, or actual connector execution.

Owner:

- `packages/connector-host`

Deliverables:

- `@opportunity-os/connector-host` TypeScript package

- strict TypeScript package setup

- public exports through `packages/connector-host/src/index.ts`

- package boundary documentation

- repository verification support for `phase-2-milestone-12`

- dependency policy for approved foundation packages

- connector bootstrap contracts

- connector runner contracts

- runtime orchestration contracts

- connector lifecycle orchestration contracts

- dependency injection integration contracts

- configuration binding contracts

- logger binding contracts

- event publishing binding contracts

- startup validation contracts

- graceful shutdown contracts

- health orchestration contracts

- execution orchestration contracts

- connector host result contracts

- secret-safe connector host error contracts

- deterministic connector host test harness contracts

- export stability tests

- contract stability tests

- security tests

- dependency boundary tests

- root workspace lint, build, and test integration

Dependency direction:

- `packages/connector-host` is a connector host foundation package.

- It may depend only on `@opportunity-os/config`, `@opportunity-os/connectors`, `@opportunity-os/connector-runtime`, `@opportunity-os/container`, `@opportunity-os/application`, `@opportunity-os/errors`, `@opportunity-os/events`, `@opportunity-os/shared`, and `@opportunity-os/infrastructure`.

- It must not depend on apps, APIs, auth implementations, concrete connector implementations, OAuth packages, HTTP client packages, scheduler packages, queue packages, worker packages, AI workflows, frontend packages, product workflows, or business packages.

- Future packages must consume `@opportunity-os/connector-host` instead of redefining host bootstrap, runner, orchestration, lifecycle, binding, startup validation, shutdown, health, execution, result, error, or test harness contracts.

Out of scope:

- Reddit connector

- YouTube connector

- OAuth implementation

- HTTP clients

- scheduler

- queue

- worker process

- APIs

- authentication implementation

- authorization implementation

- AI workflows

- frontend implementation

- business logic

- provider integration

- actual connector execution

Implementation guardrail:

Phase 2 Milestone 12 may define generic connector host contracts, safe result and error shapes, deterministic test harness contracts, documentation, governance, and repository verification only. It must not implement concrete connector behavior, provider behavior, OAuth behavior, HTTP behavior, scheduler behavior, queue behavior, worker behavior, host execution, runtime connector execution, API behavior, AI workflow behavior, frontend behavior, or business behavior.

Readiness gate:

- `packages/connector-host` is implemented as `@opportunity-os/connector-host`

- strict TypeScript is enabled

- public exports route through `packages/connector-host/src/index.ts`

- repository verification permits `packages/connector-host` while continuing to block Reddit, YouTube, OAuth, HTTP clients, scheduler, queue, worker process, APIs, auth, AI workflows, frontend, business logic, provider integration, and actual connector execution

- package dependencies are limited to approved foundation packages and deterministic test/build tooling

- package-boundary, export stability, contract stability, security, and dependency boundary tests pass

- host contracts, integration dependencies, future consumption guidance, prohibited work, and readiness gate are documented

- no Reddit connector, YouTube connector, OAuth implementation, HTTP clients, scheduler, queue, worker process, APIs, authentication implementation, AI workflows, frontend implementation, business logic, provider integration, or actual connector execution exists

- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-12`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

Handoff:

After this gate passes, the next milestone may depend on `@opportunity-os/connector-host` for generic connector host contracts. Do not begin Reddit connector, YouTube connector, OAuth, HTTP clients, scheduler, queue, worker process, APIs, authentication, AI workflows, frontend, business logic, provider integration, or actual connector execution until later approved milestones scope them.

## Phase 2 Milestone 13 — Reddit Connector Foundation

Goal:

Define the Reddit connector package boundary and future Reddit connector contracts without provider authentication, network calls, scraping, execution, persistence, workflows, APIs, frontend, or business behavior.

Owner:

- `packages/connectors-reddit`

Slice A deliverables:

- `@opportunity-os/connectors-reddit` TypeScript package

- strict TypeScript package setup

- public exports through `packages/connectors-reddit/src/index.ts`

- package boundary documentation

- repository verification support for `phase-2-milestone-13`

- dependency policy for approved connector foundation packages

- package-boundary test

- Reddit connector metadata contracts

- Reddit connector capability declarations

- Reddit connector configuration contracts

- Reddit connector validation contracts

- contract tests for metadata, capabilities, configuration, and validation

- Reddit data shape contracts for posts, comments, subreddits, authors, pagination, and rate-limit metadata

- Reddit data envelope contracts

- contract tests for Reddit data shapes

- Reddit read operation contracts

- declarative Reddit lifecycle readiness contracts

- Reddit factory contracts consuming Connector SDK and Connector Host concepts

- Reddit host integration contracts

- safe Reddit connector error contracts

- deterministic Reddit fixture contracts

- contract tests for operations, lifecycle, factory, host, errors, and fixtures

- export stability tests

- contract stability tests

- security tests

- dependency boundary tests

- repository verification requiring Reddit connector package files, contract files, test files, README, public exports, and approved dependency boundaries

- root workspace lint, build, and test integration through existing workspace package discovery

- Reddit connector package documentation for metadata, capabilities, config, validation, data shape contracts, factory contracts, host contracts, errors, fixtures, non-goals, and final readiness

- PR governance for Reddit connector boundary, security, no-network, no-OAuth, and non-goal review

- final readiness verification

Dependency direction:

- `packages/connectors-reddit` is a Reddit connector foundation package.

- During Phase 2 Milestone 13 it may depend only on `@opportunity-os/connectors`, `@opportunity-os/connector-host`, and deterministic test/build tooling.

- It must not depend on apps, APIs, auth implementations, OAuth packages, HTTP client packages, scraping packages, scheduler packages, queue packages, worker packages, database persistence packages, AI workflows, frontend packages, product workflows, or business packages.

- Future Reddit connector work must consume `@opportunity-os/connectors-reddit` for Reddit-specific contracts and must consume `@opportunity-os/connectors` and `@opportunity-os/connector-host` contracts instead of bypassing the Connector SDK or Connector Host foundations.

Out of scope:

- OAuth implementation

- live Reddit API calls

- HTTP clients

- scraping

- scheduler

- queue

- worker process

- database persistence

- AI workflows

- APIs

- frontend implementation

- business logic

- actual connector execution

Implementation guardrail:

Phase 2 Milestone 13 may define package scaffolding, package boundary documentation, public export routing, metadata contracts, declarative capability contracts, explicit configuration contracts, validation contracts, data shape contracts, operation contracts, lifecycle contracts, factory contracts, host integration contracts, error contracts, fixture contracts, stability tests, security tests, dependency boundary tests, package-boundary tests, dependency policy, and repository verification only. It must not implement authentication behavior, network behavior, provider calls, scraping behavior, scheduler behavior, queue behavior, worker behavior, host startup, runner loops, persistence behavior, workflow behavior, API behavior, frontend behavior, business behavior, or connector execution.

Readiness gate:

- `packages/connectors-reddit` is scaffolded as `@opportunity-os/connectors-reddit`

- strict TypeScript is enabled

- public exports route through `packages/connectors-reddit/src/index.ts`

- repository verification permits `packages/connectors-reddit` while continuing to block OAuth, live Reddit API calls, HTTP clients, scraping, scheduler, queue, worker process, database persistence, AI workflows, APIs, frontend, business logic, and actual connector execution

- package dependencies are limited to approved connector foundation packages and deterministic test/build tooling

- package-boundary test passes

- metadata, capability, configuration, and validation contract tests pass

- data shape contract tests pass

- operation, lifecycle, factory, host, error, and fixture contract tests pass

- export stability, contract stability, security, and dependency boundary tests pass

- Reddit connector package boundaries, dependency direction, future consumption guidance, prohibited work, and readiness gate are documented

- no OAuth implementation, live Reddit API call, HTTP client, scraping, scheduler, queue, worker process, database persistence, AI workflow, API, frontend implementation, business logic, or actual connector execution exists

- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-13`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, `docker compose config`, `pnpm --filter @opportunity-os/connectors-reddit test`, and `pnpm --filter @opportunity-os/connectors-reddit build` pass

Handoff:

After this gate passes, the next milestone may depend on `@opportunity-os/connectors-reddit` for Reddit connector contracts. Do not begin OAuth, live Reddit API calls, HTTP clients, provider calls, scraping, scheduler, queue, worker process, host startup, runner loops, database persistence, AI workflows, APIs, frontend, business logic, or actual connector execution until later approved milestones scope them.

## Phase 2 Milestone 14 — Reddit Connector Runtime Implementation

Goal:

Implement deterministic, non-network Reddit connector runtime behavior using existing Reddit connector contracts, Connector SDK contracts, Connector Host contracts, and connector runtime test harness contracts.

Owner:

- `packages/connectors-reddit`

Deliverables:

- repository verification support for `phase-2-milestone-14`

- active `review` phase moved to the Reddit Runtime Foundation boundary

- continued permission for implementation files only in approved foundation packages, with Reddit runtime implementation scoped to `packages/connectors-reddit`

- documentation of the non-network Reddit runtime adapter boundary

- fake provider and fixture provider runtime support

- connector construction using existing Reddit connector contracts

- explicit runtime config validation

- deterministic lifecycle readiness behavior

- fixture-backed read operations for posts, comments, subreddits, and authors

- pagination and rate-limit metadata preservation

- connector result mapping

- safe Reddit runtime error handling

- deterministic runtime harness using fake provider, fake clock, and fake context

- export stability, contract stability, runtime security, dependency boundary, and root pipeline coverage

- documentation and PR governance for Reddit runtime changes

Dependency direction:

- Reddit runtime work must remain inside `packages/connectors-reddit`.

- Runtime code may consume existing contracts from `@opportunity-os/connectors-reddit`, `@opportunity-os/connectors`, `@opportunity-os/connector-host`, and deterministic connector runtime test harness contracts.

- Runtime implementation must not depend on OAuth packages, HTTP client packages, scraping packages, scheduler packages, queue packages, worker packages, database persistence packages, AI workflows, API packages, frontend packages, product workflows, or business packages.

Out of scope:

- OAuth implementation

- live Reddit API calls

- HTTP clients

- scraping

- scheduler

- queue

- worker process

- database persistence

- AI workflows

- APIs

- frontend implementation

- business logic

- external connector execution

Implementation guardrail:

Phase 2 Milestone 14 implements only deterministic, fixture-backed Reddit runtime behavior. It may construct a local runtime adapter from existing contracts, validate explicit config, expose deterministic lifecycle/read behavior, map results, create safe runtime errors, and provide a deterministic runtime harness. It must not add OAuth behavior, live provider calls, HTTP behavior, scraping behavior, scheduler behavior, queue behavior, worker behavior, database persistence behavior, event publishing, host startup, runner loops, external connector execution, workflow behavior, API behavior, frontend behavior, or business behavior.

Readiness gate:

- `node scripts/verify-repository.mjs --phase review` passes

- `node scripts/verify-repository.mjs --phase phase-2-milestone-14` passes

- `pnpm install --frozen-lockfile` passes

- `pnpm lint` passes

- `pnpm build` passes

- `pnpm test` passes

- `docker compose config` passes

Handoff:

After this gate passes, the next milestone may depend on the deterministic Reddit runtime surface in `@opportunity-os/connectors-reddit`. Do not begin OAuth, live Reddit API calls, HTTP clients, scraping, scheduler, queue, worker process, database persistence, AI workflows, APIs, frontend, business logic, provider integration, event publishing, host startup, runner loops, or external connector execution until later approved milestones scope them.

# Future Roadmap After Engineering Kit v3.0

## Phase 2 Milestone 15 — Reddit Provider Transport

Goal:

Implement provider integration architecture only.

Slice A status:

- `phase-2-milestone-15` repository verification is established
- provider transport exports route through `packages/connectors-reddit/src/provider/index.ts`
- provider transport work remains scoped to `packages/connectors-reddit`
- existing Reddit runtime exports remain stable
- OAuth token, credential, refresh, expiration, and auth state contracts are defined with sensitive fields marked
- HTTP transport, API client, and deterministic request-description contracts are defined without concrete network behavior
- safe response parser, pagination transport metadata, and rate-limit parsing contracts are defined without persistence or execution behavior
- runtime retry, timeout, cancellation compatibility, auth lifecycle, provider error, telemetry, and container binding contracts are defined without runners, vendors, containers, or startup behavior
- deterministic provider fixtures, fake transport, integration tests, security tests, contract stability tests, dependency boundaries, and verifier requirements are in place
- documentation, governance, roadmap readiness, and final verification are complete

Deliverables:

- OAuth contract implementation
- Reddit API client abstraction
- HTTP transport abstraction
- request builder
- response parser
- pagination transport
- rate-limit parsing
- retry, timeout, and cancellation compatibility
- authentication lifecycle
- error mapping
- telemetry integration
- fake transport test infrastructure
- repository verification
- documentation

Dependency direction:

- provider transport work lives only in `packages/connectors-reddit`
- provider contracts consume the existing Reddit connector, connector runtime, connector host, shared logging, events, and container foundations
- future packages must consume `@opportunity-os/connectors-reddit` rather than bypassing provider transport contracts

Non-goals:

- Raw Content persistence
- AI workflows
- opportunity generation
- REST APIs
- frontend
- scheduler
- worker
- business logic

Verification commands:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-15
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Readiness gate:

- Reddit Provider Transport is implemented, tested, documented, and independently buildable
- OAuth contracts, API client abstraction, HTTP transport abstraction, request builder, response parser, pagination transport, rate-limit parsing, runtime compatibility, auth lifecycle, error mapping, telemetry, test fixtures, and fake transport are documented
- default tests are deterministic and do not require live Reddit calls
- provider output remains secret-safe and does not leak raw provider responses
- Raw Content persistence, AI workflows, opportunity generation, REST APIs, frontend, scheduler, worker, database persistence, and business logic remain absent

Next milestone dependency:

- Phase 2 Milestone 16 must consume `@opportunity-os/connectors-reddit` and may build Raw Content Pipeline work only after the provider transport boundary is verified.

## Phase 2 Milestone 16 — Raw Content Pipeline

Goal:

Establish the Raw Content Pipeline Foundation.

Status:

- complete

Package owner:

- `packages/raw-content`

Dependency direction:

- consumes Reddit provider output contracts from `@opportunity-os/connectors-reddit`
- consumes event envelope vocabulary from `@opportunity-os/events`
- consumes domain/application/database/shared vocabulary only as contracts
- exposes Raw Content Pipeline Foundation contracts through `@opportunity-os/raw-content`

Slice completion:

- Slice A established the `@opportunity-os/raw-content` package boundary, strict TypeScript scaffold, public export routing, package documentation, and `phase-2-milestone-16` repository verification
- Slice B defined canonical Raw Content contracts for source metadata, authors, communities, posts, comments, ingestion metadata, provenance, and raw content envelopes
- Slice C defined normalization boundary, fingerprint, deduplication, validation, storage port, raw-content event, and Reddit-to-RawContent mapping contracts
- Slice D added deterministic fixtures, safe structured errors, export stability tests, and contract stability tests
- Slice E added security tests, dependency boundary tests, root pipeline integration, and stricter repository verification
- Slice F completed documentation, PR governance, roadmap readiness, and the final Milestone 16 readiness gate

Deliverables:

- raw content contracts for posts, comments, authors, and communities
- source metadata
- ingestion metadata
- provenance metadata
- normalization boundary contracts
- deduplication contracts
- fingerprinting contracts
- validation contracts
- storage port contracts
- raw content event contracts
- Reddit provider output mapping contracts
- deterministic fixture contracts
- safe Raw Content error contracts
- export stability tests
- contract stability tests
- security tests
- dependency boundary tests
- deterministic tests
- repository verification

Non-goals:

- database persistence implementation
- Prisma repository implementation
- normalization algorithms
- hashing engine
- event bus implementation
- AI workflows
- opportunity generation
- REST APIs
- frontend
- scheduler
- worker
- database persistence
- business scoring logic

Verification commands:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-16
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Readiness gate:

- `@opportunity-os/raw-content` is implemented, tested, documented, and independently buildable
- public exports route through `packages/raw-content/src/index.ts`
- source metadata and provenance expose safe references and safe metadata placeholders only
- storage ports remain interface-only and do not introduce Prisma, SQL, database writes, repository implementations, or persistence behavior
- raw-content events remain event contract shapes and do not introduce an event bus, production transport, or persistence workflow
- Reddit-to-RawContent mapping remains boundary-only and does not execute provider calls, persist provider payloads, or expose raw provider responses
- deterministic fixtures contain no secrets, credentials, tokens, auth headers, DSNs, database URLs, raw provider payloads, or real provider responses
- Raw Content errors and validation failures remain secret-safe and stack-safe by default
- export stability, contract stability, security, dependency boundary, raw content model, and pipeline contract tests pass
- repository verification supports `phase-2-milestone-16` and blocks persistence implementation, Prisma repositories, normalization algorithms, hashing engines, event buses, AI workflows, opportunity generation, REST APIs, frontend, scheduler, worker, database persistence, and business scoring
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/raw-content`

Next milestone dependency:

- Phase 2 Milestone 17 consumes `@opportunity-os/raw-content` for canonical Raw Content contracts and hands off normalized canonical text contracts to Phase 2 Milestone 18.

## Phase 2 Milestone 17 — Normalization Pipeline

Goal:

Transform Raw Content into Canonical Content through contract-only, provenance-preserving normalization foundation work.

Owner:

- `packages/normalization`

Completed deliverables:

- `@opportunity-os/normalization` package boundary and public export boundary
- `phase-2-milestone-17` repository verification support
- canonical text and text segment contracts
- normalization input, output, operation, and stage vocabulary contracts
- deterministic cleaning contracts for markdown, HTML, Unicode, whitespace, and URL normalization
- language detection contracts
- text chunking contracts
- metadata preservation contracts
- provenance preservation contracts
- normalization validation contracts
- normalization result contracts
- normalization event contracts
- deterministic fixtures
- export stability tests
- security tests
- dependency-boundary tests
- pipeline integration tests
- package documentation and PR governance

Non-goals:

- embeddings
- LLMs
- AI analysis
- semantic interpretation
- normalization algorithm execution
- DOM or browser behavior
- network calls
- parser-library integrations
- event buses
- database persistence
- Prisma repositories
- opportunity generation
- REST APIs
- frontend implementation
- schedulers
- workers
- business scoring

Verification commands:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-17
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Readiness gate:

- `@opportunity-os/normalization` is implemented, tested, documented, and independently buildable
- public exports route through `packages/normalization/src/index.ts`
- canonical text, text segments, stage vocabulary, cleaning contracts, language contracts, chunking contracts, preservation contracts, validation contracts, result contracts, event contracts, and fixtures are available from the package root
- deterministic fixtures contain no secrets, credentials, tokens, auth headers, DSNs, database URLs, raw provider payloads, or real provider responses
- security tests confirm safe outputs do not leak secrets, raw provider payloads, stacks, or raw causes
- dependency-boundary tests continue blocking AI, persistence, APIs, frontend, workers, schedulers, and business scoring
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/normalization`
- repository verification supports `phase-2-milestone-17`

Next milestone dependency:

- Phase 2 Milestone 18 consumes `@opportunity-os/normalization` for canonical normalized text contracts and hands off provider-independent embedding contracts to Phase 2 Milestone 19.

## Phase 2 Milestone 18 — Embedding Foundation

Goal:

Define provider-independent embedding contracts for normalized content without provider execution.

Owner:

- `packages/embeddings`

Completed deliverables:

- `@opportunity-os/embeddings` package boundary and public export boundary
- `phase-2-milestone-18` repository verification support
- embedding primitive contracts
- provider abstraction contracts
- embedding request and response contracts
- chunk embedding contracts connected to normalized content
- embedding metadata and provenance contracts
- embedding validation contracts
- embedding cache contracts
- embedding result contracts
- secret-safe embedding error contracts
- embedding event contracts
- deterministic synthetic fixtures
- export stability tests
- contract stability tests
- security tests
- dependency-boundary tests
- pipeline integration tests
- package documentation and PR governance

Non-goals:

- OpenAI API calls
- Gemini API calls
- Voyage API calls
- provider SDKs
- vector databases
- model execution
- AI reasoning
- prompt execution
- cache implementation or persistence
- opportunity generation
- REST APIs
- frontend implementation
- schedulers
- workers
- business logic

Verification commands:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-18
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Readiness gate:

- `@opportunity-os/embeddings` is implemented, tested, documented, and independently buildable
- public exports route through `packages/embeddings/src/index.ts`
- embedding primitives, provider abstractions, requests, responses, chunk embedding contracts, metadata/provenance contracts, validation contracts, cache contracts, result contracts, error contracts, event contracts, and fixtures are available from the package root
- deterministic fixtures contain synthetic vectors only and no secrets, credentials, tokens, auth headers, DSNs, database URLs, raw provider payloads, real provider responses, or real embeddings
- security tests confirm safe outputs do not leak secrets, raw provider payloads, stacks, or raw causes
- dependency-boundary tests continue blocking provider SDKs, vector databases, persistence, APIs, frontend, workers, schedulers, and business scoring
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/embeddings`
- repository verification supports `phase-2-milestone-18`

Next milestone dependency:

- Phase 2 Milestone 19 must consume `@opportunity-os/embeddings` for provider-independent embedding contracts. Do not begin Phase 2 Milestone 19 until a scoped implementation task is approved.

## Phase 2 Milestone 19 — AI Analysis Pipeline

Goal:

Run AI-assisted analysis on normalized and embedded content.

Deliverables:

- prompt resolution
- AI provider adapter boundaries
- workflow orchestration
- extraction contracts
- analysis events
- safe telemetry
- deterministic test harnesses

## Phase 2 Milestone 20 — Opportunity Engine

Goal:

Generate explainable Opportunities from analyzed content.

Deliverables:

- opportunity domain model
- clustering
- trend detection
- deterministic scoring
- evidence and provenance links
- explainability output

## Phase 2 Milestone 21 — REST API

Goal:

Expose platform capabilities through API routes.

Deliverables:

- API application entry point
- routes and controllers
- request validation
- authentication and authorization integration
- API contract tests
- OpenAPI documentation

## Phase 2 Milestone 22 — Dashboard

Goal:

Expose Opportunity OS workflows through the user dashboard.

Deliverables:

- dashboard application entry point
- connector management UI
- opportunity explorer
- cluster and trend explorer
- reports
- Playwright coverage

Each future milestone must be independently demonstrable and must not bypass package boundaries established by Engineering Kit v3.0.


# Quality Gates

Every phase must satisfy:

## Architecture

- matches Architecture Specification

- respects platform boundaries

## Testing

- unit tests pass

- integration tests pass

- contract tests pass

## Documentation

- specifications updated

- API documentation generated

- migrations documented

## Observability

- logging enabled

- metrics available

- health checks implemented

## Security

- secrets externalized

- authentication enforced

- dependency scanning completed

# Definition of Done

A phase is complete only when:

- implementation is merged

- automated tests pass

- documentation is updated

- acceptance criteria are satisfied

- deployment pipeline succeeds

Partial implementation does not complete a phase.

# Success Criteria

Opportunity OS Version 1.0 is successful when:

- customer data is collected automatically

- customer problems are identified accurately

- Opportunities are generated with deterministic scores

- every recommendation is explainable

- the dashboard supports end-to-end exploration

- the platform is deployable and maintainable

# References

Depends on:

- All Foundation documents

- All Architecture documents

- All Specification documents

Referenced by:

- 04-002_CODEX_TASKS.md

- Release planning

- Sprint planning

# Revision History

| **Version** | **Date**                        | **Summary**                                                                                                                              |
|-------------|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| 2.0.0       | Initial Engineering Kit release | Defined the phased implementation roadmap, milestones, dependencies, quality gates, and success criteria for Opportunity OS Version 1.0. |
