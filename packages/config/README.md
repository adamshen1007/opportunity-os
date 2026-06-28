# Config Package

Owns runtime configuration for Opportunity OS during Phase 1 shared infrastructure work.

This package is the only package allowed to receive implementation files during Phase 1 Milestone 1. It defines environment schema validation, typed configuration exports, fail-fast loading, secret-safe configuration errors, and configuration-specific tests.

No application startup integration exists yet.

## Package Boundary

`packages/config` is responsible for:

- loading environment values from the runtime environment
- validating required variables from `.env.example`
- applying documented defaults where safe
- failing fast when required variables are missing or malformed
- exposing typed configuration to future packages
- avoiding logs or errors that reveal secrets or raw credentials
- providing logging-related configuration values such as service name, environment, and log level

`packages/config` must not depend on:

- `apps/`
- APIs or application services
- connectors or acquisition packages
- AI workflows or provider adapters
- database or repository implementations
- domain or business packages
- intelligence, scoring, or opportunity logic

This package must remain shared infrastructure only.

## Validation Contract

Validation covers exactly the variables in `.env.example`.

Required variables:

- application settings: `APP_NAME`, `NODE_ENV`, `PORT`
- service URLs: `DATABASE_URL`, `REDIS_URL`
- AI provider settings: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_MODEL`, `ANTHROPIC_MODEL`
- authentication settings: `JWT_SECRET`, `JWT_EXPIRES_IN`
- observability settings: `LOG_LEVEL`, `OTEL_EXPORTER_ENDPOINT`

Optional variables:

- external monitoring and AI observability: `SENTRY_DSN`, `LANGFUSE_API_KEY`, `LANGSMITH_API_KEY`

## Defaults And Normalization

Defaults are applied only where safe:

- `NODE_ENV` defaults to `local`
- `PORT` defaults to `3000`
- `LOG_LEVEL` defaults to `info`

Normalization rules:

- `NODE_ENV` must be one of `local`, `development`, `staging`, or `production`.
- `PORT` is parsed into a number and must be an integer from `1` through `65535`.
- `LOG_LEVEL` must be one of `trace`, `debug`, `info`, `warn`, `error`, or `fatal`.

Required secrets and credentials do not receive defaults. This includes provider API keys and `JWT_SECRET`.

Validation fails fast when required variables are missing or malformed. Error messages include invalid variable names and reason codes, but must not include raw secret values.

## Package Usage

Future packages should consume configuration through typed exports from `@opportunity-os/config`.

Use `loadRuntimeConfig()` when a runtime package needs configuration from the active environment. Use `createRuntimeConfig(requiredEnvironment, optionalEnvironment)` in tests or controlled package boundaries when validated environment objects are already available.

Consumers should not read `process.env` directly. Centralizing configuration in this package keeps validation, defaults, normalization, and secret-safe errors consistent across the workspace.

Typed configuration is grouped by responsibility:

- `application`
- `services`
- `aiProviders`
- `authentication`
- `observability`
- `optionalIntegrations`

Phase 1 Milestone 1 is limited to this shared configuration package. Do not implement apps, APIs, connectors, AI workflows, database behavior, domain logic, intelligence logic, or business processes in this milestone.

The next shared-infrastructure milestone should depend on `packages/config` for service name, environment, log level, exporter endpoint, and any other runtime configuration it needs.

## Milestone 1 Readiness

Phase 1 Milestone 1 is ready for handoff when:

- the package validates every required and optional variable documented in `.env.example`
- consumers can use typed exports without reading `process.env` directly
- invalid configuration throws typed, secret-safe errors
- package tests cover schema validation, typed config loading, and redaction behavior
- the workspace lint, build, test, repository verification, and Docker Compose config commands pass

The package is shared infrastructure only. It does not implement application startup, API routes, connectors, AI workflows, database behavior, frontend behavior, domain logic, intelligence logic, or business processes.

## Future Logging Configuration

The future logging package should consume configuration from this package rather than reading environment variables directly.

Logging configuration should provide:

- `service` from `APP_NAME`
- `environment` from `NODE_ENV`
- default `severity` threshold from `LOG_LEVEL`
- observability exporter location from `OTEL_EXPORTER_ENDPOINT`

Configuration validation must not print secret values when reporting missing or malformed variables.

Do not add implementation files outside this package for Phase 1 Milestone 1. Apps, APIs, connectors, AI workflows, database code, domain code, and business logic remain out of scope.
