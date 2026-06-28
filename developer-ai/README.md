# Developer AI

AI agent operating context for Opportunity OS.

Read `00_CONTEXT/MISSION.md` before implementation work.

## Required Reading Order

1. `00_CONTEXT/MISSION.md`
2. `00_CONTEXT/ARCHITECTURE_MAP.md`
3. `00_CONTEXT/REPOSITORY_OVERVIEW.md`
4. Standards in `01_STANDARDS/`
5. Patterns in `02_PATTERNS/`
6. Relevant playbook in `03_PLAYBOOKS/`
7. Relevant prompt in `04_PROMPTS/`
8. Relevant checklist in `05_CHECKLISTS/`

## Usage

Use these documents with the Engineering Kit in `docs/`.

Phase 0 work should use Developer AI documents to preserve repository rules and avoid implementation drift.

Phase 1+ implementation work must identify the relevant standard, pattern, playbook, and checklist before code is added.

## Verification

After changes to Developer AI documents, run:

```sh
node scripts/verify-repository.mjs --phase review
```
