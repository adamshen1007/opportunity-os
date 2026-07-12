# 04-022_EXTERNAL_MVP_READINESS_GATE.md

**Document ID:** 04-022
**Version:** 3.0.0
**Status:** Active
**Layer:** 4 - Implementation
**Owner:** Opportunity OS Architecture Team

## Purpose

Phase 4 Milestone 34 Slice G is the External MVP Runtime readiness gate.

This document gives operators one place to validate the hosted MVP, configure real Reddit and LLM smoke tests, walk through the dashboard, record results, and decide Go / No-Go. It does not begin the next milestone and does not add new product scope.

## Boundary

Slice G validates the current External MVP Runtime:

- hosted web and API deployment readiness
- production environment configuration
- production-safe health checks
- dashboard scan walkthrough
- env-gated Reddit smoke testing
- env-gated LLM smoke testing
- full repository verification
- Docker Compose configuration validation

Slice G must not introduce:

- YouTube, X, or Product Hunt connectors
- schedulers or workers
- billing, CRM integrations, notifications, or multi-tenancy
- recommendation engines
- complex admin console behavior
- committed, logged, serialized, or displayed secrets

## Deployment Checklist

Before inviting external MVP users, verify:

- repository verification passes for `review`
- repository verification passes for `phase-4-milestone-34`
- dependencies install with `pnpm install --frozen-lockfile`
- `pnpm lint` passes
- `pnpm build` passes
- `pnpm test` passes
- dashboard Playwright tests pass with `pnpm --filter @opportunity-os/web test:e2e`
- Docker Compose validates with `docker compose config`
- hosted API has `OPPORTUNITY_OS_API_URL` configured
- hosted web has `OPPORTUNITY_OS_WEB_URL` configured
- hosted web has `NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL` pointed at the hosted API origin
- hosted API `/health` returns safe status metadata
- hosted dashboard loads without exposing stack traces, secrets, raw provider payloads, or unsafe internals
- feedback continues to work on generated opportunities

## Reddit Setup Guide

Default tests use deterministic fixtures and must not call Reddit.

Run the live Reddit smoke test only from a protected environment with explicit credentials:

```sh
REDDIT_LIVE_TEST_ENABLED=true \
REDDIT_PRODUCTION_CLIENT_ID=... \
REDDIT_PRODUCTION_USER_AGENT="OpportunityOS/0.0.0 external-mvp" \
REDDIT_LIVE_SUBREDDIT=entrepreneur \
REDDIT_LIVE_LIMIT=5 \
pnpm --filter @opportunity-os/connectors-reddit dev:reddit:live
```

Optional values:

- `REDDIT_PRODUCTION_CLIENT_SECRET`
- `REDDIT_PRODUCTION_REFRESH_TOKEN`
- `REDDIT_CLIENT_ID`
- `REDDIT_CLIENT_SECRET`
- `REDDIT_REFRESH_TOKEN`
- `REDDIT_USER_AGENT`

Expected safe result:

- command prints a count of fetched public Reddit posts
- command prints safe post titles and permalinks
- command prints parsed rate-limit summary when available
- command does not print client IDs, client secrets, refresh tokens, access tokens, auth headers, raw provider responses, stack traces, or raw causes

If credentials are not configured, treat the live Reddit smoke test as blocked by environment, not as a default test failure.

## LLM Setup Guide

Default tests use deterministic fixtures and must not call a live LLM provider.

Run the live LLM smoke test only from a protected environment with explicit credentials:

```sh
LLM_LIVE_ANALYSIS_ENABLED=true \
LLM_PROVIDER=openai \
LLM_MODEL=gpt-4.1-mini \
OPENAI_API_KEY=... \
pnpm --filter @opportunity-os/llm-analysis dev:llm:live
```

Gemini can be used instead of OpenAI:

```sh
LLM_LIVE_ANALYSIS_ENABLED=true \
LLM_PROVIDER=gemini \
LLM_MODEL=gemini-2.5-flash \
GEMINI_API_KEY=... \
pnpm --filter @opportunity-os/llm-analysis dev:llm:live
```

Optional value:

- `LLM_PROVIDER_TIMEOUT_MS`

Expected safe result:

- command prints the provider and model
- command prints returned output field names only
- command does not print API keys, authorization headers, raw provider payloads, prompts, stack traces, or raw causes

If the selected provider key is not configured or outbound network access is unavailable, treat the live LLM smoke test as blocked by environment, not as a default test failure.

## Dashboard Walkthrough

Use this flow for the external MVP dashboard:

1. Open `OPPORTUNITY_OS_WEB_URL`.
2. Confirm the dashboard loads as the first screen.
3. Confirm the page explains that Opportunity OS scans a market signal source, extracts evidence, generates candidate opportunities, ranks them, and collects feedback.
4. Enter a subreddit or query in the scan form.
5. Start the scan.
6. Confirm scan status changes to an in-progress or completed state.
7. Confirm results appear as ranked opportunities.
8. Open an opportunity detail view.
9. Confirm evidence, provenance, ranking score, confidence, and explanation are visible.
10. Save or dismiss the opportunity.
11. Add usefulness, evidence quality, and ranking quality feedback.
12. Confirm the feedback state remains attached to the opportunity.
13. Refresh the page and confirm persisted scan or feedback data remains available when persistence is configured.

Visual checkpoints:

- no raw provider payloads are visible
- no prompt text or raw LLM payloads are visible
- error messages are plain-language and safe
- empty states explain what to do next
- mobile width remains usable for scan form, results, evidence, and feedback

## Smoke Test Commands

Run the readiness gate in this order:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-4-milestone-34
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
pnpm --filter @opportunity-os/web test:e2e
docker compose config
```

Run these only when the required protected environment variables are available:

```sh
pnpm --filter @opportunity-os/connectors-reddit dev:reddit:live
pnpm --filter @opportunity-os/llm-analysis dev:llm:live
```

## Smoke Test Report

Record the result for each command:

| Check | Command | Required For Default Gate | Result |
|-------|---------|---------------------------|--------|
| Repository review policy | `node scripts/verify-repository.mjs --phase review` | Yes | Passed on 2026-07-07 |
| External MVP policy | `node scripts/verify-repository.mjs --phase phase-4-milestone-34` | Yes | Passed on 2026-07-07 |
| Dependency lockfile | `pnpm install --frozen-lockfile` | Yes | Passed on 2026-07-07 |
| Lint | `pnpm lint` | Yes | Passed on 2026-07-07 |
| Build | `pnpm build` | Yes | Passed on 2026-07-07 |
| Tests | `pnpm test` | Yes | Passed on 2026-07-07 |
| Dashboard browser coverage | `pnpm --filter @opportunity-os/web test:e2e` | Yes | Passed on 2026-07-07 |
| Docker Compose config | `docker compose config` | Yes | Passed on 2026-07-07 |
| Live Reddit smoke | `pnpm --filter @opportunity-os/connectors-reddit dev:reddit:live` | Env-gated | Blocked on 2026-07-07: this shell did not provide `REDDIT_PRODUCTION_CLIENT_ID` or `REDDIT_PRODUCTION_USER_AGENT` |
| Live LLM smoke | `pnpm --filter @opportunity-os/llm-analysis dev:llm:live` | Env-gated | Skipped on 2026-07-07: `LLM_LIVE_ANALYSIS_ENABLED` was not set to `true` |

Current default-gate summary: repository verification, dependency install, lint, build, tests, Playwright, and Docker Compose passed. Real-provider trial readiness remains conditional until protected Reddit credentials and live LLM credentials are configured and the env-gated smoke commands pass in that protected environment.

## Go / No-Go

Default readiness is **Go** only when all required default gate commands pass.

Live external provider readiness is **Go** only when:

- live Reddit smoke passes in a protected environment
- live LLM smoke passes in a protected environment
- dashboard scan flow can use the deployed API and show ranked evidence-backed results
- no command or UI surface exposes secrets, raw provider payloads, prompts, auth headers, stack traces, or unsafe internals

If live Reddit or live LLM smoke is blocked by missing credentials or network access, the repository may still be **Go for deterministic external MVP deployment verification** and **No-Go for real-provider user trials** until those protected checks pass.
