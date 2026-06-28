# Shared Package

Reserved for future shared utilities, errors, logging, types, and validation helpers.

No runtime shared code exists during Phase 0.

## Future Logging Package

When implementation reaches shared infrastructure, this package should own the shared logging interface and helper utilities.

The future logger should be structured, machine-readable, and based on the approved stack in `docs/05_BOOTSTRAP/05-001_TECH_STACK.md`.

Expected responsibilities:

- provide a shared logger factory for future packages and apps
- emit structured logs suitable for local development and production observability
- attach correlation identifiers consistently across workflows
- respect environment-driven log levels
- avoid logging secrets, credentials, raw tokens, or sensitive payloads

Every future log entry should include:

- `timestamp`
- `service`
- `environment`
- `severity`
- `correlationId`
- `requestId`
- `eventName`
- `message`

`requestId` may be empty or omitted only when no request context exists. `correlationId` should be propagated across connectors, workflows, API requests, and background jobs once those systems exist.

## Sensitive Data Policy

Logs must never include:

- API keys
- access tokens
- refresh tokens
- passwords
- raw authentication headers
- private credentials
- unredacted secret values

Log stable identifiers and operational metadata instead of sensitive payloads.

Do not add logger implementation files to this package until an approved Phase 1 shared infrastructure task starts logging work.
