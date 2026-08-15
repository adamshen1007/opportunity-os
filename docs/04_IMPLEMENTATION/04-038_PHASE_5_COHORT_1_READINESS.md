# 04-038_PHASE_5_COHORT_1_READINESS.md

**Document ID:** 04-038

**Task:** `TASK-P5-A01`

**Phase:** Phase 5 - Design-Partner Learning Pilot

**Status:** Candidate - Independent Review Required

**Baseline:** `28c4f93cc1a77c9452cf593ad07a2a05c19d1ce4`

**Recorded:** 2026-08-15

## 1. Decision

**PHASE 5 A01 COHORT 1 READINESS READY - INDEPENDENT REVIEW REQUIRED**

G01 is externally complete at merged `main` SHA `28c4f93cc1a77c9452cf593ad07a2a05c19d1ce4`; the published canonical G01 digest is `930185fc07283f0ed175fe0ede59985dfa22abe225b25c42bef55906500b9109`.

The A01 candidate freezes Cohort 1 readiness without recording participant-level evidence or starting the pilot. Phase 5 remains `NO-GO`, product/runtime implementation remains unauthorized, and Cohort 1 execution has not started.

## 2. Frozen Cohort And Domain

- Human-approved domain: **small e-commerce teams struggling with powerful customer services**.
- Safe domain ID: `small-ecommerce-powerful-customer-services-v1`.
- Approved cohort size: five.
- Private roster confirmed: yes.
- Human invitation authorization received: yes.
- Participant identities, references, pseudonyms, contact details, hashes, invite/session identifiers, raw queries, and private responses remain outside Git.

The domain includes small e-commerce customer-service operations, support workflows, responsiveness, consistency, process or tooling friction, and limited team capacity in delivering strong customer service. General growth, advertising, merchandising, sourcing, fulfillment, payments, analytics, generic AI adoption, and enterprise contact centers are out of scope unless directly tied to the approved customer-service problem.

## 3. Production Preconditions

On 2026-08-15, the canonical web and API both exposed release SHA `28c4f93cc1a77c9452cf593ad07a2a05c19d1ce4`. Hosted-release verification passed with API health and database readiness `ok`, plus CORS, redirects, and web/API binding passed. The closed Phase 4.5 prerequisite remained `GO` with 13 of 13 P0 checks passing and no unresolved entries.

The exact matched API release used the existing production pre-deploy guard. The guard ran the governed Prisma deployment and status path, found the ten-migration set, confirmed the production schema current, completed successfully, and only then allowed promotion. The target commit contains no new migration.

At the A01 observation at `2026-08-15T07:06:29Z`, the authenticated production database provider showed scheduled daily backups active, seven consecutive completed backups retained, and the newest completed backup at `2026-08-14T21:44:13Z`. This remained consistent with the approved recovery point objective of no more than 24 hours. No backup, restore, configuration change, or database mutation was performed.

## 4. Source And Session Protocol

The only value-qualifying source is `datasource = stack-exchange` and `mode = live`. Reddit readiness remains unverified and outside scope. Fixture activity remains visibly distinct and cannot satisfy pilot value evidence.

For each primary session, the operator must:

1. confirm private authorized-roster membership;
2. explain the AI-assisted hypothesis and human-review limitation;
3. confirm the participant problem is inside the frozen domain;
4. have the participant enter one concrete in-domain problem query;
5. run Stack Exchange live mode and retain every live attempt in the governed denominator;
6. never convert a failed live request into fixture success;
7. review displayed opportunities, evidence, provenance, and ranking;
8. use the existing saved or dismissed feedback;
9. collect the existing one-to-five usefulness, evidence-quality, and ranking-quality ratings;
10. retain strongest and weakest one-sentence feedback only in private operator evidence;
11. store no raw participant query or free text in Git; and
12. stop on any critical safety or reliability incident.

No product field, telemetry, connector, or runtime behavior is added by A01.

## 5. Stop And Invalidation Conditions

Before an invitation or session becomes eligible, stop if any of these is true:

- Phase 4.5 is not `GO`, 13 of 13;
- the canonical web/API release match fails;
- database health is not `ok`;
- production migration status is not current and verified;
- the automated-backup 24-hour RPO is not current and verified;
- the approved domain is not frozen;
- the private roster count is not five;
- human invitation authorization is absent;
- Stack Exchange live mode is unavailable; or
- a critical safety or reliability issue is unresolved.

During A02, the operator also applies the critical incident pause and invalidation rules frozen by the G01 contract and `04-025_DESIGN_PARTNER_PILOT.md`.

## 6. Invitation Effectiveness Boundary

The manifest records `cohortInvitationsAuthorized = true` because the human authorization and all A01 readiness conditions are present in this candidate. That flag is not operationally effective from an unpublished candidate.

Actual invitation execution becomes eligible only after:

1. a fresh independent A01 whole-candidate `PASS`;
2. exact reviewed-byte publication to `main`; and
3. merged-main integrity and readiness verification.

Until then, do not create invite codes, create production invites, send invitations, or begin Cohort 1 sessions. A02 is not authorized by this candidate.

## 7. Aggregate Evidence State

`phase-5-cohort-evidence.json` records Cohort 1 as `ready` at validation revision 1, bound to the matched release, safe domain ID, Stack Exchange, and live mode. Every execution, value, diagnostic, and safety count remains exactly zero; G02 remains `not-evaluated`; Cohort 2 remains absent.

Current state:

```text
Phase 5: NO-GO
product/runtime implementation: NOT AUTHORIZED
Cohort 1 execution: NOT STARTED
```
