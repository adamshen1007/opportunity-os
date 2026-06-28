# Opportunity OS

Opportunity OS is currently an Engineering Kit and repository foundation. The repository is prepared for future implementation, but it intentionally does not contain application code, business logic, connectors, APIs, or AI workflows yet.

## Start Here

1. Read `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md`.
2. Read `developer-ai/00_CONTEXT/MISSION.md`.
3. Read `docs/05_BOOTSTRAP/05-001_TECH_STACK.md`.
4. Read `docs/05_BOOTSTRAP/05-002_REPOSITORY_STRUCTURE.md`.
5. Read `docs/05_BOOTSTRAP/05-005_IMPLEMENTATION_ORDER.md`.
6. Use the relevant specification, Developer AI playbook, and checklist before any implementation work.

## Engineering Kit

The Engineering Kit is the source of truth for product intent, architecture, bootstrap rules, and implementation order.

Required reading order:

1. `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md`
2. `docs/01_FOUNDATION/01-001_VISION.md`
3. `docs/01_FOUNDATION/01-002_ENGINEERING_PRINCIPLES.md`
4. `docs/01_FOUNDATION/01-003_GLOSSARY.md`
5. `docs/02_ARCHITECTURE/02-001_ARCHITECTURE.md`
6. `docs/05_BOOTSTRAP/05-001_TECH_STACK.md`
7. `docs/05_BOOTSTRAP/05-002_REPOSITORY_STRUCTURE.md`
8. `docs/05_BOOTSTRAP/05-003_ENVIRONMENT_SPEC.md`
9. `docs/05_BOOTSTRAP/05-005_IMPLEMENTATION_ORDER.md`

Read task-specific specifications from `docs/03_SPECIFICATIONS/` before implementation work begins.

## Developer AI Documents

Developer AI documents define how AI-assisted work should be performed in this repository.

Required before implementation:

1. `developer-ai/00_CONTEXT/MISSION.md`
2. `developer-ai/00_CONTEXT/ARCHITECTURE_MAP.md`
3. `developer-ai/00_CONTEXT/REPOSITORY_OVERVIEW.md`
4. Relevant standards from `developer-ai/01_STANDARDS/`
5. Relevant patterns from `developer-ai/02_PATTERNS/`
6. Relevant playbook from `developer-ai/03_PLAYBOOKS/`
7. Relevant checklist from `developer-ai/05_CHECKLISTS/`

## Repository Areas

- `docs/` contains product, architecture, specification, implementation, and bootstrap documents.
- `developer-ai/` contains AI agent context, standards, patterns, playbooks, prompts, and checklists.
- `apps/` is reserved for future application entry points.
- `packages/` is reserved for future workspace packages.
- `schemas/`, `prompts/`, `examples/`, `infrastructure/`, `docker/`, and `scripts/` are repository support areas.
- `.github/` contains contribution automation, issue templates, pull request templates, labels, owners, and CI workflows.

## Local Verification

```sh
node scripts/verify-repository.mjs --phase review
pnpm install
pnpm lint
pnpm build
pnpm test
```

At this stage, these commands verify repository structure, document numbering, README coverage, and cross references.

## Phase Workflow

Phase 0 is repository foundation work only. It may update documentation, repository verification, CI, Docker, environment guidance, and governance files. It must not add application code, business logic, APIs, connectors, AI workflows, or database schema implementation.

Phase 1 starts shared infrastructure work. It should begin only after Phase 0 verification passes and a scoped implementation task identifies the owning package, referenced Engineering Kit documents, and required tests.

## Phase 0 Completion Checklist

Phase 0 is complete when all of the following are true:

- repository verification passes with `node scripts/verify-repository.mjs --phase review`
- `pnpm lint`, `pnpm build`, and `pnpm test` pass
- Docker Compose validates with `docker compose config`
- `git status --short --ignored` shows no unexpected tracked or untracked files
- `apps/` and `packages/` contain only approved README placeholders
- no application code, business logic, APIs, connectors, AI workflows, or database schema implementation exists
- environment, logging, testing, security, and contributor guidance are documented
- Phase 1 work has a scoped task, owning package, referenced Engineering Kit documents, acceptance criteria, and required tests

When this checklist passes, the repository is ready for Phase 1 shared infrastructure work.

## Documentation Rules

Cross references must resolve to real files or approved Engineering Kit document aliases. Prefer repository-relative paths such as `docs/05_BOOTSTRAP/05-001_TECH_STACK.md` and `developer-ai/00_CONTEXT/MISSION.md`.

Numbered documents under `docs/` must keep their folder prefix and file heading aligned. For example, `docs/05_BOOTSTRAP/05-003_ENVIRONMENT_SPEC.md` belongs in the `05_BOOTSTRAP` section and starts with `# 05-003_ENVIRONMENT_SPEC.md`.

## Testing Strategy

During Phase 0, `pnpm test` runs repository verification only. It does not run application, API, business logic, connector, or AI workflow tests because those implementations do not exist yet.

Future implementation phases should introduce tests in layers:

- Vitest for unit tests in shared packages and domain-level modules
- Supertest for Fastify API route and HTTP contract tests
- Playwright for end-to-end browser tests once the web application exists
- Contract testing for APIs, event envelopes, connectors, and AI workflow inputs/outputs
- Integration testing for database, Redis, queues, external-provider adapters, and cross-package workflows

Test dependencies should be added only when the corresponding implementation package or app is introduced.

## Environment Setup

Create a local environment file from the example:

```sh
cp .env.example .env
```

Required variables are grouped in `.env.example`:

- Application: `APP_NAME`, `NODE_ENV`, `PORT`
- Services: `DATABASE_URL`, `REDIS_URL`
- AI providers: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_MODEL`, `ANTHROPIC_MODEL`
- Authentication: `JWT_SECRET`, `JWT_EXPIRES_IN`
- Observability: `LOG_LEVEL`, `OTEL_EXPORTER_ENDPOINT`

Optional variables:

- `SENTRY_DSN`
- `LANGFUSE_API_KEY`
- `LANGSMITH_API_KEY`

For local repository foundation work, secret values may stay empty because no runtime application code exists yet. Before implementation work uses AI providers, authentication, or external observability, fill the relevant values in your local `.env`; never commit real secrets.

Production environments must provide required variables through the deployment platform or secret manager. Production secrets must not be copied from local files, committed to Git, or stored in documentation.

## Logging Architecture

Logging is planned for the future shared infrastructure phase. No logger implementation exists during Phase 0.

The future logging package will live under `packages/shared/` and should emit structured logs with these required fields:

- `timestamp`
- `service`
- `environment`
- `severity`
- `correlationId`
- `requestId`
- `eventName`
- `message`

Logging configuration should come from the future config package, including service name, environment, and log level.

Sensitive data must never be logged. This includes API keys, tokens, passwords, raw authentication headers, credentials, and unredacted secret values.

## Local Services

The repository includes a Docker Compose baseline for local PostgreSQL and Redis only. It does not define application containers during Phase 0.

Validate the Compose file:

```sh
docker compose config
```

Optionally start local services:

```sh
docker compose up postgres redis
```

## Implementation Guardrails

- Do not add business logic without approved implementation scope.
- Do not add connectors, APIs, database tables, or AI workflows in repository foundation changes.
- Keep TypeScript, pnpm, Turborepo, and Node.js versions aligned with the bootstrap documents.
- Keep documentation cross references valid.

## Pull Request Workflow

Every pull request should:

- link a GitHub issue or task
- identify the relevant Engineering Kit documents
- explain whether it is Phase 0 foundation work or Phase 1+ implementation work
- include verification output
- update documentation when behavior, structure, or workflow changes
- confirm no secrets or unrelated local artifacts are included

## Current Status

Repository foundation is prepared for Phase 1 after the Phase 0 completion checklist passes. The next phase should begin only after a scoped shared-infrastructure task is opened and linked to the relevant Engineering Kit documents.
