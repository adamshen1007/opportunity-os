# 04-031_PHASE_4_5_LIVE_DATASOURCE_VERIFICATION.md

## Purpose

This verification slice proves that an approved live datasource can supply attributed, timestamped evidence to the Phase 4.5 clustering, synthesis, LLM-validation, and ranking pipeline without weakening deterministic CI or secret safety.

This is a post-`TASK-P45-B05` verification gate. It does not reuse or rename the stable Phase 4.5 task identifiers in `04-028_PHASE_4_5_EXECUTION_PLAN.md`.

## Status

| Datasource | Status | Evidence |
|---|---|---|
| Stack Exchange | VERIFIED FALLBACK | Official read-only API path, explicit live gate, safe attribution, pagination request metadata, quota/backoff metadata, timeout/downtime/malformed-response handling, deterministic fixture default, a successful local opt-in smoke fetching three safe items, and operator-observed hosted scans on 2026-07-29. |
| Reddit | CONDITIONAL — REDDIT NOT VERIFIED | Transport, OAuth, pagination, rate-limit, timeout, malformed-response, and redaction behavior are covered deterministically. A live readiness claim still requires approved Reddit access and an opt-in smoke test with protected credentials. |

Stack Exchange verification proves the source-neutral live pipeline. It is not Reddit approval and must never be reported as Reddit readiness.

## Safety Invariants

- CI and ordinary local tests use deterministic fixtures.
- Live execution requires an explicit environment gate.
- A requested live Reddit scan fails closed when configuration or the provider is unavailable; it cannot silently return fixtures.
- Provider errors never include tokens, authorization headers, keys, raw provider responses, stacks, or causes.
- Successful scan output retains provider attribution, source timestamps, collection/ingestion time, source URLs, connector identity, pagination state where applicable, and safe quota/rate-limit metadata.
- A provider failure cannot create a successful scan or a fixture result labeled as live.

## Deterministic Verification

Run from the repository root:

```sh
pnpm --filter @opportunity-os/connectors-stack-exchange test
pnpm --filter @opportunity-os/connectors-reddit test
pnpm --filter @opportunity-os/api test
pnpm benchmark:quality:clustered
pnpm lint
pnpm build
pnpm test
```

The connector suites cover environment gating, pagination, quota/rate limits, malformed responses, timeout, provider downtime, and secret redaction without network access.

## Stack Exchange Live Smoke

The Stack Exchange API key is optional for a small public smoke test. Run:

```sh
STACK_EXCHANGE_LIVE_SCAN_ENABLED=true \
STACK_EXCHANGE_QUERY="manual deployment review" \
STACK_EXCHANGE_DEFAULT_SITE=stackoverflow \
pnpm --filter @opportunity-os/connectors-stack-exchange dev:stack-exchange:live
```

Expected safe output:

```text
Live Stack Exchange scan succeeded with N safe item(s).
```

For the hosted product, use **Live if configured** and confirm:

- mode is `Live configured`
- source attribution is `Stack Exchange`
- retrieved items are greater than zero for a suitable query
- pipeline stages complete
- evidence links and timestamps resolve to the selected Stack Exchange site
- quota remaining is visible without an API key or response payload being exposed

## Reddit Manual Action Required

Reddit remains **CONDITIONAL — REDDIT NOT VERIFIED** until approved credentials are available. Configure these only in the protected API hosting environment:

```text
REDDIT_LIVE_TEST_ENABLED=true
REDDIT_PRODUCTION_CLIENT_ID=<approved client id>
REDDIT_PRODUCTION_CLIENT_SECRET=<approved client secret, when required>
REDDIT_PRODUCTION_REFRESH_TOKEN=<approved refresh token, when required>
REDDIT_PRODUCTION_USER_AGENT=<approved descriptive user agent>
REDDIT_LIVE_SUBREDDIT=<approved public subreddit>
REDDIT_LIVE_LIMIT=5
```

Then run the opt-in smoke command in a protected operator shell:

```sh
pnpm --filter @opportunity-os/connectors-reddit dev:reddit:live
```

Do not paste credentials into source files, issue trackers, screenshots, chat messages, or command history. Do not scrape Reddit or bypass Reddit controls.

Reddit can move to VERIFIED only when the smoke test fetches approved public content, retains Reddit attribution and collection metadata, reports safe rate-limit metadata, and logs no protected values.

## Gate Decision

The source-neutral pipeline is ready to proceed to production data lifecycle closure using the verified Stack Exchange fallback. Reddit-specific readiness remains conditional and cannot be used as a pilot claim until its manual gate passes.
