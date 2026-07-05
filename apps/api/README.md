# API App

`apps/api` owns the Phase 3 Milestone 26 REST API application boundary for Opportunity OS.

Phase 4 Milestone 31 adds the local product runtime HTTP adapter. The adapter lives in `apps/api/src/server.ts`, uses Node's built-in HTTP server, wraps the existing route handlers, and keeps local behavior deterministic by using the existing synthetic opportunity/ranking ports and in-memory feedback, invite, session, and bug-report stores.

Run the local API after building:

```sh
pnpm --filter @opportunity-os/api build
pnpm --filter @opportunity-os/api start
```

For development, use:

```sh
pnpm --filter @opportunity-os/api dev
```

The API listens on `http://127.0.0.1:4000` by default. Set `PORT` only when you intentionally need another API port.

Milestone 26 establishes the strict TypeScript API app with explicit bootstrap, routing, OpenAPI contracts, health endpoint, opportunity endpoints, ranking endpoints, pagination, filtering, request validation, error mapping, authentication and authorization contracts, API versioning, deterministic fixtures, integration tests, security tests, contract stability tests, dependency-boundary tests, package metadata, and repository verification policy.

Allowed work in this milestone must remain focused on the REST API surface described by the Engineering Kit:

- API bootstrap
- routing
- OpenAPI contracts
- health endpoint
- opportunity endpoints
- ranking endpoints
- pagination and filtering
- request validation
- error mapping
- authentication and authorization contracts
- API versioning
- deterministic synthetic fixtures
- API integration tests
- API security tests
- contract stability tests
- dependency-boundary tests

The API app may consume existing Opportunity OS packages such as `@opportunity-os/opportunity-ranking`, `@opportunity-os/opportunity-generation`, `@opportunity-os/opportunity-candidates`, `@opportunity-os/opportunity-pipeline`, and `@opportunity-os/opportunity-engine`.

## Product Validation Loop Boundary

Phase 3 Milestone 28 adds Product Validation Loop feedback behavior to `apps/api` for deterministic product validation. The API owns feedback vocabulary, feedback DTOs, validation, safe errors, in-memory feedback store behavior, feedback routes, deterministic fixtures, integration tests, security tests, and API/web alignment contracts for save opportunity, dismiss opportunity, usefulness rating, evidence quality rating, ranking quality rating, and feedback reason categories.

Feedback exports route through `apps/api/src/index.ts`. Feedback routes are deterministic and in-memory for tests and demo usage. Phase 3 Milestone 29 Slice D adds explicit storage schema coverage for beta validation feedback and bug reports while keeping route behavior testable and safe.

Milestone 28 feedback API work is complete when:

- feedback DTOs and vocabulary are exported through the public API boundary
- create/list/get feedback route handlers are deterministic and secret-safe
- validation errors do not expose secrets, prompts, raw payloads, stacks, or unsafe internals
- deterministic fixtures cover saved, dismissed, rated, and reason-provided feedback
- API integration, security, contract stability, and API/web alignment tests pass
- `node scripts/verify-repository.mjs --phase phase-3-milestone-28`, `pnpm --filter @opportunity-os/api test`, and root verification commands pass

## Private Beta Boundary

Phase 3 Milestone 29 prepares `apps/api` for Private Beta deployment readiness. Slice D adds invite-only beta workflow behavior for feedback storage, save/dismiss state, and bug reporting.

Slice D keeps behavior deterministic and explicit. It does not attach external outreach systems, commercial account systems, tenant systems, or production identity provider wiring.

Slice C introduces minimal invite-only authentication and session management contracts for Private Beta:

- invite DTOs, invite status, validation, and in-memory test store
- invite acceptance and session DTOs
- route handlers for creating invites, accepting invites, and reading sessions
- secret-safe validation and error output
- storage schema in `packages/database` for invite and session records

Future Private Beta API work must remain explicit and testable:

- invite-only access must use approved authentication and authorization boundaries
- session behavior must not bypass API request context contracts
- feedback storage must not bypass approved storage ports and schema changes
- bug reporting must use safe DTOs, validation, deterministic stores, and safe errors
- production secrets must never be committed or logged
- unscoped external systems or unrelated product systems may not be introduced

## Readiness Gate

Milestone 26 is complete when:

- `apps/api` is implemented, tested, documented, and independently buildable
- public exports route through `apps/api/src/index.ts`
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/api`
- repository verification passes for `review` and `phase-3-milestone-26`
- deterministic fixtures, integration tests, security tests, contract stability tests, and dependency-boundary tests cover the API surface
- default tests require no providers, production storage services, runtime jobs, frontend server, commercial account systems, production account management, measurement platforms, production identity providers, or provider SDKs

## Non-goals

Milestone 26 and Milestone 31 must not introduce frontend implementation outside `apps/web`, production account management, measurement platforms, production identity providers, runtime jobs, provider SDKs, live provider ingestion, AI workflows, schedulers, workers, or unrelated product workflows.
