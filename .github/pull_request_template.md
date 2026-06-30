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
- [ ] I cleaned up unrelated local files before opening this PR.

## Checklist

- [ ] I read the relevant Engineering Kit documents.
- [ ] I kept cross references valid.
- [ ] I updated documentation where needed.
- [ ] I did not introduce business logic unless this PR is explicitly scoped for implementation.
- [ ] I did not introduce connectors, APIs, or AI workflows unless approved by specification.
