# 04-021_EXTERNAL_MVP_RUNTIME.md

**Document ID:** 04-021
**Version:** 3.0.0
**Status:** Active
**Layer:** 4 - Implementation
**Owner:** Opportunity OS Architecture Team

## Purpose

Phase 4 Milestone 34 prepares Opportunity OS for a hosted external MVP runtime.

This slice establishes deployment and production environment readiness only. It does not add new product workflows, new providers, schedulers, workers, billing, CRM integrations, notifications, multi-tenancy, recommendation engines, or a complex admin console.

## Boundary

Milestone 34 is scoped to:

- hosted web deployment readiness
- hosted API deployment readiness
- production environment contract
- protected production secrets binding
- production health check shape
- external URL verification
- deployment smoke-test documentation

Milestone 34 must not introduce:

- YouTube, X, or Product Hunt connectors
- schedulers or workers
- billing, CRM, notifications, or multi-tenancy
- recommendation engine behavior
- complex admin console behavior
- secret logging, secret serialization, or committed secrets

## Production Environment Contract

The canonical environment contract remains `.env.example` plus the runtime validation schema in `packages/config`.

Hosted environments must bind actual values through protected deployment environment settings or an approved secret manager.

Required values continue to include:

- application identity and port
- database and Redis URLs
- provider API keys and model names
- JWT secret and expiry
- structured logging and OpenTelemetry endpoint

External MVP runtime values include:

- `OPPORTUNITY_OS_API_URL`
- `OPPORTUNITY_OS_WEB_URL`
- `NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL`
- `LLM_PROVIDER`
- `LLM_MODEL`
- `LLM_LIVE_ANALYSIS_ENABLED`
- `LLM_PROVIDER_TIMEOUT_MS`

Real Reddit datasource access for Slice B is also environment-gated:

- `REDDIT_PRODUCTION_CLIENT_ID`
- `REDDIT_PRODUCTION_CLIENT_SECRET`
- `REDDIT_PRODUCTION_REFRESH_TOKEN`
- `REDDIT_PRODUCTION_USER_AGENT`
- `REDDIT_LIVE_TEST_ENABLED`
- `REDDIT_LIVE_SUBREDDIT`
- `REDDIT_LIVE_LIMIT`

`LLM_LIVE_ANALYSIS_ENABLED` must default to `false` for local and CI usage. Live provider analysis is opt-in and must remain env-gated.

Live LLM analysis for Slice C uses `@opportunity-os/llm-analysis` with `LLM_PROVIDER=openai` and `OPENAI_API_KEY`, or `LLM_PROVIDER=gemini` and `GEMINI_API_KEY`. `LLM_MODEL` can select either provider model, while `OPENAI_MODEL` and `GEMINI_MODEL` provide provider-specific defaults. The smoke command is `pnpm --filter @opportunity-os/llm-analysis dev:llm:live`. Default CI and local tests must continue to use deterministic fixtures and injected fake provider responses.

Secrets must never be committed, logged, serialized, displayed in health output, included in deployment logs, or copied into documentation examples.

## Deployment Configuration

The deployment workflow is `.github/workflows/deploy.yml`.

The workflow verifies:

- `node scripts/verify-repository.mjs --phase phase-4-milestone-34`
- `pnpm lint`
- `pnpm build`
- `pnpm test`
- `docker compose config`

The workflow records the deployment contract for the external MVP environment. It does not perform destructive production actions and does not create provider accounts, billing flows, schedulers, workers, or managed CRM/notification integrations.

## Production Health Check

The API health route must expose a safe health response containing:

- service name
- version
- environment
- checked timestamp
- aggregate status
- dependency summaries
- safe dependency messages only

Health responses must not expose credentials, database URLs, Redis URLs, provider keys, auth headers, raw provider payloads, stack traces, or internal dependency details.

## External URL Verification

After deployment, operators must verify:

1. `OPPORTUNITY_OS_API_URL` opens the API host.
2. `OPPORTUNITY_OS_API_URL/health` returns a safe JSON response with `status`, `environment`, `checkedAt`, and `dependencies`.
3. `OPPORTUNITY_OS_WEB_URL` opens the dashboard.
4. The dashboard reads `NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL`.
5. The dashboard can load opportunities or a safe empty/demo state.
6. Browser-visible errors do not expose secrets, stack traces, raw provider payloads, or internal dependency details.

For Reddit datasource smoke testing, run `pnpm --filter @opportunity-os/connectors-reddit dev:reddit:live` only from a protected environment where `REDDIT_LIVE_TEST_ENABLED=true` and Reddit credentials are configured. Default CI and local tests must continue to use fake transport and deterministic fixtures.

For LLM smoke testing, run `pnpm --filter @opportunity-os/llm-analysis dev:llm:live` only from a protected environment where `LLM_LIVE_ANALYSIS_ENABLED=true` and either OpenAI or Gemini credentials are configured. OpenAI requires `LLM_PROVIDER=openai`, a model through `LLM_MODEL` or `OPENAI_MODEL`, and `OPENAI_API_KEY`. Gemini requires `LLM_PROVIDER=gemini`, a model through `LLM_MODEL` or `GEMINI_MODEL`, and `GEMINI_API_KEY`. The command must not print prompts, raw provider payloads, authorization headers, API keys, stack traces, or raw causes.

## Readiness Gate

Phase 4 Milestone 34 Slice A is ready when:

- repository verification passes for `review` and `phase-4-milestone-34`
- lint, build, and tests pass
- `.env.example` documents the hosted runtime contract
- deployment workflow checks the Phase 34 gate
- API health output is production-safe
- external URL verification is documented
