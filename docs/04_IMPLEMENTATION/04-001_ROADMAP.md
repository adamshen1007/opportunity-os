# 04-001_ROADMAP.md


**Document ID:** 04-001
**Version:** 3.1.0
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

Engineering Kit v3.0 supersedes the initial high-level phase sketch with the milestone sequence completed through Phase 3 Milestone 25.

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
- Phase 2 M19 LLM Analysis Foundation
- Phase 2 M20 Structured Analysis Foundation
- Phase 2 M21 Opportunity Engine Foundation
- Phase 2 M22 Opportunity Pipeline Foundation
- Phase 2 M23 Candidate Opportunity Engine
- Phase 2 M24 Opportunity Generation Workflow
- Phase 3 M25 Opportunity Ranking Engine
- Phase 3 M26 REST API
- Phase 3 M27 Dashboard MVP
- Phase 3 M28 Product Validation Loop
- Phase 3 M29 Private Beta
- Phase 3 M30 Beta Operations
- Phase 4 M31 Local Product Runtime
- Phase 4 M32 Product Data Schema
- Phase 4 M33 Reddit Live Provider Transport

Current:

- Phase 4 M35 Multi-Source Scan Boundary
- Phase 4 M36 Stack Exchange Live Connector
- Phase 4 M37 Multi-Source Pipeline and Persistence
- Phase 4 M38 Dashboard Source Selection
- Phase 4 M39 Real-Data Product Validation
- Phase 4 M40 Production Runtime Composition
- Phase 4 M41 External API Security
- Phase 4 M42 Deployment Automation
- Phase 4 M43 Production Observability
- Phase 4 M44 Design-Partner Pilot

Slice G is the final External MVP Runtime readiness gate. It validates repository policy, lint, build, tests, Playwright, Docker Compose, env-gated Reddit smoke testing, env-gated LLM smoke testing, the deployment checklist, Reddit setup guide, LLM setup guide, dashboard walkthrough, smoke test report, and Go / No-Go decision in `docs/04_IMPLEMENTATION/04-022_EXTERNAL_MVP_READINESS_GATE.md`.

From Milestone 15 onward, Opportunity OS transitions from platform foundation to real provider and product capability. This transition remains staged: provider transport precedes Raw Content contracts, Raw Content precedes normalization, normalization precedes embeddings, embeddings precede LLM analysis contracts, LLM analysis precedes structured analysis contracts, structured analysis precedes Opportunity Engine contracts, Opportunity Engine contracts precede Opportunity Pipeline contracts, Opportunity Pipeline contracts precede Candidate Opportunity contracts, Candidate Opportunity contracts precede Opportunity Generation Workflow contracts, Opportunity Generation Workflow contracts precede Opportunity Ranking Engine product behavior, Opportunity Ranking Engine precedes REST APIs, REST APIs precede the dashboard, the dashboard precedes the Product Validation Loop, the Product Validation Loop precedes Private Beta deployment readiness, Private Beta deployment readiness precedes Beta Operations, Beta Operations precedes the Local Product Runtime, Local Product Runtime precedes Product Data Schema, Product Data Schema precedes controlled Reddit live provider transport, and controlled Reddit live provider transport precedes the hosted External MVP Runtime.

Milestones 35-39 remove Reddit approval from the product's critical path. Stack Exchange provides the first approved live validation datasource while Reddit remains environment-gated pending written approval. See `04-023_MULTI_SOURCE_PRODUCT_VALIDATION.md`.

Milestones 45-51 complete production connectivity, durable invite sessions, honest live-mode UX, persisted scan history, feedback continuity, API trust controls, and the closed-beta launch gate. See `04-026_EXTERNAL_USER_LAUNCH.md`.

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

- Phase 2 Milestone 19 consumes `@opportunity-os/embeddings` for provider-independent embedding contracts.

## Phase 2 Milestone 19 — LLM Analysis Foundation

Goal:

Define provider-independent LLM analysis contracts without provider execution, prompt runtime, extraction workflows, or business behavior.

Owner:

- `packages/llm-analysis`

Dependencies:

- `@opportunity-os/normalization`
- `@opportunity-os/embeddings`
- `@opportunity-os/raw-content`
- `@opportunity-os/shared`
- `@opportunity-os/events`

Deliverables:

- LLM provider abstraction contracts
- prompt contract types
- prompt template contracts
- prompt input and output contracts
- structured output contracts
- analysis request and response contracts
- analysis validation contracts
- safety and redaction contracts
- analysis result contracts
- secret-safe analysis error contracts
- analysis event contracts
- deterministic synthetic fixtures
- export stability tests
- contract stability tests
- security tests
- dependency-boundary tests
- pipeline integration tests
- package documentation and PR governance

Non-goals:

- provider SDKs
- OpenAI API calls
- Anthropic API calls
- Gemini API calls
- live LLM calls
- prompt execution runtime
- extraction workflows
- pain point extraction
- opportunity generation
- REST APIs
- frontend implementation
- persistence implementation
- schedulers
- workers
- business scoring

Verification commands:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-19
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Readiness gate:

- `@opportunity-os/llm-analysis` is implemented, tested, documented, and independently buildable
- public exports route through `packages/llm-analysis/src/index.ts`
- provider abstractions, prompts, prompt templates, prompt input/output contracts, structured output contracts, analysis request/response contracts, validation contracts, safety/redaction contracts, result contracts, error contracts, event contracts, and fixtures are available from the package root
- deterministic fixtures contain synthetic prompts, synthetic normalized content references, synthetic embedding references, and synthetic structured outputs only
- fixtures contain no provider payloads, API keys, real prompts, real embeddings, network references, credentials, tokens, auth headers, DSNs, database URLs, stack traces, or raw causes
- security tests confirm safe outputs do not leak secrets, provider payloads, stacks, or raw causes
- dependency-boundary tests continue blocking provider SDKs, provider APIs, persistence, APIs, frontend, schedulers, workers, and business scoring
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/llm-analysis`
- repository verification supports `phase-2-milestone-19`

Next milestone dependency:

- Phase 2 Milestone 20 consumes `@opportunity-os/llm-analysis` for provider-independent analysis contracts.

## Phase 2 Milestone 20 — Structured Analysis Foundation

Goal:

Define structured analysis contracts without provider execution, prompt runtime, AI reasoning, extraction workflows, opportunity generation, or business behavior.

Owner:

- `packages/analysis`

Dependencies:

- `@opportunity-os/llm-analysis`
- `@opportunity-os/embeddings`
- `@opportunity-os/normalization`
- `@opportunity-os/raw-content`
- `@opportunity-os/events`

Deliverables:

- structured analysis primitives
- analysis input and output contracts
- parser contracts
- schema validation contracts
- structured output normalization contracts
- evidence contracts
- confidence contracts
- analysis provenance contracts
- analysis validation contracts
- analysis result contracts
- secret-safe analysis error contracts
- analysis event contracts
- deterministic synthetic fixtures
- export stability tests
- contract stability tests
- security tests
- dependency-boundary tests
- pipeline integration tests
- package documentation and PR governance

Non-goals:

- OpenAI API calls
- Anthropic API calls
- Gemini API calls
- provider SDKs
- live provider calls
- prompt execution
- AI reasoning
- pain point extraction
- opportunity generation
- REST APIs
- frontend implementation
- persistence implementation
- schedulers
- workers
- business scoring
- provider payloads, API keys, real network behavior, or business examples

Verification commands:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-20
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Readiness gate:

- `@opportunity-os/analysis` is implemented, tested, documented, and independently buildable
- public exports route through `packages/analysis/src/index.ts`
- structured analysis primitives, inputs, outputs, parser contracts, schema validation contracts, normalization contracts, evidence contracts, confidence contracts, provenance contracts, validation contracts, results, errors, events, and fixtures are available from the package root
- deterministic fixtures contain synthetic analysis inputs, outputs, evidence, confidence metadata, provenance, and validation examples only
- fixtures contain no provider payloads, API keys, real network references, credentials, tokens, auth headers, DSNs, database URLs, stack traces, raw causes, or business examples
- security tests confirm safe outputs do not leak secrets, provider payloads, stacks, raw causes, or prompt internals
- dependency-boundary tests continue blocking provider SDKs, prompt execution runtimes, AI reasoning, persistence, APIs, frontend, schedulers, workers, database implementations, and business scoring
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/analysis`
- repository verification supports `phase-2-milestone-20`

Next milestone dependency:

- Phase 2 Milestone 21 consumes `@opportunity-os/analysis` for structured, validated analysis outputs.

## Phase 2 Milestone 21 — Opportunity Engine Foundation

Goal:

Define provider-independent Opportunity Engine contracts from analyzed content.

Owner:

- `packages/opportunity-engine`

Dependencies:

- `@opportunity-os/analysis`
- `@opportunity-os/llm-analysis`
- `@opportunity-os/embeddings`
- `@opportunity-os/normalization`
- `@opportunity-os/raw-content`
- `@opportunity-os/events`
- `@opportunity-os/shared`

Deliverables:

- opportunity package boundary
- opportunity primitive contracts
- opportunity source and evidence contracts
- opportunity hypothesis contracts
- opportunity score contracts
- opportunity confidence contracts
- opportunity ranking contracts
- opportunity validation contracts
- opportunity result contracts
- opportunity event contracts
- deterministic fixtures
- evidence and provenance links
- export stability tests
- contract stability tests
- security tests
- dependency-boundary tests
- upstream integration tests

Readiness gate:

- `@opportunity-os/opportunity-engine` builds as a strict TypeScript package
- public exports route through `packages/opportunity-engine/src/index.ts`
- repository verification supports `phase-2-milestone-21`
- implementation files are permitted only in approved foundation packages and `packages/opportunity-engine`
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/opportunity-engine`
- fixtures are deterministic, synthetic, and free of provider payloads, prompts, secrets, and business examples
- REST APIs, frontend implementation, persistence implementation, scheduler behavior, workers, live AI calls, prompt runtime behavior, billing, user accounts, production ranking algorithms, scoring implementations, extraction workflows, opportunity generation logic, and business workflows remain blocked

Verification commands:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-21
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Next milestone dependency:

- Phase 2 Milestone 22 consumes `@opportunity-os/opportunity-engine` for provider-independent opportunity contracts.

## Phase 2 Milestone 22 — Opportunity Pipeline Foundation

Goal:

Define provider-independent opportunity pipeline contracts from opportunity, analysis, embedding, normalization, raw-content, and event foundations.

Owner:

- `packages/opportunity-pipeline`

Dependencies:

- `@opportunity-os/opportunity-engine`
- `@opportunity-os/analysis`
- `@opportunity-os/llm-analysis`
- `@opportunity-os/embeddings`
- `@opportunity-os/normalization`
- `@opportunity-os/raw-content`
- `@opportunity-os/events`

Deliverables:

- opportunity pipeline package boundary
- evidence aggregation contracts
- hypothesis assembly contracts
- candidate opportunity contracts
- opportunity validation pipeline contracts
- pipeline stage contracts
- pipeline metadata contracts
- pipeline provenance contracts
- pipeline result contracts
- pipeline error contracts
- pipeline event contracts
- deterministic synthetic fixtures
- export stability tests
- contract stability tests
- security tests
- dependency-boundary tests
- upstream integration tests

Readiness gate:

- `@opportunity-os/opportunity-pipeline` builds as a strict TypeScript package
- public exports route through `packages/opportunity-pipeline/src/index.ts`
- repository verification supports `phase-2-milestone-22`
- implementation files are permitted only in approved foundation packages and `packages/opportunity-pipeline`
- pipeline primitives, stage contracts, metadata, provenance, evidence aggregation contracts, hypothesis assembly contracts, candidate opportunity contracts, validation contracts, result contracts, error contracts, event contracts, and deterministic fixture contracts are available from the package root
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/opportunity-pipeline`
- fixtures are deterministic, synthetic, and free of provider payloads, prompts, secrets, and production business examples
- export stability, contract stability, dependency-boundary, security, fixture, and upstream integration tests pass
- business scoring algorithms, ranking algorithms, recommendation engines, REST APIs, frontend implementation, persistence implementation, schedulers, workers, provider SDKs, workflow engines, aggregation algorithms, generation logic, execution behavior, and business workflows remain blocked

Verification commands:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-22
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Next milestone dependency:

- Phase 2 Milestone 23 consumes `@opportunity-os/opportunity-pipeline` for provider-independent pipeline contracts. Do not begin REST API work until a scoped implementation task is approved.

## Phase 2 Milestone 23 — Candidate Opportunity Engine

Goal:

Define provider-independent candidate opportunity contracts.

Owner:

- `packages/opportunity-candidates`

Dependencies:

- `@opportunity-os/opportunity-pipeline`
- `@opportunity-os/opportunity-engine`
- `@opportunity-os/analysis`
- `@opportunity-os/llm-analysis`
- `@opportunity-os/embeddings`

Deliverables:

- candidate opportunity package boundary
- strict TypeScript package scaffold
- package README
- package test config
- public export boundary
- repository verification support for `phase-2-milestone-23`
- candidate opportunity contracts
- candidate lifecycle contracts
- candidate validation contracts
- evidence completeness contracts
- confidence aggregation contracts
- candidate metadata contracts
- candidate provenance contracts
- candidate event contracts
- candidate error contracts
- candidate result contracts
- deterministic fixtures
- export stability tests
- contract stability tests
- security tests
- dependency-boundary tests
- upstream integration tests
- root workspace pipeline integration

Readiness gate:

- `@opportunity-os/opportunity-candidates` builds as a strict TypeScript package
- public exports route through `packages/opportunity-candidates/src/index.ts`
- repository verification supports `phase-2-milestone-23`
- implementation files are permitted only in approved foundation packages and `packages/opportunity-candidates`
- deterministic fixtures are synthetic and free of provider payloads, prompts, secrets, and production business examples
- export stability, contract stability, dependency-boundary, security, fixture, and upstream integration tests pass
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/opportunity-candidates`
- production ranking algorithms, recommendation engines, business scoring, REST APIs, frontend implementation, persistence implementation, schedulers, workers, provider SDKs, and business workflows remain blocked

Verification commands:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-23
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Next milestone dependency:

- Phase 2 Milestone 24 may consume `@opportunity-os/opportunity-candidates` for provider-independent candidate opportunity contracts. Do not begin REST API work until a scoped implementation task is approved.

## Phase 2 Milestone 24 — Opportunity Generation Workflow

Goal:

Define deterministic candidate-to-opportunity generation workflow contracts.

Owner:

- `packages/opportunity-generation`

Dependencies:

- `@opportunity-os/opportunity-candidates`
- `@opportunity-os/opportunity-pipeline`
- `@opportunity-os/opportunity-engine`
- `@opportunity-os/analysis`
- `@opportunity-os/events`
- `@opportunity-os/shared`

Deliverables:

- opportunity generation package boundary
- strict TypeScript package scaffold
- package README
- package test config
- public export boundary
- repository verification support for `phase-2-milestone-24`
- candidate-to-opportunity generation workflow contracts
- deterministic opportunity generation service contracts
- opportunity generation input/output contracts
- evidence-to-hypothesis assembly behavior contracts
- candidate validation behavior contracts
- confidence aggregation behavior contracts
- generated opportunity result contracts
- generation error contracts
- generation event contracts
- deterministic fixtures
- export stability tests
- contract stability tests
- dependency-boundary tests
- security tests
- upstream integration tests
- deterministic service tests
- root workspace pipeline integration

Readiness gate:

- `@opportunity-os/opportunity-generation` builds as a strict TypeScript package
- public exports route through `packages/opportunity-generation/src/index.ts`
- repository verification supports `phase-2-milestone-24`
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/opportunity-generation`
- deterministic fixture, export-stability, contract-stability, dependency-boundary, security, upstream integration, and service tests cover the package surface
- generated opportunity contracts preserve upstream candidate, opportunity pipeline, opportunity engine, analysis, event, and shared metadata references
- implementation files are permitted only in approved foundation packages and `packages/opportunity-generation`
- production ranking, recommendation engines, business scoring, REST APIs, frontend implementation, persistence implementation, schedulers, workers, billing, user accounts, provider SDKs, live AI providers, prompt execution, provider payloads, and business workflows remain blocked

Verification commands:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-24
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Next milestone dependency:

- Phase 3 Milestone 25 may consume `@opportunity-os/opportunity-generation` for deterministic candidate-to-opportunity generation workflow contracts. Do not begin REST API work until a later scoped implementation task is approved.

## Phase 3 Milestone 25 — Opportunity Ranking Engine

Goal:

Convert validated Opportunity Candidates into ranked Opportunities using deterministic ranking logic.

Owner:

- `packages/opportunity-ranking`

Dependencies:

- `@opportunity-os/opportunity-generation`
- `@opportunity-os/opportunity-candidates`
- `@opportunity-os/opportunity-pipeline`
- `@opportunity-os/opportunity-engine`
- `@opportunity-os/analysis`
- `@opportunity-os/shared`
- `@opportunity-os/events`

Completed deliverables:

- opportunity ranking package boundary
- strict TypeScript package scaffold
- package README
- package test config
- public export boundary
- repository verification support for `phase-3-milestone-25`
- deterministic ranking primitives
- ranking inputs and outputs
- ranking signals, factors, and weights
- deterministic score calculation
- ranking pipeline behavior
- stable tie breaking
- explanation model
- ranking validation, results, errors, and events
- deterministic synthetic ranking fixtures
- export stability tests
- contract stability tests
- ranking behavior and quality tests
- security tests
- dependency-boundary tests
- upstream integration tests
- workspace integration through root `pnpm lint`, `pnpm build`, and `pnpm test`
- documentation, governance, roadmap, and PR checklist updates

Readiness gate:

- `@opportunity-os/opportunity-ranking` builds as a strict TypeScript package
- public exports route through `packages/opportunity-ranking/src/index.ts`
- repository verification supports `phase-3-milestone-25`
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/opportunity-ranking`
- deterministic fixtures, export-stability, contract-stability, ranking behavior, ranking quality, dependency-boundary, security, and upstream integration tests cover the package surface
- every ranking decision is explainable from explicit inputs, signals, factors, and weights
- implementation files are permitted only in approved packages and `packages/opportunity-ranking`
- recommendation engines, REST APIs, frontend implementation, persistence implementation, schedulers, workers, billing, user accounts, provider SDKs, ML behavior, LLM calls, hidden heuristics, prompts, provider payloads, secrets, and production business examples remain blocked

Verification commands:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-25
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Next milestone dependency:

- Phase 3 Milestone 26 consumes `@opportunity-os/opportunity-ranking` for deterministic, testable, explainable ranked opportunity behavior through the `apps/api` REST API application boundary.

## Phase 3 Milestone 26 — REST API

Goal:

Expose platform capabilities through API routes.

Owner:

- `apps/api`

Dependencies:

- `@opportunity-os/opportunity-ranking`
- `@opportunity-os/opportunity-generation`
- `@opportunity-os/opportunity-candidates`
- `@opportunity-os/opportunity-pipeline`
- `@opportunity-os/opportunity-engine`

Completed deliverables:

- `apps/api` strict TypeScript application scaffold
- explicit API bootstrap exports
- `phase-3-milestone-26` repository verification gate
- API application entry point
- routing contracts and deterministic route definitions
- OpenAPI contracts
- health endpoint
- opportunity DTOs and opportunity routes
- ranking DTOs and ranking routes
- pagination and filtering
- request validation
- error mapping
- authentication and authorization contracts
- request context contracts
- application-facing opportunity and ranking ports
- API versioning
- deterministic synthetic fixtures
- API integration tests
- API security tests
- contract stability tests
- dependency-boundary tests
- workspace integration through root `pnpm lint`, `pnpm build`, and `pnpm test`
- API contract tests
- documentation, governance, roadmap, and PR checklist updates

Readiness gate:

- `apps/api` builds as a strict TypeScript application package
- public exports route through `apps/api/src/index.ts`
- repository verification supports `phase-3-milestone-26`
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/api`
- deterministic fixtures, API integration tests, API security tests, contract stability tests, dependency-boundary tests, endpoint tests, and infrastructure tests cover the API surface
- health, opportunity, and ranking endpoints use explicit ports and deterministic request/response envelopes
- authentication and authorization remain contract-based; no production authentication provider is introduced
- implementation files are permitted only in approved packages and `apps/api`
- frontend implementation, billing, user management, analytics, notifications, production authentication providers, persistence changes, schedulers, workers, provider SDKs, and unrelated product workflows remain blocked

Verification commands:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-26
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Next milestone dependency:

- Phase 3 Milestone 27 may consume `apps/api` as the completed REST API boundary for dashboard integration. Do not begin dashboard implementation until a scoped implementation task is approved.

## Phase 3 Milestone 27 — Dashboard MVP

Goal:

Expose Opportunity OS workflows through the user dashboard.

Owner:

- `apps/web`

Dependencies:

- `apps/api`

Deliverables:

- application routing
- Next.js App Router dashboard app scaffold
- strict TypeScript configuration
- `@opportunity-os/web` package metadata
- independent web app build script
- dashboard shell layout
- sidebar and topbar navigation
- Opportunity List page
- Opportunity Detail page
- Ranking View
- Evidence View
- Search UI
- Filter UI
- Pagination UI
- loading states
- error states
- empty states
- typed API integration layer
- OpenAPI client generation configuration
- generated route contract
- deterministic frontend fixtures
- unit and component test infrastructure
- dashboard security tests
- dependency-boundary tests
- route and contract stability tests
- Playwright desktop and mobile browser coverage
- dashboard ownership documentation
- `phase-3-milestone-27` repository verification gate

Non-goals:

- authentication implementation
- billing
- analytics
- notifications
- user accounts
- production deployment
- persistence changes
- recommendation engine
- mobile app
- schedulers
- workers
- provider SDKs
- unrelated backend changes

Verification commands:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-27
pnpm --filter @opportunity-os/web build
pnpm --filter @opportunity-os/web test
pnpm --filter @opportunity-os/web test:e2e
pnpm lint
pnpm build
pnpm test
docker compose config
```

Readiness:

- `apps/web` is implemented, tested, documented, and independently buildable
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/web`
- repository verification supports `phase-3-milestone-27`
- dashboard routes, UI states, API integration, security tests, route stability tests, dependency-boundary tests, and Playwright coverage pass
- authentication implementation, billing, analytics, notifications, user accounts, production deployment, persistence changes, recommendation engines, mobile apps, schedulers, workers, provider SDKs, and unrelated backend changes remain absent

Next milestone dependency:

- Phase 3 Milestone 28 may consume `apps/api`, `apps/web`, and deterministic product packages to prepare design-partner validation. Do not begin Product Validation Loop implementation until a scoped implementation task is approved.

## Phase 3 Milestone 28 — Product Validation Loop

Goal:

Prepare Opportunity OS for design-partner validation by adding deterministic product validation behavior on top of the REST API and Dashboard MVP.

Owners:

- `apps/api`
- `apps/web`

Dependencies:

- `apps/api`
- `apps/web`
- `@opportunity-os/opportunity-ranking`
- `@opportunity-os/opportunity-generation`
- `@opportunity-os/opportunity-candidates`
- `@opportunity-os/opportunity-engine`

Deliverables:

- `phase-3-milestone-28` repository verification gate
- deterministic product validation documentation
- API feedback DTOs, validation, safe errors, in-memory feedback store behavior, and feedback routes
- dashboard feedback interactions for save, dismiss, usefulness rating, evidence quality rating, ranking quality rating, and feedback reason categories
- cross-app API/web feedback contract alignment tests
- deterministic feedback fixtures
- demo-ready validation states
- design-partner walkthrough documentation

Non-goals:

- production persistence
- billing
- analytics platforms
- notifications
- email
- CRM integrations
- schedulers
- workers
- mobile apps
- complex admin console
- unrelated product systems

Final readiness verification commands:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-28
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
pnpm --filter @opportunity-os/web test:e2e
docker compose config
```

Readiness:

- repository verification supports `phase-3-milestone-28`
- Product Validation Loop work is documented as deterministic product validation only
- API feedback DTOs, validation, in-memory store behavior, route handlers, fixtures, integration tests, security tests, and contract stability tests pass
- dashboard feedback API client, save/dismiss workflow, ratings, reason categories, validation summary, search/filter improvements, fixtures, browser tests, and alignment tests pass
- design-partner walkthrough documentation is current
- production persistence, billing, analytics platforms, notifications, email, CRM integrations, schedulers, workers, mobile apps, complex admin consoles, and unrelated product systems remain absent

Next milestone dependency:

- Phase 3 Milestone 29 consumes completed Product Validation Loop outcomes and begins Private Beta deployment readiness. Slice A may establish deployment architecture, deployment configuration, repository verification, and governance only.

## Phase 3 Milestone 29 — Private Beta

Goal:

Prepare Opportunity OS for hosted Private Beta use by the first 10-20 design partners.

Owners:

- `apps/api`
- `apps/web`
- `.github/workflows/deploy.yml`
- deployment and operations documentation

Dependencies:

- Phase 3 Milestone 28 Product Validation Loop
- `apps/api`
- `apps/web`
- `@opportunity-os/opportunity-ranking`
- `@opportunity-os/opportunity-generation`

Slice A deliverables:

- `phase-3-milestone-29` repository verification gate
- Private Beta boundaries
- deployment architecture
- deployment readiness configuration
- `docs/04_IMPLEMENTATION/04-004_PRIVATE_BETA_DEPLOYMENT.md`
- governance updates for Private Beta changes

Slice B deliverables:

- deployment workflow hardening
- production config template in `config/private-beta.env.example`
- secrets management policy
- health monitoring policy
- operational logging policy
- monitoring strategy
- backup strategy
- `docs/04_IMPLEMENTATION/04-005_PRIVATE_BETA_OPERATIONS.md`
- repository verification updates for the operations baseline

Slice C deliverables:

- invite contracts
- invite validation
- session management
- minimal persistence schema for `PrivateBetaInvite` and `PrivateBetaSession`
- secret-safe invite-only API tests
- repository verification updates for invite-only authentication and persistence

Slice D deliverables:

- protected dashboard state
- onboarding state
- feedback persistence schema for `PrivateBetaFeedback`
- save/dismiss persistence path
- bug reporting schema and API route
- invite workflow UI coverage
- deterministic API and dashboard tests

Slice E deliverables:

- config binding documentation
- clear deployment instructions
- rollback guidance
- monitoring guidance
- beta operations documentation
- operational runbook in `docs/04_IMPLEMENTATION/04-006_PRIVATE_BETA_RUNBOOK.md`
- beta checklist in `docs/04_IMPLEMENTATION/04-007_PRIVATE_BETA_CHECKLIST.md`

Allowed in later scoped Private Beta slices:

- production deployment
- production configuration
- monitoring
- health monitoring
- logging
- backup strategy

Non-goals:

- payments
- subscriptions
- enterprise features
- notifications
- CRM integrations
- multi-tenancy

Slice E verification commands:

```sh
pnpm build
```

Readiness:

- repository verification supports `phase-3-milestone-29`
- Private Beta deployment readiness is documented
- deployment architecture and deployment readiness configuration exist
- production config, secrets management, health monitoring, operational logging, monitoring strategy, and backup strategy are documented
- config binding, deployment instructions, rollback guidance, monitoring guidance, beta checklist, and operational runbook are documented
- invite-only authentication and session management are deterministic and secret-safe
- persistence is limited to Private Beta invites, sessions, feedback, and bug reports
- protected dashboard, onboarding, save/dismiss, bug reporting, and invite workflow behavior is deterministic
- `apps/api` and `apps/web` remain the API and dashboard boundaries
- payments, subscriptions, enterprise features, notifications, CRM integrations, multi-tenancy, and unscoped product systems remain absent

Next milestone dependency:

- Later Private Beta slices may add scoped monitoring integrations and deployment execution only after the current Private Beta slice is committed, pushed, tagged, and verified.

## Phase 3 Milestone 30 — Beta Operations

Goal:

Prepare Opportunity OS for real-world usage by the first 10-20 design partners through operational verification, documentation, and launch discipline.

Milestone 30 is operations-only. It does not add new product capabilities.

Slice A deliverables:

- Phase 3 Milestone 30 Beta Operations boundary documentation
- repository verifier support for `phase-3-milestone-30`
- active `review` gate updated to the Beta Operations boundary
- governance that keeps the milestone limited to operational readiness

Slice B deliverables:

- deployment verification procedure
- deployment smoke testing procedure
- rollback verification procedure
- monitoring verification procedure
- health verification procedure
- log verification procedure
- `docs/04_IMPLEMENTATION/04-008_BETA_OPERATIONS_VERIFICATION.md`

Slice C deliverables:

- operator handbook
- beta handbook
- invite documentation
- onboarding workflow
- support documentation
- `docs/04_IMPLEMENTATION/04-009_BETA_OPERATOR_HANDBOOK.md`
- `docs/04_IMPLEMENTATION/04-010_BETA_USER_HANDBOOK.md`
- `docs/04_IMPLEMENTATION/04-011_BETA_SUPPORT_GUIDE.md`

Slice D deliverables:

- bug triage workflow
- feature request workflow
- feedback review workflow
- production readiness checklist
- release checklist
- launch checklist
- troubleshooting guide
- `docs/04_IMPLEMENTATION/04-012_BETA_OPERATIONAL_WORKFLOWS.md`
- `docs/04_IMPLEMENTATION/04-013_PRODUCTION_READINESS_CHECKLIST.md`
- `docs/04_IMPLEMENTATION/04-014_RELEASE_CHECKLIST.md`
- `docs/04_IMPLEMENTATION/04-015_LAUNCH_CHECKLIST.md`
- `docs/04_IMPLEMENTATION/04-016_BETA_TROUBLESHOOTING_GUIDE.md`

Slice E deliverables:

- PR governance for Beta Operations review
- documentation index synchronization
- implementation order synchronization
- consistency verification in `scripts/verify-repository.mjs`
- `.github/pull_request_template.md` Beta Operations review checklist
- `node scripts/verify-repository.mjs --phase review`

Non-goals:

- new backend features
- new AI features
- new APIs
- new dashboard features
- new persistence features
- new authentication features
- payments
- CRM integrations
- notifications
- analytics platforms
- mobile apps
- schedulers
- workers

Slice A verification commands:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-30
pnpm lint
pnpm build
```

Slice B verification command:

```sh
pnpm build
```

Slice C verification command:

```sh
pnpm build
```

Slice D verification command:

```sh
pnpm build
```

Slice E verification command:

```sh
node scripts/verify-repository.mjs --phase review
```

Readiness:

- repository verification supports `phase-3-milestone-30`
- the active review gate enforces Beta Operations policy
- Beta Operations is documented as operations-only
- deployment verification, smoke testing, rollback verification, monitoring verification, health verification, and log verification are documented
- operator handbook, beta handbook, invite documentation, onboarding workflow, and support documentation are documented
- bug triage, feature request, feedback review, production readiness, release, launch, and troubleshooting workflows are documented
- PR governance, documentation index, implementation order, and consistency verification are synchronized
- Private Beta deployment readiness remains intact
- new backend features, AI features, payments, CRM integrations, notifications, analytics platforms, mobile apps, schedulers, workers, and unscoped product systems remain absent

## Phase 4 Milestones 53-57 - External User Scale Readiness

Completed deliverables:

- current-session inspection, durable session revocation, cookie clearing, and first-login guidance
- durable queued/running/completed/failed/cancelled scan jobs with API restart and browser reload recovery
- malformed-evidence rejection, source deduplication, confidence limitations, and explainable ranking factors
- scan and feedback deletion endpoints plus a user-facing privacy and data-controls page
- safe authenticated operations counters for request health, latency, and scan outcomes
- repository verification support through `phase-4-milestone-57`

Readiness is defined in `docs/04_IMPLEMENTATION/04-027_EXTERNAL_USER_SCALE_READINESS.md`. Broad self-service registration, horizontal scan execution, and durable third-party metrics are future work.

Each future milestone must be independently demonstrable and must not bypass package boundaries established by Engineering Kit v3.0.

## Phase 4.5 - Design-Partner Readiness

Phase 4.5 is the active execution boundary after Phase 4 Milestones 53-57. It prepares Opportunity OS for a safe, valuable design-partner pilot through two parallel workstreams defined in `docs/04_IMPLEMENTATION/04-028_PHASE_4_5_EXECUTION_PLAN.md`.

Workstream A - Production Safety Before Design Partners:

- `TASK-P45-A01` Hosted Deployment Verification
- `TASK-P45-A02` Database Migration Verification
- `TASK-P45-A03` Production Authentication Hardening
- `TASK-P45-A04` User Ownership Isolation
- `TASK-P45-A05` Deletion Correctness
- `TASK-P45-A06` Monitoring And Alerting
- `TASK-P45-A07` Backup And Restore Verification

Workstream B - Opportunity Intelligence Quality:

- `TASK-P45-B01` Opportunity Quality Benchmark
- `TASK-P45-B02` Evidence Clustering
- `TASK-P45-B03` Opportunity Synthesis
- `TASK-P45-B04` Ranking Improvement
- `TASK-P45-B05` LLM Output Validation

Convergence gate:

- `TASK-P45-G01` Safe And Valuable Design-Partner Pilot Gate

The workstreams execute in parallel but must converge before external invitations are issued. Workstream A alone would produce a safe but insufficiently valuable pilot. Workstream B alone would produce higher-quality output without adequate user and operational protection.

Phase 4.5 must not add enterprise identity, multi-tenancy, payments, subscriptions, CRM integrations, notifications, new connectors, schedulers, workers, or infrastructure that is not required for the design-partner pilot.

Readiness requires:

- verified hosted deployment, migration, rollback, monitoring, and restore procedures
- hardened invite-only authentication and per-user ownership isolation
- transactional owner-scoped deletion
- a frozen opportunity-quality benchmark
- deterministic evidence clustering and cluster-based opportunity synthesis
- opportunity-specific demand and ranking signals
- schema-validated, citation-grounded live LLM output
- one passing two-user hosted pilot rehearsal

Monitoring and recovery implementation is defined in `docs/04_IMPLEMENTATION/04-033_PHASE_4_5_MONITORING_AND_RECOVERY.md`. Repository controls are complete, but design-partner invitations remain blocked until alert delivery, hosted backup retention, and an isolated restore rehearsal have operator evidence.

The final convergence decision is recorded in `docs/04_IMPLEMENTATION/04-034_PHASE_4_5_PILOT_GATE.md` and validated by `pnpm verify:pilot-gate`. As of 2026-07-29 the decision is `NO-GO`: the canonical services expose different commits, final hosted migration and rollback evidence are incomplete, the two-user hosted journey is incomplete, and automated backups do not meet the required 24-hour RPO.

No Phase 4.5 task may bypass the existing ownership boundaries of `packages/database`, `packages/analysis`, `packages/opportunity-pipeline`, `packages/opportunity-candidates`, `packages/opportunity-generation`, `packages/opportunity-ranking`, `packages/llm-analysis`, `apps/api`, or `apps/web`.


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
| 3.0.1       | 2026-07-03                      | Updated the roadmap to reflect completed Phase 3 Milestone 25 Opportunity Ranking Engine work and the Phase 3 Milestone 26 REST API handoff. |
| 3.0.2       | 2026-07-03                      | Updated the roadmap to reflect completed Phase 3 Milestone 26 REST API work and the Phase 3 Milestone 27 dashboard handoff. |
| 3.0.3       | 2026-07-03                      | Added the Phase 3 Milestone 27 Dashboard MVP foundation boundary and verification gate. |
| 3.0.4       | 2026-07-03                      | Completed the Phase 3 Milestone 27 Dashboard MVP roadmap, governance, browser coverage, and readiness gate. |
| 3.0.5       | 2026-07-04                      | Added the Phase 3 Milestone 30 Beta Operations boundary and verification gate. |
| 3.0.6       | 2026-07-04                      | Added Phase 3 Milestone 30 operator, beta user, invite, onboarding, and support documentation. |
| 3.0.7       | 2026-07-04                      | Added Phase 3 Milestone 30 bug triage, feature request, feedback review, readiness, release, launch, and troubleshooting documentation. |
| 3.0.8       | 2026-07-04                      | Added Phase 3 Milestone 30 PR governance and documentation consistency verification. |
| 3.1.0       | 2026-07-28                      | Added the Phase 4.5 parallel production-safety and opportunity-intelligence workstreams with stable task identifiers and a shared design-partner pilot gate. |
