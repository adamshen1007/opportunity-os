# Config

Reserved for repository-level shared configuration.

This directory is for repository-level configuration artifacts, not runtime application logic.

## Environment Contract

The canonical environment template is `.env.example`.

The runtime schema in `packages/config` must validate the same variable set documented here.

Required variables:

- `APP_NAME`
- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `REDIS_URL`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `OPENAI_MODEL`
- `ANTHROPIC_MODEL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `LOG_LEVEL`
- `OTEL_EXPORTER_ENDPOINT`

Optional variables:

- `SENTRY_DSN`
- `LANGFUSE_API_KEY`
- `LANGSMITH_API_KEY`
- `OPPORTUNITY_OS_API_URL`
- `OPPORTUNITY_OS_WEB_URL`
- `NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL`
- `LLM_PROVIDER`
- `LLM_MODEL`
- `LLM_LIVE_ANALYSIS_ENABLED`
- `LLM_PROVIDER_TIMEOUT_MS`

## Defaults And Fail-Fast Behavior

Safe defaults are limited to non-secret operational values:

- `NODE_ENV` defaults to `local`
- `PORT` defaults to `3000`
- `LOG_LEVEL` defaults to `info`

Required secrets and credentials do not receive defaults. `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, and `JWT_SECRET` must be supplied by the runtime environment before any code path that requires them can start successfully.

The config package fails fast when required variables are missing or malformed. Error output must identify the invalid variable names without printing secret values.

Production values must come from a deployment platform or secret manager. Do not commit real secrets.

## External MVP Runtime Config

Phase 4 Milestone 34 adds hosted runtime configuration for external MVP trials.

Hosted runtime variables:

- `OPPORTUNITY_OS_API_URL` identifies the public API origin.
- `OPPORTUNITY_OS_WEB_URL` identifies the public dashboard origin.
- `NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL` is the browser-visible API base URL used by `apps/web`.
- `LLM_PROVIDER` selects the configured live analysis provider.
- `LLM_MODEL` selects the configured live analysis model.
- `LLM_LIVE_ANALYSIS_ENABLED` gates live provider analysis and must remain `false` by default in local and CI environments.
- `LLM_PROVIDER_TIMEOUT_MS` bounds live provider calls and must be an integer from `1` through `120000` when present.

Provider API keys remain secret values and must be supplied through protected deployment environment configuration. Hosted runtime health checks and logs must never print API keys, tokens, auth headers, JWT secrets, database URLs, Redis URLs, provider prompts, raw provider payloads, stack traces, or unsafe internals.

## Private Beta Production Config

Phase 3 Milestone 29 adds `config/private-beta.env.example` as the Private Beta production config template.

The template mirrors the validated runtime schema and uses placeholders only. It documents the operational values required for Private Beta deployment readiness without committing secrets.

## Private Beta Config Binding

Phase 3 Milestone 29 Slice E documents config binding for Private Beta operations.

Binding rules:

- `.env.example` and `packages/config` remain the source of truth for variable names and validation.
- `config/private-beta.env.example` remains a placeholder-only production-facing template.
- deployment environments bind actual values through protected environment configuration or approved secret storage.
- runtime code must consume validated typed configuration exports.
- deployment steps must not introduce undeclared environment variables.
- operators must verify the config binding checklist before inviting design partners.

Private Beta production config rules:

- keep `.env.example` and the runtime schema authoritative for variable names
- keep `config/private-beta.env.example` placeholder-only
- store real secrets in protected deployment environment secret storage
- never commit real API keys, provider keys, JWT secrets, database URLs, Redis URLs, DSNs, auth headers, credentials, or tokens
- keep config failures fail-fast and secret-safe
