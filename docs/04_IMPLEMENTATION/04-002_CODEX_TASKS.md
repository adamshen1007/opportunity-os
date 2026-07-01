# 04-002_CODEX_TASKS.md

**Document ID:** 04-002
**Version:** 3.0.0
**Status:** Approved (Implementation)
**Layer:** 3 - Implementation
**Owner:** Engineering Team

# Codex Task Catalog

This document defines how Codex implementation tasks must be shaped after Engineering Kit v3.0.

The detailed task backlog is generated milestone-by-milestone. This file defines the task format, completed milestone baseline, and future milestone sequence.

## Task Design Principles

Every Codex task must:

- be independently executable
- identify the owning package
- list allowed files
- list dependencies
- reference relevant Engineering Kit documents
- include acceptance criteria
- include required tests
- preserve package boundaries
- avoid unrelated refactors
- stop at the assigned scope

## Task Identifier Format

Use milestone-aware task IDs:

```text
TASK-P<phase>-M<milestone>-<number>
```

Examples:

- `TASK-P2-M15-01`
- `TASK-P2-M16-04`
- `TASK-P2-M20-12`

## Required Task Fields

Every generated task must include:

- task ID
- objective
- dependencies
- files to create or modify
- Engineering Kit references
- acceptance criteria
- required tests
- estimated size

## Completed Baseline

Codex must treat these milestones as complete and must not recreate their foundations:

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

## Future Milestone Sequence

The v3.0 task catalog uses this future sequence:

1. Phase 2 M15 Reddit Provider Transport
2. Phase 2 M16 Raw Content Pipeline
3. Phase 2 M17 Normalization Pipeline
4. Phase 2 M18 AI Analysis Pipeline
5. Phase 2 M19 Opportunity Engine
6. Phase 2 M20 REST API
7. Phase 2 M21 Dashboard

## Milestone 15 Guardrail

Milestone 15 is the first transition from platform foundation into real provider capability.

Allowed in M15:

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
- fake transport test infrastructure
- documentation
- repository verification

Still prohibited in M15:

- Raw Content persistence
- AI workflows
- opportunity generation
- REST APIs
- frontend
- scheduler
- worker
- business logic

## Required Verification

Every implementation task must run the verification commands named by the task. Final milestone gates must run:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase <milestone-phase>
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

## Revision History

| Version | Summary |
|---------|---------|
| 2.0.0 | Initial Codex task catalog generated from the Engineering Kit. |
| 3.0.0 | Rebased Codex task rules on completed milestones through Phase 2 M14 and future milestones M15-M21. |
