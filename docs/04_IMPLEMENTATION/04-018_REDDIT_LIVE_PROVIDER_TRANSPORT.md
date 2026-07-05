# 04-018_REDDIT_LIVE_PROVIDER_TRANSPORT.md

**Document ID:** 04-018  
**Version:** 1.0.0  
**Status:** Approved (Implementation)  
**Layer:** 3 - Implementation  
**Owner:** Engineering Team

# Reddit Live Provider Transport

Phase 4 Milestone 33 replaces fake-only Reddit transport with controlled live provider access for development and optional integration verification.

## Boundary

Live Reddit provider access is owned by `packages/connectors-reddit`.

Allowed:

- OAuth token exchange with explicit configured credentials
- Node 24 `fetch` based HTTP transport
- public Reddit request execution for development verification
- rate-limit parsing from provider headers
- pagination metadata from listing cursors
- safe mapping from Reddit listing responses into existing Reddit data contracts
- secret-safe provider errors
- optional live integration tests gated by environment variables

Not allowed:

- Raw Content persistence
- Prisma repositories
- AI workflows
- opportunity generation
- REST APIs
- frontend changes
- schedulers
- workers
- database persistence workflows
- business logic

## Local Dev Command

Default tests never call Reddit. To intentionally fetch public Reddit data during development:

```sh
REDDIT_LIVE_TEST_ENABLED=true \
REDDIT_CLIENT_ID=your-client-id \
REDDIT_CLIENT_SECRET=your-client-secret-if-required \
REDDIT_USER_AGENT="OpportunityOS/0.0.0 local-dev" \
REDDIT_LIVE_SUBREDDIT=entrepreneur \
REDDIT_LIVE_LIMIT=5 \
pnpm --filter @opportunity-os/connectors-reddit dev:reddit:live
```

`REDDIT_REFRESH_TOKEN` may be provided when testing refresh-token based credentials. Without it, the live command uses the client-credentials grant.

## Testing Policy

Required default tests:

- fake transport unit tests
- OAuth token exchange tests with injected fake transport
- live HTTP transport tests with injected fake fetch
- response mapping tests with synthetic Reddit listing fixtures
- token redaction and provider error security tests

Optional live test:

- skipped unless `REDDIT_LIVE_TEST_ENABLED=true`
- requires configured Reddit credentials
- must not persist provider data

## Secret Safety

Provider outputs must not serialize:

- access tokens
- refresh tokens
- client secrets
- auth headers
- raw provider responses
- stack traces
- raw causes
- database URLs
- credentials

Sensitive headers recorded by fake transport must be redacted before storage.

## Verification

Run:

```sh
node scripts/verify-repository.mjs --phase phase-4-milestone-33
pnpm --filter @opportunity-os/connectors-reddit test
pnpm lint
pnpm build
pnpm test
```
