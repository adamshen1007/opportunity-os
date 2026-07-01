# developer-ai/00_CONTEXT/REPOSITORY_OVERVIEW.md

# Repository Overview

Version: 3.0.0

## Current State

Opportunity OS has completed platform foundation work through Phase 2 Milestone 14.

The repository contains:

- repository foundation and CI policy
- runtime configuration package
- shared types, errors, utilities, logging, context, and validation foundations
- event contracts and test-only event bus
- database foundation with Prisma contracts and schema policy
- domain contracts
- application-layer contracts
- dependency injection and composition contracts
- infrastructure composition contracts
- generic Connector SDK contracts
- generic Connector Runtime contracts
- Connector Host contracts
- Reddit connector contracts
- deterministic non-network Reddit runtime implementation

The repository does not yet contain:

- Raw Content persistence workflows
- live Reddit API calls
- OAuth token exchange
- HTTP clients
- schedulers
- workers
- AI workflows
- REST APIs
- frontend implementation
- opportunity generation
- product business logic

## Repository Structure

```text
apps/
packages/
docs/
developer-ai/
schemas/
prompts/
examples/
infrastructure/
docker/
scripts/
.github/
```

`apps/` is reserved for future application entry points. It must remain empty of implementation until an approved milestone introduces APIs or frontend apps.

## Implemented Packages

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

## Package Ownership

- `packages/config` owns runtime configuration validation and typed exports.
- `packages/types` owns generic shared TypeScript types.
- `packages/errors` owns safe generic error contracts.
- `packages/utils` owns deterministic utilities.
- `packages/shared` owns logging, context, and shared infrastructure contracts.
- `packages/events` owns event contracts and test-only event bus utilities.
- `packages/database` owns Prisma foundation, migration policy, client factory contracts, repository interfaces, transaction contracts, health contracts, and seed placeholders.
- `packages/domain` owns generic domain contracts only.
- `packages/application` owns application-layer contracts only.
- `packages/container` owns dependency injection and composition contracts only.
- `packages/infrastructure` owns infrastructure composition contracts only.
- `packages/connectors` owns generic Connector SDK contracts only.
- `packages/connector-runtime` owns generic connector runtime contracts only.
- `packages/connector-host` owns connector host contracts only.
- `packages/connectors-reddit` owns Reddit connector contracts and deterministic fake-provider Reddit runtime.

## Milestone 15 Transition

The next approved planning target is Phase 2 Milestone 15: Reddit Provider Transport.

Milestone 15 may add provider integration architecture only:

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
- deterministic fake transport tests

Milestone 15 must not add Raw Content persistence, AI workflows, opportunity generation, REST APIs, frontend, scheduler, worker, or business logic.

## Source of Truth

Always treat `docs/` as the source of truth.

If documentation and code disagree, stop and update or clarify the Engineering Kit before implementing.

## Before Starting Any Task

1. Read `developer-ai/00_CONTEXT/MISSION.md`.
2. Read `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md`.
3. Read `docs/05_BOOTSTRAP/05-002_REPOSITORY_STRUCTURE.md`.
4. Read `docs/05_BOOTSTRAP/05-005_IMPLEMENTATION_ORDER.md`.
5. Read the relevant architecture/specification document.
6. Identify the owning package and allowed files.
7. Implement only documented behavior.
8. Add deterministic tests.
9. Run the required verification commands.
