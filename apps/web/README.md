# Web App

`apps/web` owns the Phase 3 Milestone 27 Dashboard MVP application and the Phase 3 Milestone 28 design-partner validation experience for Opportunity OS.

Phase 4 Milestone 31 connects the dashboard to the local API runtime for first-time local product walkthroughs. Dashboard pages use `NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL` when provided and otherwise default to `http://127.0.0.1:4000`. If the API terminal is not running, the dashboard falls back to deterministic fixtures so the UI remains inspectable.

Run the dashboard:

```sh
pnpm --filter @opportunity-os/web dev
```

The dashboard listens on `http://127.0.0.1:3000` by default.

Milestone 27 creates the first customer-facing application. The app uses Next.js App Router, React 19, strict TypeScript, and the REST API application boundary created in Phase 3 Milestone 26.

Milestone 28 layers deterministic product validation on top of the Dashboard MVP. The dashboard exposes save, dismiss, usefulness rating, evidence quality rating, ranking quality rating, feedback reason categories, validation summary, search/filter improvements, demo-ready states, and browser-tested design-partner flows. It uses synthetic fixtures and the web API integration layer; it does not add production storage behavior or external services.

Phase 3 Milestone 29 adds Private Beta deployment readiness around the dashboard. Slice D adds deterministic protected dashboard state, onboarding state, invite workflow display, feedback views, save/dismiss state, and bug reporting UI inside `apps/web`.

## Ownership

`apps/web` owns:

- application bootstrap
- App Router routing
- dashboard layout
- dashboard navigation
- Opportunity List page
- Opportunity Detail page
- Ranking View
- Evidence View
- Search UI
- Filter UI
- Pagination UI
- loading, empty, and error state UI
- API integration layer for `apps/api`
- OpenAPI client generation configuration and generated route contract
- deterministic frontend fixtures
- deterministic feedback fixtures
- feedback panel and validation summary UI
- design-partner walkthrough support
- dashboard tests and documentation

## Dashboard MVP Surface

Milestone 27 establishes the Dashboard MVP:

- Next.js App Router app scaffold
- strict TypeScript configuration
- independent build script
- route map
- root layout and dashboard shell
- sidebar and topbar navigation
- Opportunity List page
- Opportunity Detail page
- Ranking View
- Evidence View
- Search UI
- Filter UI
- Pagination UI
- loading, empty, and error states
- typed API integration layer
- deterministic fixtures
- unit and component tests
- security tests
- dependency-boundary tests
- route and contract stability tests
- Playwright browser coverage
- repository verification support
- dashboard ownership documentation

## Integration Boundary

The dashboard consumes the REST API created in `apps/api` through the web API integration layer. UI code should not duplicate route strings or bypass the API layer. Tests use deterministic fixtures and do not require a production API server, auth provider, storage service, runtime job, commercial account system, measurement platform, or external outreach service.

Product Validation Loop feedback must consume `apps/web/src/api/feedback.ts` and the generated API route contract. Dashboard components must not create private feedback route strings, persist feedback to local production stores, or display secrets, raw provider payloads, prompts, stacks, or unsafe internals.

## Design-Partner Validation

Use `docs/04_IMPLEMENTATION/04-003_DESIGN_PARTNER_WALKTHROUGH.md` for facilitated sessions. The expected flow is:

1. Open the dashboard.
2. Review opportunity list, ranking metadata, evidence, confidence, provenance, and explanations.
3. Save or dismiss an opportunity.
4. Rate usefulness, evidence quality, and ranking quality.
5. Select safe feedback reason categories.
6. Capture notes outside the repository without committing private participant data.

## Private Beta Boundary

Private Beta dashboard work must continue to consume `apps/api` and the web API integration layer. Slice D adds protected dashboard state, invite-only entry display, onboarding states, feedback views, save/dismiss state, and bug reporting UI.

Slice D remains deterministic and fixture-backed. It must not add production identity provider wiring, commercial account systems, external outreach systems, tenant systems, runtime jobs, or unrelated backend behavior.

## Verification

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-27
pnpm --filter @opportunity-os/web test
pnpm --filter @opportunity-os/web test:e2e
pnpm --filter @opportunity-os/web build
pnpm lint
pnpm build
pnpm test
```

Playwright is configured for deterministic dashboard coverage across desktop and mobile browser profiles. The tests cover dashboard load, navigation, opportunity list, opportunity detail, ranking view, evidence view, search, filters, pagination, loading state, empty state, error state, feedback panel, save/dismiss workflow, validation summary, and design-partner validation flow.

## Non-goals

Milestone 27, Milestone 28, Milestone 29, and Milestone 31 dashboard work must not introduce production identity provider wiring, commercial account systems, measurement platforms, production account management, deployment behavior beyond the documented readiness gate, storage changes outside approved beta schema work, recommendation engines, mobile apps, runtime jobs, provider SDKs, complex admin consoles, external outreach systems, tenant systems, live provider ingestion, AI workflows, or unrelated backend changes.
