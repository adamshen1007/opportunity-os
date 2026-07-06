# 04-019_MVP_USER_TEST_READINESS.md

**Document ID:** 04-019
**Version:** 1.0.0
**Status:** Approved (Implementation)
**Layer:** 3 - Implementation
**Owner:** Engineering Team

# MVP User-Test Readiness

## Purpose

This document defines the product-level MVP readiness gate for normal-user testing. It turns the completed local product runtime, dashboard, REST API, private beta workflow, beta operations guidance, product data schema, and controlled Reddit provider transport into a clear trial path that Adam can run locally or use as a staging rehearsal.

The MVP user-test gate is a usability and verification pass. It must not introduce payments, subscriptions, enterprise features, CRM integrations, notifications, analytics platforms, multi-tenancy, schedulers, workers, mobile apps, or unscoped product systems.

## Product Promise

Opportunity OS helps an operator review evidence-backed opportunity candidates, understand why they are ranked, inspect provenance, and record validation feedback before committing to deeper product or market work.

A normal test user should understand:

- what the product does within the first dashboard view
- which opportunity to review first
- why the opportunity is ranked
- what evidence supports the recommendation
- how to save, dismiss, rate, or report feedback
- when data is synthetic, local, or live-provider sourced

## Required Local Trial Path

The normal-user MVP must support this flow without developer assistance after setup:

1. Start the local API.
2. Start the dashboard.
3. Open the dashboard.
4. Read the product purpose and trial steps.
5. Review the opportunity list.
6. Open an opportunity detail page.
7. Inspect ranking score, confidence, explanation, provenance, and evidence.
8. Save or dismiss the opportunity.
9. Rate usefulness, evidence quality, and ranking quality.
10. Select safe feedback reason categories.
11. Review the validation summary.
12. Optionally submit a bug report using synthetic/private-beta-safe data.

## Readiness Checklist

Before Adam asks a normal user to test the product, confirm:

- `README.md` explains how to install, build, and start the local product.
- `docs/04_IMPLEMENTATION/04-017_LOCAL_PRODUCT_RUNTIME.md` contains current local API and dashboard commands.
- `apps/api/README.md` documents the local API runtime and deterministic stores.
- `apps/web/README.md` documents dashboard fixture fallback and validation behavior.
- `.env.example` contains no committed secrets and documents optional Reddit live-provider variables.
- `docker compose config` succeeds.
- the API starts at `http://127.0.0.1:4000`.
- the dashboard starts at `http://127.0.0.1:3000`.
- the dashboard remains usable if the local API is temporarily unavailable.
- visible copy explains that demo data is deterministic unless a live-provider command is intentionally run.
- opportunity outputs include ranking explanation, confidence, provenance, and evidence.
- feedback actions are understandable and reversible at the demo-session level.
- errors are safe, actionable, and do not expose secrets, raw provider payloads, stack traces, prompts, tokens, credentials, or internal dependency details.
- browser coverage includes dashboard load, navigation, list, detail, ranking, evidence, feedback, search/filter, pagination, loading, empty, and error states.

## Verification Commands

Run the full gate before creating an MVP user-test tag:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-30
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
pnpm --filter @opportunity-os/web test:e2e
docker compose config
```

If a command is unavailable in the current machine environment, record the exact failure and the reason. Do not mark it as passed.

## Manual Trial Acceptance

The MVP is ready for normal-user testing when Adam can complete the trial walkthrough and answer yes to every item:

- Can I explain the product purpose after the first screen?
- Can I identify the next action without reading repository docs?
- Can I inspect an opportunity and understand why it is ranked?
- Can I tell which evidence supports the recommendation?
- Can I provide feedback without needing an account, payment, or production system?
- Can I recover from an empty state or safe error state?
- Can I distinguish deterministic demo data from live-provider development commands?

## Trust Boundaries

Display and documentation should consistently communicate:

- rankings are deterministic and explainable in the local MVP
- demo data may be synthetic
- live Reddit provider access is optional and development-gated
- feedback is local/in-memory unless explicitly persisted by the beta schema path
- Opportunity OS supports evaluation and prioritization; it does not guarantee market outcomes

## Follow-Up Discipline

After each normal-user test:

- keep private participant data out of Git
- record sanitized observations outside the repository or in approved docs only
- convert product changes into scoped tasks
- update this checklist when the trial flow changes
- rerun the readiness gate before creating or moving the MVP tag
