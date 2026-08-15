# 04-036_PHASE_5_DESIGN_PARTNER_PILOT_PLAN.md

**Document ID:** 04-036

**Task:** `TASK-P5-G00`

**Phase:** Phase 5 - Design-Partner Learning Pilot

**Status:** Candidate Review Passed - Closure Review Required

**Baseline:** `f738112afcb9fa5d4aa71a49beb700561baa8781`

**Recorded:** 2026-08-15

## 1. Decision

**PHASE 5 GOVERNANCE CANDIDATE REVIEW PASSED - CLOSURE REVIEW REQUIRED - TASK-P5-G01 NOT AUTHORIZED**

Phase 4.5 is closed at `GO` with all 13 P0 checks passing. Phase 5 is the next governed phase, but only `TASK-P5-G00` is executable until this plan, the implementation order, the repository authority surfaces, and the Phase 5 evidence manifest pass a fresh independent review.

No pilot invitation, product feature work, production mutation, provider expansion, deployment, or subsequent Phase 5 task is authorized by this draft.

## 2. Authority Chain

After `TASK-P5-G00` passes independent review, Phase 5 authority is:

1. `AGENTS.md`.
2. This plan.
3. `docs/04_IMPLEMENTATION/evidence/phase-5-design-partner-pilot.json`.
4. Task-specific Phase 5 records.
5. `docs/04_IMPLEMENTATION/README.md` and `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md`.
6. `docs/04_IMPLEMENTATION/04-025_DESIGN_PARTNER_PILOT.md` for the approved pilot hypothesis, cohort structure, session flow, and value thresholds.
7. Phase 4.5 records as closed historical readiness evidence.
8. Stable product, architecture, and engineering foundations.

The Phase 4.5 manifest remains the authoritative production-safety prerequisite and `pnpm verify:pilot-gate` must continue to return `GO`. It is not the Phase 5 exit gate. The Phase 5 manifest is a fail-closed governance bootstrap until `TASK-P5-G01` freezes its session, cohort, and exit-gate semantics.

## 3. Objective

Validate with real design partners whether Opportunity OS consistently turns approved real-world source evidence into opportunities that users:

- understand;
- trust because they can inspect evidence and provenance;
- find useful enough to save or act on; and
- voluntarily return to use again.

Phase 5 validates product value and trust. It does not re-prove the Phase 4.5 production-safety work and does not establish product-market fit, broad-market demand, self-service readiness, public-launch readiness, or Reddit readiness.

## 4. Scope

| Area | Phase 5 scope |
| --- | --- |
| Participants | Begin with five design partners. |
| Expansion | Expand toward ten total only after Cohort 1 has no unresolved critical safety or reliability failure and `TASK-P5-G02` returns `GO`. |
| Problem space | One deliberately narrow problem domain, frozen in `TASK-P5-A01`. |
| Verified live datasource | Stack Exchange through the existing source-neutral pipeline. |
| Fixture mode | Retained for deterministic and demonstration workflows and visibly labelled. |
| Reddit | Excluded from verified pilot scope. |
| Product | Existing hosted Opportunity OS workflow. |
| Identity | Existing invite-only, owner-isolated sessions. |
| Core journey | Login, query, scan, results, evidence, ranking, feedback, deletion, and logout. |
| Measurement | Completion, saved and dismissed results, usefulness, evidence quality, ranking quality, and voluntary repeat use. |
| Evidence | Aggregated, secret-safe pilot evidence only. |
| Remediation | Only defects or value problems demonstrated by pilot evidence. |

The existing source-neutral pipeline, durable access, ownership, deletion, monitoring, recovery, and deterministic quality controls remain the implementation baseline. Phase 5 does not rebuild them.

## 5. Non-Goals

Phase 5 does not authorize:

- new connectors or Reddit, YouTube, X, or Product Hunt integration work;
- payments, subscriptions, self-service registration, enterprise features, CRM integrations, or notifications;
- mobile applications, broader multi-tenancy, recommendation engines, or a broad UI redesign;
- new analytics vendors, speculative infrastructure, or a worker or scheduler without a separately approved evidence-led remediation task;
- automatic scope expansion when a value threshold fails; or
- any subsequent phase merely because the Phase 5 exit gate eventually returns `GO`.

If pilot evidence exposes a blocker that cannot be resolved safely within the existing architecture, the operator must pause the affected pilot activity and create a separately specified, reviewed, and authorized remediation task.

## 6. Governed Task Order

| Order | Task | Purpose | Authorization boundary |
| ---: | --- | --- | --- |
| 1 | `TASK-P5-G00` - Authority Transition And Phase Plan Freeze | Make Phase 5 repository-authoritative. | Documentation and governance only. |
| 2 | `TASK-P5-G01` - Pilot Evidence Contract And Gate | Define machine-readable session, cohort, privacy, aggregation, and Phase 5 gate semantics. | Begins only after G00 independent approval and separate task authorization. |
| 3 | `TASK-P5-A01` - Cohort 1 Readiness | Freeze the matched release, narrow domain, protocol, five-participant cohort, and operator procedure. | No product feature work. No invitations before this gate passes. |
| 4 | `TASK-P5-A02` - Cohort 1 Execution | Run the first five controlled design-partner sessions. | Production operation only under the approved procedure. |
| 5 | `TASK-P5-G02` - Cohort 1 Decision | Evaluate safety, reliability, trust, and value evidence. | Evidence and review only. |
| 6 | `TASK-P5-B01` - Evidence-Led Remediation | Correct an explicit blocker demonstrated by G02 evidence. | Conditional and separately authorized; skip if no remediation is required. |
| 7 | `TASK-P5-A03` - Cohort 2 Expansion | Optionally expand toward ten total participants. | Eligible, but not automatically required, after G02 `GO` and explicit cohort authorization. |
| 8 | `TASK-P5-G03` - Phase 5 Exit Gate | Decide whether the value and trust hypothesis passes. | Begins after G02 and any remediation or additional cohort evidence required by the G01 contract; does not authorize a subsequent phase. |

No Cohort 2 invitation may occur before `TASK-P5-G02`. `TASK-P5-B01` is skipped when Cohort 1 passes without material remediation. `TASK-P5-A03` is eligible after a passing G02 decision but is not a mandatory Phase 5 prerequisite in this bootstrap plan. `TASK-P5-G01` must freeze the exact evidence rule that determines whether G03 may proceed from sufficient Cohort 1 and repeat-use evidence or requires Cohort 2 evidence. Until G01 freezes that rule, neither path may claim exit eligibility.

## 7. Dependencies

- Phase 4.5 remains closed at `GO`, with `pnpm verify:pilot-gate` returning 13 of 13 passed and no unresolved entries.
- Hosted web and API releases remain healthy and expose the same full release SHA before each cohort.
- Stack Exchange remains the only verified live datasource for this pilot.
- Invite-only access, owner isolation, transactional deletion, safe monitoring, backup, restore, and rollback controls remain intact.
- The frozen quality benchmark remains a regression floor.

## 8. Phase 5 Acceptance Criteria

The value thresholds remain exactly aligned with `04-025_DESIGN_PARTNER_PILOT.md`:

| Criterion | Required result |
| --- | ---: |
| Initiated scan completion | At least 80%. |
| Sessions producing at least one saved opportunity | At least 30%. |
| Average usefulness | At least 3.5 out of 5. |
| Displayed opportunities with evidence and provenance | 100%. |
| Critical secret exposure | 0. |
| Unauthorized access incidents | 0. |
| Data-loss incidents | 0. |
| Participants voluntarily completing a second session | At least 3. |

Additional Phase 5 acceptance criteria:

| ID | Requirement |
| --- | --- |
| `P5-AC01` | The merged Phase 4.5 baseline remains intact and `pnpm verify:pilot-gate` remains `GO`. |
| `P5-AC02` | Every live pilot release has matched API and web SHAs. |
| `P5-AC03` | Every session records the datasource and fixture or live mode truthfully. |
| `P5-AC04` | Stack Exchange remains the only verified live source unless a separate governed plan changes that boundary. |
| `P5-AC05` | Every displayed opportunity remains traceable to evidence and provenance. |
| `P5-AC06` | Participant and session evidence contains no credentials, provider payloads, prompts, or unnecessary personal data. |
| `P5-AC07` | Owner isolation and transactional deletion remain intact throughout the pilot. |
| `P5-AC08` | Cohort 2 cannot begin while a critical safety or reliability incident remains unresolved. |
| `P5-AC09` | A value-metric failure produces evidence-led remediation, not automatic product-surface expansion. |
| `P5-AC10` | The final Phase 5 decision receives a fresh independent whole-evidence review. |

## 9. Verification Gates

### G0 - Governance Consistency

Before any Phase 5 implementation or participant invitation, `AGENTS.md`, this plan, the implementation order, both documentation indexes, the pilot contract, and the Phase 5 manifest must agree on one authority chain.

Run from the repository root:

```sh
git diff --check
pnpm repo:check
node scripts/verify-repository.mjs --phase phase-4-milestone-57
pnpm lint
pnpm build
pnpm test
docker compose config
pnpm verify:pilot-gate
```

`pnpm verify:pilot-gate` must remain `GO`, with 13 of 13 checks passing and no unresolved entries. G00 then follows the two-stage review and closure workflow in Section 11.

### G1 - Pre-Cohort Operational Gate

Immediately before each cohort:

- `pnpm verify:pilot-gate` returns `GO`;
- `pnpm verify:hosted-release` passes against the intended canonical origins;
- the web and API expose the same intended full release SHA; and
- the operator verifies current backups, health, and migration status without unnecessarily repeating destructive rehearsals.

### G2 - Cohort 1 Gate

After the first five design partners:

1. Evaluate safety P0 outcomes first.
2. Review reliability.
3. Calculate the approved value metrics.
4. Prevent participant expansion while a critical issue remains.

If safety fails, the result is `NO-GO` and the pilot pauses. If safety passes but value thresholds fail, the result is `NO-GO` and evidence-led remediation is required. Only a passing safety and value decision makes Cohort 2 eligible.

### G3 - Phase Exit

Phase 5 reaches `GO` only when the approved cohort evidence satisfies every Phase 5 P0 and value gate and an independent whole-evidence review passes.

A Phase 5 `GO` means only that the controlled pilot produced sufficient safety, trust, and usefulness evidence to justify planning a subsequent governed phase. It does not prove product-market fit or authorize a public launch, Reddit readiness, unrestricted customer acquisition, or a subsequent phase.

## 10. Publication And Human-Decision Boundaries

| Action | Rule |
| --- | --- |
| Local inspection and reversible verification | Allowed within the active task. |
| Documentation changes | Allowed only within the active authorized task. |
| Product or runtime implementation changes | Require explicit task-specific authorization after G00 approval. |
| Commit, push, PR, or merge | Each requires explicit publication authorization. Direct push to `main` is prohibited. |
| Production deployment or mutation | Requires explicit authorization. |
| Design-partner invitation or cohort expansion | Requires explicit cohort authorization. |
| New provider, billing resource, or material cost | Requires explicit human authorization. |
| Safety-critical issue during a session | Stop the affected session and create a governed remediation task. |
| Subsequent phase | Never automatic. |

Published pilot evidence may contain safe aggregates and evidence identifiers. It must not contain participant identities, private responses, invitation codes, session tokens, credentials, raw prompts, provider payloads, protected URLs, database connection details, or raw causes.

## 11. TASK-P5-G00 Acceptance

The pre-review candidate is ready only when:

- every current-authority surface identifies Phase 5 consistently;
- Phase 4.5 remains explicitly closed at `GO` with 13 of 13 P0 checks passing;
- no current-authority document still describes Phase 4.5 or M34 as active;
- the Phase 5 objective, scope, non-goals, task order, dependencies, gates, and publication boundaries are non-contradictory;
- the `04-025` cohort structure and value thresholds remain unchanged;
- Reddit remains explicitly outside verified scope;
- no product code, workflow, migration, provider configuration, infrastructure, or deployment changes are included;
- all G0 deterministic commands pass;
- `pnpm verify:pilot-gate` remains `GO`; and
- it is submitted for a fresh independent whole-plan candidate review.

Pre-review handoff state:

**PHASE 5 GOVERNANCE TRANSITION READY - INDEPENDENT REVIEW REQUIRED**

This is not G00 completion. A candidate-review `PASS` starts a narrowly bounded closure patch; it does not approve unreviewed byte changes.

### Byte-Safe Closure Workflow

1. An independent reviewer evaluates the exact pre-review candidate and returns `PASS` or `NO-PASS`.
2. After `PASS`, a closure-only patch may update this document's status and decision and record `candidateReview: pass` in the Phase 5 manifest. It must keep `productRuntimeImplementationAuthorized` and `cohortInvitationsAuthorized` false, keep the authority-transition check externally required, and must not start G01.
3. Rerun every G0 command plus stale-authority and secret scans against the closure bytes.
4. Compute the canonical G00 final-state digest defined below. It covers the raw final bytes of all eight allowed G00 paths, not merely the incremental closure-only delta. Submit the exact final state, digest, and verification ledger for a second independent closure review. A prior candidate `PASS` cannot substitute for this review.
5. The closure reviewer must return `PASS` while naming the exact final-state digest. Do not mutate any of the eight reviewed files after that decision. The immutable manifest rule `closureReviewRequired: true` remains a requirement, not a mutable review-status field.
6. Before publication, recalculate the digest from branch head and require equality. Publish only the exact reviewed eight-file state through the separately authorized commit, push, PR, and merge workflow. The publication record must cite the same digest.
7. After merge, recalculate the digest from the eight files on merged `main` and require equality again. If any reviewed file changes after closure-review `PASS`, the review is invalid and the closure review must be repeated. If `main` advances from the fixed baseline in a way that changes an allowed path, creates a conflict, or requires altering reviewed bytes, stop instead of silently rebasing or resolving it.
8. `governance.authority-transition` becomes satisfied without another repository mutation only when both external facts exist: an independent closure-review `PASS` naming the canonical final-state digest and publication of the exact matching eight-file state to `main`. Until both exist, its `external-required` status remains unresolved and G00 is incomplete.

### Canonical G00 Final-State Digest

The fixed baseline is `f738112afcb9fa5d4aa71a49beb700561baa8781`. The allowed final paths, in this exact bytewise lexical order, are:

1. `AGENTS.md`
2. `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md`
3. `docs/04_IMPLEMENTATION/04-001_ROADMAP.md`
4. `docs/04_IMPLEMENTATION/04-025_DESIGN_PARTNER_PILOT.md`
5. `docs/04_IMPLEMENTATION/04-036_PHASE_5_DESIGN_PARTNER_PILOT_PLAN.md`
6. `docs/04_IMPLEMENTATION/README.md`
7. `docs/04_IMPLEMENTATION/evidence/phase-5-design-partner-pilot.json`
8. `docs/05_BOOTSTRAP/05-005_IMPLEMENTATION_ORDER.md`

Before hashing, verify that the complete G00 change from the fixed baseline contains exactly these paths and no others. For each path, calculate the lowercase SHA-256 hexadecimal digest of the file's raw bytes. Construct a UTF-8 digest manifest containing exactly one line per path in the order above:

```text
<path><TAB><lowercase-file-sha256><LF>
```

The manifest must contain eight LF-terminated lines, with no header, footer, blank line, carriage return, or additional whitespace. The canonical G00 final-state digest is the lowercase SHA-256 hexadecimal digest of those manifest bytes. The digest manifest is external review evidence and is not added to any of the eight reviewed files.

Post-review and post-publication completion state:

**PHASE 5 GOVERNANCE TRANSITION APPROVED - TASK-P5-G01 NOT AUTHORIZED**

This state is derived from the immutable merged bytes plus the canonical digest-bound external review and publication evidence; merged files do not need to claim an event before it occurs. Only after both external facts are verified and a separate task authorization is given may `TASK-P5-G01` begin.
