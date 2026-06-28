# Docs

Canonical product, architecture, specification, implementation, and bootstrap documentation for Opportunity OS.

Start with `00_INDEX/00-001_DOCUMENTATION_INDEX.md`.

## Required Reading Order

1. `00_INDEX/00-001_DOCUMENTATION_INDEX.md`
2. `01_FOUNDATION/01-001_VISION.md`
3. `01_FOUNDATION/01-002_ENGINEERING_PRINCIPLES.md`
4. `01_FOUNDATION/01-003_GLOSSARY.md`
5. `02_ARCHITECTURE/02-001_ARCHITECTURE.md`
6. Relevant specifications in `03_SPECIFICATIONS/`
7. `04_IMPLEMENTATION/04-001_ROADMAP.md`
8. `04_IMPLEMENTATION/04-002_CODEX_TASKS.md`
9. Bootstrap documents in `05_BOOTSTRAP/`

## Numbering Rules

Documents under `docs/` use section-numbered filenames.

Rules:

- folder prefix and document prefix must match
- document numbers must remain continuous within a section
- the first heading must match the file name
- cross references must resolve to existing files or approved Engineering Kit aliases

Run this after documentation changes:

```sh
node scripts/verify-repository.mjs --phase review
```
