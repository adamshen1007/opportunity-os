# Web App

`apps/web` owns the Phase 3 Milestone 27 Dashboard MVP application for Opportunity OS.

Milestone 27 creates the first customer-facing application. The app uses Next.js App Router, React 19, strict TypeScript, and the REST API application boundary created in Phase 3 Milestone 26.

## Ownership

`apps/web` owns:

- application bootstrap
- App Router routing
- dashboard layout
- dashboard navigation
- Opportunity List page
- Opportunity Detail page
- Ranking View
- Evidence View
- Search UI
- Filter UI
- Pagination UI
- loading, empty, and error state UI
- API integration layer for `apps/api`
- OpenAPI client generation configuration and generated route contract
- deterministic frontend fixtures
- dashboard tests and documentation

## Dashboard MVP Surface

Milestone 27 establishes the Dashboard MVP:

- Next.js App Router app scaffold
- strict TypeScript configuration
- independent build script
- route map
- root layout and dashboard shell
- sidebar and topbar navigation
- Opportunity List page
- Opportunity Detail page
- Ranking View
- Evidence View
- Search UI
- Filter UI
- Pagination UI
- loading, empty, and error states
- typed API integration layer
- deterministic fixtures
- unit and component tests
- security tests
- dependency-boundary tests
- route and contract stability tests
- Playwright browser coverage
- repository verification support
- dashboard ownership documentation

## Integration Boundary

The dashboard consumes the REST API created in `apps/api` through the web API integration layer. UI code should not duplicate route strings or bypass the API layer. Tests use deterministic fixtures and do not require a production API server, auth provider, database, scheduler, worker, billing system, analytics system, or notification service.

## Verification

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-27
pnpm --filter @opportunity-os/web test
pnpm --filter @opportunity-os/web test:e2e
pnpm --filter @opportunity-os/web build
pnpm lint
pnpm build
pnpm test
```

Playwright is configured for deterministic dashboard coverage across desktop and mobile browser profiles. The tests cover dashboard load, navigation, opportunity list, opportunity detail, ranking view, evidence view, search, filters, pagination, loading state, empty state, and error state.

## Non-goals

Milestone 27 must not introduce authentication implementation, billing, analytics, notifications, user accounts, production deployment, persistence changes, recommendation engines, mobile apps, schedulers, workers, provider SDKs, or unrelated backend changes.
