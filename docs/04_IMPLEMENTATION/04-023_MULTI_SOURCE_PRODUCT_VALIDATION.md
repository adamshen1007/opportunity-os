# 04-023_MULTI_SOURCE_PRODUCT_VALIDATION.md

## Multi-Source Product Validation

**Document ID:** 04-023
**Status:** Implemented
**Scope:** Phase 4 Milestones 35-39

## Objective

Keep Opportunity OS moving while Reddit Data API access is under review. The product now has a source-neutral scan boundary and an official, read-only Stack Exchange connector that can exercise the same raw-content, normalization, analysis, opportunity-generation, ranking, persistence, evidence, and feedback workflow.

## Milestones

- **M35 Multi-Source Scan Boundary:** `POST /scans` accepts a datasource, query, limit, and source-specific options. `/scans/reddit` remains available for compatibility.
- **M36 Stack Exchange Live Connector:** `@opportunity-os/connectors-stack-exchange` provides fixture-default and explicitly enabled live search through the official Stack Exchange API.
- **M37 Multi-Source Pipeline and Persistence:** Stack Exchange questions map to canonical Raw Content with provenance and use the existing downstream pipeline and persistence ports.
- **M38 Dashboard Source Selection:** the dashboard lets a user select Stack Exchange or Reddit and shows source, evidence, provenance, API quota metadata, and safe errors.
- **M39 Real-Data Product Validation:** every scan reports retrieved items, generated opportunities, evidence coverage, average confidence, and human-review readiness.

## Live Stack Exchange Setup

No user OAuth flow is required for the initial read-only product trial. An application API key is optional but recommended for quota isolation. Keep it in `.env` or hosted encrypted secret storage.

```bash
export STACK_EXCHANGE_LIVE_SCAN_ENABLED=true
export STACK_EXCHANGE_DEFAULT_SITE=stackoverflow
export STACK_EXCHANGE_QUERY="manual deployment"
pnpm --filter @opportunity-os/connectors-stack-exchange dev:stack-exchange:live
```

Default tests and CI remain fixture-only and never call the external network.

## Dashboard Trial

1. Start the API and dashboard.
2. Open `http://127.0.0.1:3000`.
3. In **Run Opportunity Scan**, choose **Stack Exchange**.
4. Select a site and enter a narrow problem query.
5. Use fixture mode for deterministic review or live mode after enabling the environment gate.
6. Review opportunity rank, evidence links, source attribution, provenance, and validation metrics.
7. Save, dismiss, and rate useful results through the existing feedback workflow.

Suggested validation queries:

- `manual deployment process`
- `API documentation difficult`
- `database migration failed`
- `small team monitoring`
- `authentication setup confusing`

## Review Metrics

For each design-partner session record:

- query and datasource;
- retrieved-item count;
- generated-opportunity count;
- evidence coverage;
- average confidence;
- saved, dismissed, and rated outcomes;
- user explanation of why a result was or was not useful.

The metrics are validation signals, not claims of market demand. Generated opportunities require human review.

## Attribution And Retention

Every Stack Exchange evidence item must identify Stack Exchange as its source and link to the original question. Author and license obligations must be preserved where content is displayed. Raw provider responses, API keys, authorization headers, tokens, prompts, stacks, and causes must not be stored or returned.

Reddit live access remains disabled until Reddit provides written approval and valid OAuth credentials. The implementation must not scrape Reddit or bypass its access policy.

## Verification

```bash
node scripts/verify-repository.mjs --phase phase-4-milestone-39
pnpm --filter @opportunity-os/connectors-stack-exchange test
pnpm --filter @opportunity-os/api test
pnpm --filter @opportunity-os/web test
pnpm lint
pnpm build
pnpm test
pnpm --filter @opportunity-os/web test:e2e
docker compose config
```
