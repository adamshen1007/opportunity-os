# Apps

Application entry points live here.

Current application boundaries:

- `apps/api` owns the Phase 3 Milestone 26 REST API application boundary.
- `apps/web` owns the Phase 3 Milestone 27 Dashboard MVP application boundary.

Application code must stay inside the app that owns it. The web dashboard consumes the REST API created in `apps/api` through its API integration layer; it must not bypass API contracts or introduce unrelated backend behavior.

## Testing

- API app tests should use Supertest for HTTP routes and request/response contracts.
- Web app tests should use Vitest for component, security, route stability, and dependency-boundary coverage, plus Playwright for end-to-end user workflows.
- App-level integration tests should cover interactions with shared packages, PostgreSQL, Redis, and external-service adapters only when those dependencies exist.

Do not add authentication, billing, analytics, notifications, user accounts, production deployment, persistence changes, recommendation engines, mobile apps, schedulers, workers, provider SDKs, or unrelated backend changes without a later scoped implementation task.
