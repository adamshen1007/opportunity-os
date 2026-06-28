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

## Defaults And Fail-Fast Behavior

Safe defaults are limited to non-secret operational values:

- `NODE_ENV` defaults to `local`
- `PORT` defaults to `3000`
- `LOG_LEVEL` defaults to `info`

Required secrets and credentials do not receive defaults. `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, and `JWT_SECRET` must be supplied by the runtime environment before any code path that requires them can start successfully.

The config package fails fast when required variables are missing or malformed. Error output must identify the invalid variable names without printing secret values.

Production values must come from a deployment platform or secret manager. Do not commit real secrets.
