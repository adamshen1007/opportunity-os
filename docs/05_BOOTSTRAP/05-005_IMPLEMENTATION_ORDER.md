# 05-005_IMPLEMENTATION_ORDER.md

**Document ID:** 05-005
**Version:** 3.0.0
**Status:** Approved (Engineering Kit v3.0)
**Layer:** 4 - Repository Bootstrap
**Owner:** Architecture Team

# Implementation Order

This document is the authoritative build sequence for Opportunity OS after completion of Phase 2 Milestone 21.

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
| Phase 2 M15 - Reddit Provider Transport | Complete | `packages/connectors-reddit` |
| Phase 2 M16 - Raw Content Pipeline Foundation | Complete | `packages/raw-content` |
| Phase 2 M17 - Normalization Pipeline Foundation | Complete | `packages/normalization` |
| Phase 2 M18 - Embedding Foundation | Complete | `packages/embeddings` |
| Phase 2 M19 - LLM Analysis Foundation | Complete | `packages/llm-analysis` |
| Phase 2 M20 - Structured Analysis Foundation | Complete | `packages/analysis` |
| Phase 2 M21 - Opportunity Engine Foundation | Complete | `packages/opportunity-engine` |

## Current Platform State

The repository now contains foundation packages, connector SDK/runtime/host contracts, Reddit connector contracts, deterministic non-network Reddit runtime behavior, Reddit provider transport contracts, Raw Content contracts, Normalization contracts, Embedding contracts, LLM Analysis Foundation contracts, Structured Analysis Foundation contracts, and Opportunity Engine Foundation contracts.

The repository does not yet contain:

- OAuth token exchange
- HTTP clients
- schedulers
- workers
- live AI workflows
- provider LLM calls
- prompt execution runtime
- REST APIs
- frontend implementation
- product business logic

## Future Build Sequence

Engineering Kit v3.0 establishes this future order:

| Milestone | Goal | Primary Owner |
|-----------|------|---------------|
| Phase 2 M22 - REST API | Implement API routes, controllers, request validation, authentication/authorization integration, and API contract tests. | future app/API modules |
| Phase 2 M23 - Dashboard | Implement frontend dashboard, connector management, opportunity explorer, reports, and browser tests. | future app/frontend modules |

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

## Phase 2 M17 Boundary

Milestone 17 establishes the Normalization Pipeline Foundation in `packages/normalization`.

Public exports must route through `packages/normalization/src/index.ts`. The package consumes `@opportunity-os/raw-content` for canonical Raw Content contracts and produces canonical text, cleaning, language, chunking, preservation, validation, result, event, and fixture contracts for future consumers.

Allowed:

- Normalization package boundary
- canonical text and text segment contracts
- normalization input, output, operation, and stage vocabulary contracts
- markdown, HTML, Unicode, whitespace, and URL cleaning contracts
- language detection contracts
- text chunking contracts
- metadata and provenance preservation contracts
- validation, result, and event contracts
- deterministic fixtures
- export stability, security, dependency-boundary, and pipeline integration tests

Not allowed:

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
- frontend
- scheduler
- worker
- business scoring

## Phase 2 M18 Boundary

Milestone 18 establishes the Embedding Foundation in `packages/embeddings`.

Public exports must route through `packages/embeddings/src/index.ts`. The package consumes `@opportunity-os/normalization` for canonical text and chunk contracts, `@opportunity-os/raw-content` for source and provenance vocabulary, `@opportunity-os/shared` for context and logging vocabulary, and `@opportunity-os/events` for event contract vocabulary.

Allowed:

- Embedding package boundary
- embedding primitive contracts
- provider abstraction contracts
- embedding request and response contracts
- chunk embedding contracts
- embedding metadata and provenance contracts
- validation contracts
- cache contracts
- result, error, and event contracts
- deterministic synthetic fixtures
- export stability, contract stability, security, dependency-boundary, and pipeline integration tests

Not allowed:

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
- frontend
- scheduler
- worker
- business logic

## Phase 2 M19 Boundary

Milestone 19 establishes the LLM Analysis Foundation in `packages/llm-analysis`.

Public exports must route through `packages/llm-analysis/src/index.ts`. The package consumes `@opportunity-os/normalization` for normalized content references, `@opportunity-os/embeddings` for provider-independent embedding references, `@opportunity-os/raw-content` for provenance vocabulary, `@opportunity-os/shared` for context and logging vocabulary, and `@opportunity-os/events` for event contract vocabulary.

Allowed:

- LLM Analysis package boundary
- provider-independent LLM provider abstraction contracts
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
- export stability, contract stability, security, dependency-boundary, and pipeline integration tests

Not allowed:

- OpenAI API calls
- Anthropic API calls
- Gemini API calls
- provider SDKs
- live LLM calls
- prompt execution runtime
- extraction workflows
- pain point extraction
- opportunity generation
- REST APIs
- frontend
- persistence implementation
- scheduler
- worker
- business scoring

## Phase 2 M20 Boundary

Milestone 20 establishes the Structured Analysis Foundation in `packages/analysis`.

Public exports must route through `packages/analysis/src/index.ts`. The package consumes `@opportunity-os/llm-analysis` for provider-independent analysis contract vocabulary, `@opportunity-os/embeddings` for embedding references, `@opportunity-os/normalization` for normalized content references, `@opportunity-os/raw-content` for source/provenance vocabulary, and `@opportunity-os/events` for event contract vocabulary.

Allowed:

- Structured Analysis package boundary
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
- export stability, contract stability, security, dependency-boundary, and pipeline integration tests

Not allowed:

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
- frontend
- persistence implementation
- scheduler
- worker
- business scoring
- provider payloads, API keys, real network behavior, or business examples

## Phase 2 M21 Boundary

Milestone 21 establishes the Opportunity Engine Foundation in `packages/opportunity-engine`.

Public exports must route through `packages/opportunity-engine/src/index.ts`. The package consumes `@opportunity-os/analysis` for structured analysis outputs, `@opportunity-os/llm-analysis` for provider-independent analysis vocabulary, `@opportunity-os/embeddings` for embedding references, `@opportunity-os/normalization` for normalized content references, `@opportunity-os/raw-content` for source/provenance vocabulary, `@opportunity-os/events` for event contract vocabulary, and `@opportunity-os/shared` for shared operational vocabulary.

Allowed:

- Opportunity Engine package boundary
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
- export stability, contract stability, security, dependency-boundary, and upstream integration tests

Not allowed:

- REST APIs
- frontend
- persistence implementation
- scheduler
- worker
- live AI calls
- prompt runtime
- billing
- user accounts
- production ranking algorithm
- scoring implementation
- extraction workflow
- opportunity generation logic
- business workflows

Milestone 21 is complete when `@opportunity-os/opportunity-engine` is implemented, tested, documented, independently buildable, included in root `pnpm lint`, `pnpm build`, and `pnpm test`, verified by `phase-2-milestone-21`, and free of REST APIs, frontend implementation, persistence implementation, scheduler behavior, workers, live AI calls, prompt runtime behavior, billing, user accounts, production ranking algorithms, scoring implementations, extraction workflows, opportunity generation logic, and business workflows.

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

For Milestone 17, `<milestone-phase>` must be:

```sh
phase-2-milestone-17
```

For Milestone 18, `<milestone-phase>` must be:

```sh
phase-2-milestone-18
```

For Milestone 19, `<milestone-phase>` must be:

```sh
phase-2-milestone-19
```

For Milestone 20, `<milestone-phase>` must be:

```sh
phase-2-milestone-20
```

For Milestone 21, `<milestone-phase>` must be:

```sh
phase-2-milestone-21
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

Do not begin Phase 2 Milestone 22 until an implementation task explicitly scopes it.

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
| 3.0.0 | Rebased the canonical implementation order on completed work through Phase 2 Milestone 17 and defined the initial Milestone 18 handoff. |
| 3.0.1 | Updated the canonical implementation order to reflect completed Phase 2 Milestone 18 Embedding Foundation work and the Milestone 19 AI analysis handoff. |
| 3.0.2 | Updated the canonical implementation order after Phase 2 Milestone 19 LLM Analysis Foundation work and defined the initial Milestone 20 handoff. |
| 3.0.3 | Updated the canonical implementation order to reflect completed Phase 2 Milestone 20 Structured Analysis Foundation work and the Milestone 21 Opportunity Engine handoff. |
| 3.0.4 | Updated the canonical implementation order to reflect completed Phase 2 Milestone 21 Opportunity Engine Foundation work and the Milestone 22 REST API handoff. |
