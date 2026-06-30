# 04-001_ROADMAP.md


**Document ID:** 04-001
**Version:** 2.0.0
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

# Phase Overview

Phase 0

Repository Foundation

↓

Phase 1

Data Acquisition Platform

↓

Phase 2

Intelligence Platform

↓

Phase 3

Application Platform

↓

Phase 4

MVP Release

↓

Phase 5

Post-MVP Expansion

Each phase builds upon the previous one without requiring architectural redesign.

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

Slice A deliverables:

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

Slice A deliverables:

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

# Phase 1 — Data Acquisition Platform

## Goal

Acquire and persist customer data.

Deliverables:

- Connector Registry

- Connector Runner

- Scheduler

- Authentication Manager

- Event Publisher

- Raw Content persistence

- Reddit connector

- CSV importer

- JSON importer

Milestone:

Customer conversations can be collected and stored as immutable Raw Content.

# Phase 2 — Intelligence Platform

## Goal

Transform customer conversations into business intelligence.

Deliverables:

- Normalization Service

- Canonical Content generation

- AI Workflow Orchestrator

- Pain Point Extraction

- Problem Clustering

- Trend Engine

- Scoring Engine

- Opportunity Engine

Milestone:

The system generates explainable Opportunities from acquired content.


# Phase 3 — Application Platform

## Goal

Expose platform capabilities to users.

Deliverables:

- REST API

- Authentication

- Dashboard

- Opportunity Explorer

- Cluster Explorer

- Trend Explorer

- Connector Management

- Reports

Milestone:

Users can explore Opportunities through a complete web application.

# Phase 4 — MVP Release

## Goal

Prepare for production deployment.

Deliverables:

- performance optimization

- accessibility review

- security review

- observability

- documentation

- deployment automation

- monitoring

- backup procedures

Milestone:

Opportunity OS Version 1.0 is production-ready.

# Phase 5 — Post-MVP Expansion

Candidate initiatives:

- Xiaohongshu connector

- Douyin connector

- YouTube connector

- GitHub connector

- Enterprise connectors

- Alerts

- Collaboration

- Portfolio management

- Public API

- Mobile application

These initiatives are intentionally outside the MVP scope.

# Milestones

## M1

Repository operational.

## M2

Customer data acquisition operational.

## M3

Pain Point extraction operational.

## M4

Opportunity generation operational.

## M5

Dashboard operational.

## M6

Production deployment operational.

Each milestone must be independently demonstrable.

# Dependencies

Phase dependencies:

Repository

│

▼

Acquisition

│

▼

Intelligence

│

▼

Application

│

▼

Release

No phase should begin before its architectural dependencies are satisfied.


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
