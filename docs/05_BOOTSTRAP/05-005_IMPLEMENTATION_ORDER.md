# 05-005_IMPLEMENTATION_ORDER.md

**Document ID:** 05-005
**Version:** 3.0.0
**Status:** Approved (Engineering Kit v3.0)
**Layer:** 4 - Repository Bootstrap
**Owner:** Architecture Team

# Implementation Order

This document is the authoritative build sequence for Opportunity OS after completion of Phase 2 Milestone 14.

Every Codex task must follow this order unless an approved Architecture Decision Record explicitly supersedes it.

## Build Principles

- Build contracts before implementations.
- Keep each milestone independently verifiable.
- Keep package boundaries explicit.
- Do not skip persistence, event, runtime, or security gates.
- Do not introduce business logic before its owning milestone.
- Do not begin the next milestone until the current milestone is committed, pushed, tagged, and verified.

## Completed Milestones

The following milestones are complete in Engineering Kit v3.0:

| Milestone | Status | Owner |
|-----------|--------|-------|
| Phase 0 - Repository Foundation | Complete | repository foundation |
| Phase 1 M1 - Runtime Configuration | Complete | `packages/config` |
| Phase 1 M2 - Shared Foundation | Complete | `packages/types`, `packages/errors`, `packages/utils`, `packages/shared` |
| Phase 1 M3 - Logging Foundation | Complete | `packages/shared` |
| Phase 1 M4 - Event Foundation | Complete | `packages/events` |
| Phase 1 M5 - Database Foundation | Complete | `packages/database` |
| Phase 1 M6 - Domain Foundation | Complete | `packages/domain` |
| Phase 1 M7 - Application Foundation | Complete | `packages/application` |
| Phase 1 M8 - Dependency Injection & Composition | Complete | `packages/container` |
| Phase 1 M9 - Infrastructure Composition | Complete | `packages/infrastructure` |
| Phase 2 M10 - Connector SDK Foundation | Complete | `packages/connectors` |
| Phase 2 M11 - Connector Runtime Foundation | Complete | `packages/connector-runtime` |
| Phase 2 M12 - Connector Host Foundation | Complete | `packages/connector-host` |
| Phase 2 M13 - Reddit Connector Foundation | Complete | `packages/connectors-reddit` |
| Phase 2 M14 - Reddit Runtime | Complete | `packages/connectors-reddit` |

## Current Platform State

The repository now contains foundation packages, connector SDK/runtime/host contracts, Reddit connector contracts, and deterministic non-network Reddit runtime behavior.

The repository does not yet contain:

- Raw Content persistence workflows
- live Reddit provider transport
- OAuth token exchange
- HTTP clients
- schedulers
- workers
- AI workflows
- opportunity generation
- REST APIs
- frontend implementation
- product business logic

## Future Build Sequence

Engineering Kit v3.0 establishes this future order:

| Milestone | Goal | Primary Owner |
|-----------|------|---------------|
| Phase 2 M15 - Reddit Provider Transport | Add Reddit provider integration architecture: OAuth contracts, HTTP transport abstraction, API client abstraction, request builder, response parser, pagination transport, rate-limit parsing, runtime compatibility, error mapping, telemetry, and fake transport tests. | `packages/connectors-reddit` |
| Phase 2 M16 - Raw Content Pipeline | Introduce Raw Content contracts, persistence, ingestion records, provenance, immutable storage, and acquisition events. | `packages/database`, `packages/domain`, `packages/application`, future acquisition modules |
| Phase 2 M17 - Normalization Pipeline | Transform Raw Content into Canonical Content with provenance-preserving normalization contracts and tests. | future intelligence modules |
| Phase 2 M18 - AI Analysis Pipeline | Add AI workflow orchestration, prompt resolution, provider adapters, extraction contracts, and analysis events. | future AI/intelligence modules |
| Phase 2 M19 - Opportunity Engine | Implement opportunity generation, clustering, trend detection, deterministic scoring, and explainability contracts. | future intelligence/domain/application modules |
| Phase 2 M20 - REST API | Implement API routes, controllers, request validation, authentication/authorization integration, and API contract tests. | future app/API modules |
| Phase 2 M21 - Dashboard | Implement frontend dashboard, connector management, opportunity explorer, reports, and browser tests. | future app/frontend modules |

## Phase 2 M15 Boundary

Milestone 15 is the first milestone after the platform foundation sequence.

It may begin real provider integration architecture for Reddit, but it must not implement product workflows.

Allowed:

- OAuth contract implementation
- Reddit API client abstraction
- HTTP transport abstraction
- request builder
- response parser
- pagination transport
- rate-limit parsing
- retry compatibility
- timeout compatibility
- cancellation compatibility
- authentication lifecycle
- error mapping
- telemetry integration
- deterministic fake transport and test infrastructure
- documentation and repository verification updates

Not allowed:

- Raw Content persistence
- AI workflows
- opportunity generation
- REST APIs
- frontend
- scheduler
- worker
- business logic
- database persistence workflows

## Required Verification Gate

Every implementation milestone from M15 onward must pass:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase <milestone-phase>
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

For Milestone 15, `<milestone-phase>` must be:

```sh
phase-2-milestone-15
```

## Codex Execution Rules

Every Codex implementation session must:

1. Work on one scoped task or approved slice only.
2. Read the relevant Engineering Kit and Developer AI documents.
3. Modify only the files allowed by the task.
4. Preserve package boundaries.
5. Add deterministic tests with implementation changes.
6. Keep safe error and logging behavior secret-safe.
7. Run the required verification commands.
8. Stop after the assigned task is complete.

Do not begin Phase 2 Milestone 15 until an implementation task explicitly scopes it.

## Definition of Complete

A milestone is complete only when:

- implementation is committed
- tests pass
- repository verification passes
- Docker Compose config validates when required
- documentation matches implementation
- prohibited work remains absent
- the milestone is tagged

## Revision History

| Version | Summary |
|---------|---------|
| 2.0.0 | Defined the initial repository bootstrap implementation sequence. |
| 3.0.0 | Rebased the canonical implementation order on completed work through Phase 2 Milestone 14 and defined the Milestone 15 provider transport transition. |
