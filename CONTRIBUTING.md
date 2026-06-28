# Contributing

Opportunity OS is documentation-first. Implementation work must start from the Engineering Kit and preserve its architecture, naming, dependency, testing, and security rules.

## Before You Start

Read these documents in order:

1. `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md`
2. `developer-ai/00_CONTEXT/MISSION.md`
3. `docs/05_BOOTSTRAP/05-001_TECH_STACK.md`
4. `docs/05_BOOTSTRAP/05-002_REPOSITORY_STRUCTURE.md`
5. The specification or playbook for the change you intend to make

## Rules

- Do not add business logic without a linked issue and an approved specification.
- Do not introduce APIs, connectors, AI workflows, database tables, or application behavior in repository foundation changes.
- Keep package dependencies aligned with `docs/05_BOOTSTRAP/05-001_TECH_STACK.md`.
- Keep cross references valid whenever documents move or are renamed.
- Keep implementation scoped to the relevant package boundary.
- Add or update tests for implementation changes.

## Local Checks

```sh
pnpm install
pnpm lint
pnpm build
pnpm test
```

At this repository foundation stage, these commands validate the repository structure and documentation integrity.

## Pull Requests

Every pull request should include:

- Summary of the change
- Linked issue or task
- Documentation impact
- Test or verification evidence
- Explicit note if no business logic was changed

