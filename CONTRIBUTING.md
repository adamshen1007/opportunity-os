# Contributing

Opportunity OS is documentation-first. Implementation work must start from the Engineering Kit and preserve its architecture, naming, dependency, testing, and security rules.

## Before You Start

Read these documents in order:

1. `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md`
2. `developer-ai/00_CONTEXT/MISSION.md`
3. `docs/05_BOOTSTRAP/05-001_TECH_STACK.md`
4. `docs/05_BOOTSTRAP/05-002_REPOSITORY_STRUCTURE.md`
5. `docs/05_BOOTSTRAP/05-003_ENVIRONMENT_SPEC.md`
6. `docs/05_BOOTSTRAP/05-005_IMPLEMENTATION_ORDER.md`
7. The specification, Developer AI playbook, and checklist for the change you intend to make

## Engineering Kit Workflow

The Engineering Kit is the source of truth. Start with `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md`, then read the foundation, architecture, bootstrap, and task-specific specification documents.

For AI-assisted implementation work, also read:

- `developer-ai/00_CONTEXT/MISSION.md`
- `developer-ai/00_CONTEXT/ARCHITECTURE_MAP.md`
- `developer-ai/00_CONTEXT/REPOSITORY_OVERVIEW.md`
- relevant standards in `developer-ai/01_STANDARDS/`
- relevant patterns in `developer-ai/02_PATTERNS/`
- relevant playbooks in `developer-ai/03_PLAYBOOKS/`
- relevant checklists in `developer-ai/05_CHECKLISTS/`

## Rules

- Do not add business logic without a linked issue and an approved specification.
- Do not introduce APIs, connectors, AI workflows, database tables, or application behavior in repository foundation changes.
- Keep package dependencies aligned with `docs/05_BOOTSTRAP/05-001_TECH_STACK.md`.
- Keep cross references valid whenever documents move or are renamed.
- Keep implementation scoped to the relevant package boundary.
- Add or update tests for implementation changes.

## Local Checks

```sh
node scripts/verify-repository.mjs --phase review
pnpm install
pnpm lint
pnpm build
pnpm test
```

At this repository foundation stage, these commands validate the repository structure and documentation integrity.

## Phase 0 and Phase 1

Phase 0 work is limited to repository foundation, documentation quality, verification, CI, Docker, environment guidance, and governance. Do not add application code, business logic, connectors, APIs, AI workflows, or database schema implementation during Phase 0.

Phase 1 begins shared infrastructure implementation. A Phase 1 task must identify:

- owning package
- referenced Engineering Kit documents
- dependency order
- acceptance criteria
- required tests
- expected documentation updates

## Phase 0 Completion Checklist

Before Phase 1 begins, confirm:

- `node scripts/verify-repository.mjs --phase review` passes
- `pnpm lint` passes
- `pnpm build` passes
- `pnpm test` passes
- `docker compose config` passes
- `git status --short --ignored` shows no unexpected files
- no implementation source files exist under `apps/` or `packages/`
- no business logic, APIs, connectors, AI workflows, or database schema implementation exists
- no secrets, generated local artifacts, or unrelated local files are staged

If any item fails, keep the work in Phase 0 and fix the foundation before starting Phase 1.

## Documentation Rules

Cross references must point to existing files or approved Engineering Kit document aliases. Prefer repository-relative paths.

When adding or renaming Markdown documents:

- keep `docs/` documents numbered by section
- keep folder number and document number aligned
- make the first heading match the file name
- update `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md` when document order or source-of-truth mapping changes
- run `node scripts/verify-repository.mjs --phase review`

## Testing

At Phase 0, `pnpm test` runs repository verification only.

Do not add test suites for application behavior, APIs, connectors, AI workflows, or business logic until the relevant implementation task exists.

Future testing expectations:

- Use Vitest for package-level unit and integration tests.
- Use Supertest for API route and HTTP contract tests.
- Use Playwright for end-to-end frontend workflows.
- Add contract tests for API schemas, event envelopes, connector contracts, and AI workflow input/output contracts.
- Add integration tests when code crosses package boundaries or depends on PostgreSQL, Redis, queues, or external provider adapters.

Every implementation pull request should identify the test layer it affects and include verification evidence.

## Environment

Use `.env.example` as the contract for required and optional variables.

For local work:

1. Create `.env` from `.env.example`.
2. Keep real secrets only in `.env` or your local secret manager.
3. Leave provider keys empty until a scoped implementation task requires them.
4. Use Docker Compose for local PostgreSQL and Redis when a task requires services.

For production work:

- Provide required variables through the deployment platform or secret manager.
- Do not reuse local secrets.
- Do not commit `.env`, credentials, API keys, tokens, or generated secret files.

Future runtime configuration validation belongs in the config package and must fail fast when required variables are missing. Do not add runtime validation outside an approved implementation task.

## Security and Repository Hygiene

Treat the repository as public unless told otherwise.

Secret handling:

- Never commit `.env`; only `.env.example` belongs in Git.
- Never commit API keys, access tokens, refresh tokens, passwords, private keys, certificates with private material, database dumps, browser session exports, or raw authentication headers.
- Keep real secrets in your local `.env`, OS keychain, password manager, deployment platform, or secret manager.
- Use placeholder values in documentation and examples.
- Rotate any secret immediately if it is accidentally committed or pasted into an issue, pull request, log, or generated artifact.

Ignored files:

- `.env` and `.env.*` are ignored, except `.env.example`.
- dependency folders, build outputs, test reports, local caches, generated archives, scratch artifacts, and unrelated local research folders are ignored.
- generated files should be reviewed before staging; do not assume `.gitignore` catches every local artifact.

Artifact cleanup:

- Remove temporary exports, local reports, scratch files, database dumps, and generated archives before opening a pull request.
- Do not commit local Docker state, dependency caches, coverage reports, Playwright reports, or `node_modules`.
- Keep unrelated work outside this repository or add a narrowly scoped ignore rule.

Manual security checklist before every pull request:

- `git status --short --ignored` shows no unexpected tracked or untracked files.
- No real secrets appear in staged changes.
- `.env` remains ignored and `.env.example` contains placeholders only.
- Logs, screenshots, generated reports, and archives contain no credentials or private data.
- Pull request text does not include secret values.

## Pull Requests

Every pull request should include:

- Summary of the change
- Linked issue or task
- Documentation impact
- Test or verification evidence
- Explicit note if no business logic was changed
- Referenced Engineering Kit documents
- Phase classification: Phase 0 foundation or Phase 1+ implementation
- Confirmation that cross references and document numbering were checked
- Confirmation that no secrets or unrelated local artifacts are included
