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
| Phase 2 M16 - Raw Content Pipeline Foundation | Introduce Raw Content contracts, source metadata, ingestion metadata, provenance, normalization boundaries, deduplication, fingerprinting, validation, storage ports, events, Reddit provider mapping, deterministic tests, and verification. | `packages/raw-content`, `packages/connectors-reddit`, `packages/events`, `packages/domain`, `packages/application`, `packages/database`, `packages/shared` |
| Phase 2 M17 - Normalization Pipeline | Transform Raw Content into Canonical Content with provenance-preserving normalization contracts and tests. | future intelligence modules |
| Phase 2 M18 - AI Analysis Pipeline | Add AI workflow orchestration, prompt resolution, provider adapters, extraction contracts, and analysis events. | future AI/intelligence modules |
| Phase 2 M19 - Opportunity Engine | Implement opportunity generation, clustering, trend detection, deterministic scoring, and explainability contracts. | future intelligence/domain/application modules |
| Phase 2 M20 - REST API | Implement API routes, controllers, request validation, authentication/authorization integration, and API contract tests. | future app/API modules |
| Phase 2 M21 - Dashboard | Implement frontend dashboard, connector management, opportunity explorer, reports, and browser tests. | future app/frontend modules |

## Phase 2 M15 Boundary

Milestone 15 is the first milestone after the platform foundation sequence.

It may begin real provider integration architecture for Reddit, but it must not implement product workflows.

Slice A establishes the `phase-2-milestone-15` verifier gate and provider module export structure. Provider transport exports must route through `packages/connectors-reddit/src/provider/index.ts` and remain re-exported from the package root.

Slice B defines provider authentication, HTTP transport abstraction, API client, and deterministic request-building contracts only. It does not perform token exchange, refresh calls, live provider calls, scheduling, persistence, route handling, or product behavior.

Slice C defines safe response parsing, pagination transport metadata, and rate-limit parsing only. It does not persist provider responses, run pagination loops, schedule work, or execute transport requests.

Slice D defines runtime compatibility, auth lifecycle, provider error, telemetry, and DI binding contracts only. It does not implement retry runners, timers, process signal handling, worker cancellation, telemetry vendors, event buses, runtime containers, application startup, or dependency resolution.

Slice E hardens the provider transport boundary with deterministic fixtures, fake transport tests, integration coverage, security checks, contract stability checks, dependency boundary tests, and repository verification. It does not introduce live-network behavior.

Slice F completes provider transport documentation, governance, roadmap updates, and the final readiness gate. It confirms default tests use fake transport and deterministic fixtures only; no live Reddit calls are required.

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

Dependency direction:

- `packages/connectors-reddit` owns Reddit Provider Transport
- provider transport may reference the approved connector, runtime, host, shared logging, event, and container foundations
- future packages must consume `@opportunity-os/connectors-reddit`

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

Milestone 15 is complete only when provider transport is implemented, tested, documented, independently buildable, verified by `phase-2-milestone-15`, and free of Raw Content persistence, AI workflows, opportunity generation, REST APIs, frontend, scheduler, worker, database persistence, and business logic.

## Phase 2 M16 Boundary

Milestone 16 establishes the Raw Content Pipeline Foundation in `packages/raw-content`.

Slice A creates the strict TypeScript package boundary and the `phase-2-milestone-16` repository verification gate. Public exports must route through `packages/raw-content/src/index.ts`.

Allowed:

- Raw Content package boundary
- raw content contract scaffolding in later scoped slices
- source, ingestion, provenance, normalization boundary, deduplication, fingerprinting, validation, storage port, event, and Reddit mapping contracts in later scoped slices

Not allowed:

- persistence implementation
- Prisma repositories
- AI workflows
- opportunity generation
- REST APIs
- frontend
- scheduler
- worker
- business scoring

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
