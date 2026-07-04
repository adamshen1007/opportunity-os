# API App

`apps/api` owns the Phase 3 Milestone 26 REST API application boundary for Opportunity OS.

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

Feedback exports route through `apps/api/src/index.ts`. Feedback routes are deterministic and in-memory only for tests and demo usage. They do not add database persistence, production storage, user accounts, billing, analytics platforms, notifications, email, CRM integrations, schedulers, workers, mobile apps, complex admin consoles, or unrelated product systems.

Milestone 28 feedback API work is complete when:

- feedback DTOs and vocabulary are exported through the public API boundary
- create/list/get feedback route handlers are deterministic and secret-safe
- validation errors do not expose secrets, prompts, raw payloads, stacks, or unsafe internals
- deterministic fixtures cover saved, dismissed, rated, and reason-provided feedback
- API integration, security, contract stability, and API/web alignment tests pass
- `node scripts/verify-repository.mjs --phase phase-3-milestone-28`, `pnpm --filter @opportunity-os/api test`, and root verification commands pass

## Readiness Gate

Milestone 26 is complete when:

- `apps/api` is implemented, tested, documented, and independently buildable
- public exports route through `apps/api/src/index.ts`
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/api`
- repository verification passes for `review` and `phase-3-milestone-26`
- deterministic fixtures, integration tests, security tests, contract stability tests, and dependency-boundary tests cover the API surface
- default tests require no providers, databases, schedulers, workers, frontend, billing, user management, analytics, notifications, production authentication providers, persistence changes, or provider SDKs

## Non-goals

Milestone 26 must not introduce frontend implementation, billing, user management, analytics, notifications, production authentication providers, persistence changes, schedulers, workers, provider SDKs, or unrelated product workflows.
