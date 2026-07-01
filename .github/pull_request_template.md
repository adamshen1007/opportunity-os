## Summary

-

## Linked Issue

-

## Type of Change

- [ ] Repository foundation
- [ ] Documentation
- [ ] Architecture/specification
- [ ] Implementation
- [ ] Test-only

## Verification

- [ ] `node scripts/verify-repository.mjs --phase review`
- [ ] `pnpm lint`
- [ ] `pnpm build`
- [ ] `pnpm test`

## Security And Hygiene

- [ ] I checked `git status --short --ignored`.
- [ ] I did not commit `.env`, secrets, credentials, tokens, private keys, database dumps, or generated local artifacts.
- [ ] `.env.example` contains placeholders only.
- [ ] Logs, screenshots, archives, and generated reports contain no secrets or private data.
- [ ] If event contracts changed, I completed event privacy review: no raw payloads, secrets, tokens, API keys, provider keys, credentials, DSNs, auth headers, or production transports were introduced.
- [ ] If database files changed, I completed database migration and secret-safety review: migrations are scoped and reviewed, no prohibited tables or production event store transport were introduced, and no `DATABASE_URL`, credentials, SQL payloads, auth headers, provider details, or Prisma internals are exposed.
- [ ] If domain files changed, I completed domain contract review: public exports route through `packages/domain/src/index.ts`, dependencies stay within approved shared infrastructure packages, no concrete business aggregates/events/payloads/scoring/workflows/app services/database repositories were introduced, and future packages are not directed to bypass `@opportunity-os/domain`.
- [ ] If application files changed, I completed application contract review: public exports route through `packages/application/src/index.ts`, dependencies stay within approved foundation packages, no REST APIs/controllers/auth/connectors/AI workflows/database repositories/frontend/scoring/product use cases were introduced, and future packages are not directed to bypass `@opportunity-os/application`.
- [ ] If container files changed, I completed DI and composition review: public exports route through `packages/container/src/index.ts`, dependencies stay within approved foundation packages, lifetimes remain `singleton`/`scoped`/`transient`, config binding receives explicit typed config, logger binding does not introduce a singleton or app integration, no runtime container/service locator/reflection/app startup was introduced, and future packages are not directed to bypass `@opportunity-os/container`.
- [ ] If infrastructure files changed, I completed infrastructure composition review: module registrations, dependency graph contracts, lifecycle contracts, startup/shutdown contracts, health aggregation contracts, and foundation package composition metadata remain declarative; no REST APIs/controllers/auth/connectors/AI workflows/database repositories/frontend/product workflows/application services/business logic were introduced; and future packages are not directed to bypass `@opportunity-os/infrastructure`.
- [ ] If connector SDK files changed, I completed connector SDK boundary review: public exports route through `packages/connectors/src/index.ts`, dependencies stay within approved foundation packages, metadata/config/lifecycle/registry/factory/validation contracts remain generic, connector errors remain secret-safe, no Reddit/YouTube/OAuth/HTTP clients/APIs/auth/AI workflows/frontend/business logic/concrete connectors/connector execution were introduced, and future packages are not directed to bypass `@opportunity-os/connectors`.
- [ ] If connector runtime files changed, I completed connector runtime boundary review: public exports route through `packages/connector-runtime/src/index.ts`, dependencies stay within approved foundation packages, pipeline/state/policy/telemetry/metrics/aggregation/error/test harness contracts remain generic, telemetry and runtime outputs remain secret-safe, no Reddit/YouTube/OAuth/HTTP clients/scheduler/queue/worker process/APIs/auth/AI workflows/frontend/business logic/provider integration/actual connector execution were introduced, and future packages are not directed to bypass `@opportunity-os/connector-runtime`.
- [ ] If connector host files changed, I completed connector host boundary review: public exports route through `packages/connector-host/src/index.ts`, dependencies stay within approved foundation packages, bootstrap/orchestration/lifecycle/binding/startup/shutdown/health/execution/result/error/test harness contracts remain generic, host outputs remain secret-safe, no Reddit/YouTube/OAuth/HTTP clients/scheduler/queue/worker process/APIs/auth/AI workflows/frontend/business logic/provider integration/actual connector execution were introduced, and future packages are not directed to bypass `@opportunity-os/connector-host`.
- [ ] If Reddit connector files changed, I completed Reddit connector boundary review: public exports route through `packages/connectors-reddit/src/index.ts`, dependencies stay within approved connector foundation packages, metadata/capability/config/validation/data/factory/host/error/fixture contracts remain contract-only, OAuth and credential fields remain sensitive contract fields only, no live Reddit calls, HTTP clients, scraping, scheduler, queue, worker process, database persistence, AI workflows, APIs, frontend, business logic, provider integration, or actual connector execution were introduced, and future Reddit connector implementation is not directed to bypass `@opportunity-os/connectors-reddit`.
- [ ] If Reddit runtime files changed, I completed Reddit runtime review: public exports route through `packages/connectors-reddit/src/index.ts`, dependencies stay within approved connector foundation packages, runtime construction uses fake provider/fixtures only, config validation is explicit and does not read `process.env`, lifecycle/read/result/error/harness behavior remains deterministic and secret-safe, no OAuth/live Reddit calls/HTTP clients/scraping/scheduler/queue/worker/database persistence/AI workflows/APIs/frontend/business logic/provider integration/event publishing/host startup/runner loop/external connector execution were introduced, and future Reddit provider work is not directed to bypass `@opportunity-os/connectors-reddit`.
- [ ] If Reddit provider transport files changed, I completed Reddit provider transport boundary review: provider exports route through `packages/connectors-reddit/src/provider/index.ts` and the package root, existing runtime exports remain stable, implementation stays inside `packages/connectors-reddit`, OAuth secrets and sensitive fields remain redacted, request/response descriptions are safe, raw provider responses are not leaked or persisted, fake transport tests cover the changed behavior, and no Raw Content persistence, AI workflows, opportunity generation, REST APIs, frontend, scheduler, worker, database persistence, or business logic was introduced.
- [ ] I cleaned up unrelated local files before opening this PR.

## Checklist

- [ ] I read the relevant Engineering Kit documents.
- [ ] I kept cross references valid.
- [ ] I updated documentation where needed.
- [ ] I did not introduce business logic unless this PR is explicitly scoped for implementation.
- [ ] I did not introduce connectors, APIs, or AI workflows unless approved by specification.
