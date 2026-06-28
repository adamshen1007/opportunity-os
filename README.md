# Opportunity OS

Opportunity OS is currently an Engineering Kit and repository foundation. The repository is prepared for future implementation, but it intentionally does not contain application code, business logic, connectors, APIs, or AI workflows yet.

## Start Here

1. Read `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md`.
2. Read `developer-ai/00_CONTEXT/MISSION.md`.
3. Read `docs/05_BOOTSTRAP/05-001_TECH_STACK.md`.
4. Read `docs/05_BOOTSTRAP/05-002_REPOSITORY_STRUCTURE.md`.
5. Use the relevant specification, playbook, and checklist before any implementation work.

## Repository Areas

- `docs/` contains product, architecture, specification, implementation, and bootstrap documents.
- `developer-ai/` contains AI agent context, standards, patterns, playbooks, prompts, and checklists.
- `apps/` is reserved for future application entry points.
- `packages/` is reserved for future workspace packages.
- `schemas/`, `prompts/`, `examples/`, `infrastructure/`, `docker/`, and `scripts/` are repository support areas.
- `.github/` contains contribution automation, issue templates, pull request templates, labels, owners, and CI workflows.

## Local Verification

```sh
pnpm install
pnpm lint
pnpm build
pnpm test
```

At this stage, these commands verify repository structure, document numbering, README coverage, and cross references.

## Implementation Guardrails

- Do not add business logic without approved implementation scope.
- Do not add connectors, APIs, database tables, or AI workflows in repository foundation changes.
- Keep TypeScript, pnpm, Turborepo, and Node.js versions aligned with the bootstrap documents.
- Keep documentation cross references valid.

## Current Status

Repository foundation is prepared for implementation. The next phase should begin only after a scoped implementation task is opened and linked to the relevant Engineering Kit documents.

