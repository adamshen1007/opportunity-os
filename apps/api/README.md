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
