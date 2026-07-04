# 04-003_DESIGN_PARTNER_WALKTHROUGH.md

## Purpose

This walkthrough prepares Opportunity OS for Phase 3 Milestone 28 design-partner validation. It describes how to run deterministic validation sessions using the completed REST API, Dashboard MVP, feedback API behavior, dashboard feedback interactions, and synthetic fixtures.

This document is operational guidance only. It does not introduce production persistence, billing, analytics platforms, notifications, email, CRM integrations, schedulers, workers, mobile apps, complex admin consoles, or unrelated product systems.

## Preconditions

Before a session, verify:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-28
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
pnpm --filter @opportunity-os/web test:e2e
docker compose config
```

The validation experience must run from deterministic fixtures or in-memory feedback behavior. Do not require production accounts, production authentication providers, databases, external analytics, email, CRM systems, schedulers, workers, provider SDKs, live AI calls, or live provider data.

## Session Goals

Use the walkthrough to learn:

- whether the opportunity list is understandable
- whether ranked opportunities feel useful enough to inspect
- whether evidence and provenance create trust
- whether ranking explanations are clear
- whether save and dismiss actions match participant intent
- whether usefulness, evidence quality, and ranking quality ratings capture meaningful feedback
- which feedback reason categories are missing, confusing, or redundant

## Facilitator Flow

1. Open the dashboard and start from the opportunity list.
2. Ask the participant to scan opportunities without explaining the product first.
3. Ask which opportunity they would inspect and why.
4. Open the opportunity detail page.
5. Review ranking metadata, confidence, provenance, evidence, and explanations.
6. Ask the participant to save or dismiss the opportunity.
7. Ask for usefulness, evidence quality, and ranking quality ratings.
8. Ask the participant to select feedback reason categories.
9. Ask what information would make the opportunity more credible or actionable.
10. Repeat with one additional opportunity if time allows.

## Feedback Capture

Allowed feedback in this milestone:

- saved opportunity state
- dismissed opportunity state
- usefulness rating
- evidence quality rating
- ranking quality rating
- feedback reason categories
- facilitator notes outside the repository

Do not commit participant names, private company data, credentials, private notes, screenshots with sensitive information, raw provider payloads, prompts, stacks, or unsafe internal details.

## Demo States

The dashboard should support:

- populated opportunity list
- opportunity detail
- ranking view
- evidence view
- search and filter interactions
- pagination
- loading state
- empty state
- safe error state
- feedback panel
- validation summary
- saved and dismissed states

All demo states must be deterministic and testable without production services.

## Engineering Boundary

Milestone 28 is a product validation loop, not a production growth stack. Changes must stay inside:

- `apps/api`
- `apps/web`
- documentation
- repository verification

Future implementation must consume the completed API and dashboard boundaries. It must not bypass feedback DTOs, route contracts, web API integration, synthetic fixtures, repository verification, or cross-app alignment tests.

## Readiness Gate

The Product Validation Loop is ready for handoff when:

- `apps/api` feedback DTOs, validation, in-memory store behavior, route handlers, fixtures, integration tests, and security tests pass
- `apps/web` feedback UI, validation summary, search/filter improvements, deterministic fixtures, unit tests, security tests, dependency-boundary tests, API/web alignment tests, and Playwright coverage pass
- repository verification passes for `review` and `phase-3-milestone-28`
- Docker Compose config validates
- no prohibited production systems or external integrations have been introduced

## Follow-Up Discipline

After each validation session:

- summarize findings outside the repository unless the notes are sanitized
- convert actionable product changes into scoped tasks
- update Engineering Kit documents before implementation if the roadmap changes
- keep private participant data out of Git
