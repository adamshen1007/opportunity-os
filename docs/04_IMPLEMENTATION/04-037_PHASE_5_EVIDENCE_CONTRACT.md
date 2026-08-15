# 04-037_PHASE_5_EVIDENCE_CONTRACT.md

**Document ID:** 04-037

**Task:** `TASK-P5-G01`

**Contract version:** `phase-5-pilot-evidence-v1`

**Status:** Candidate - Independent Review Required

**Baseline:** `9dd3dd6c3e1e71f0a131778ecbc731d7480ceb91`

**Recorded:** 2026-08-15

## 1. Decision

**PHASE 5 G01 EVIDENCE CONTRACT READY - INDEPENDENT REVIEW REQUIRED**

This contract freezes aggregate evidence and deterministic gate semantics for the Phase 5 design-partner learning pilot. It collects no participant evidence and authorizes no product/runtime change, deployment, production mutation, provider change, participant selection, invitation, cohort execution, or `TASK-P5-A01` work.

Phase 5 remains `NO-GO`. `productRuntimeImplementationAuthorized` and `cohortInvitationsAuthorized` remain false.

## 2. Authority And Preconditions

G00 is externally complete. PR #5 published the independently reviewed governance state to `main` at `9dd3dd6c3e1e71f0a131778ecbc731d7480ceb91`; the merged-main canonical digest matched `fa6f76f97b4fbea15dc47f504287c51357be49407e00671e834e36b67e82d9bb`.

The Phase 4.5 prerequisite remains authoritative for production safety and must continue to return `GO`, 13 of 13, through `pnpm verify:pilot-gate`.

Within G01, authority order is:

1. `AGENTS.md`.
2. `04-036_PHASE_5_DESIGN_PARTNER_PILOT_PLAN.md`.
3. `docs/04_IMPLEMENTATION/evidence/phase-5-design-partner-pilot.json`.
4. This contract.
5. `04-025_DESIGN_PARTNER_PILOT.md` for the approved pilot workflow and thresholds.
6. Existing code and persistence contracts as implementation evidence only.

## 3. Frozen Evidence Units

### Participant

A participant is one approved design partner admitted under the governed cohort procedure. Repository evidence contains counts only. Identity, email, identity hashes, invite/session identifiers, and participant pseudonyms remain outside Git.

### Primary session

A primary session is a participant's first governed Phase 5 evaluation session for one validation revision. Cohort 1 G02 eligibility requires exactly five distinct primary participants and exactly five primary sessions for the current revision.

Each governed primary session must be backed by at least one initiated Stack Exchange live scan attempt. Aggregate `liveSessionCount` must cover every primary session plus at least one separate live session for each distinct voluntary repeat participant; fixture-session counts cannot provide that backing.

The primary-session denominator retains a session when its approved live attempt fails and fixture/demo output is subsequently shown. Fixture output cannot become qualifying live value evidence.

### Source and mode

The only v1 value-qualifying combination is:

```text
datasource = stack-exchange
mode = live
```

Fixture activity may support demonstration, troubleshooting, and deterministic safety checks. It never satisfies live completion, save, usefulness, evidence/provenance, or repeat-use thresholds. Safety incidents from any governed activity, including fixture/demo activity, remain in scope. Reddit is not eligible.

### Scan attempt and completion

Every actual live Stack Exchange scan initiated during a governed primary session is an attempt. Retries are additional attempts and remain in the denominator. Pre-request validation that creates no scan/job is excluded. Cancellation after creation is initiated but not completed. Completion requires the hosted system's normal completed state with live output.

### Saved-opportunity session

A primary session counts once when at least one opportunity from a qualifying live scan receives the existing `saved` feedback status. Multiple saves in one primary session do not increase the numerator. The aggregate saved-session count cannot exceed completed live scan attempts.

### Ratings

The existing 1-5 targets remain authoritative: `usefulness`, `evidence-quality`, and `ranking-quality`. Usefulness is a value gate. Evidence-quality and ranking-quality are required diagnostics with no invented numerical pass threshold. Fixture ratings are excluded.

### Displayed opportunity

Coverage includes opportunities actually displayed from qualifying live primary-session results. Generated but undisplayed opportunities are excluded. A covered opportunity must have both required evidence and provenance.

### Voluntary repeat participant

Repeat use counts distinct participants who voluntarily return for a separate governed session using the approved hosted product and Stack Exchange live scope. A mandatory follow-up is not voluntary. The private operator record holds the attestation; the repository stores only the distinct aggregate count.

### Critical incident

Critical secret exposure, unauthorized access, data loss, and unresolved critical reliability incidents are zero-tolerance counts over all governed pilot activity.

## 4. Exact Threshold Arithmetic

All comparisons use integers; no floating-point rounding is authoritative.

### Initiated scan completion

```text
initiatedLiveScanAttempts > 0
AND completedLiveScanAttempts * 100 >= initiatedLiveScanAttempts * 80
```

Numerator: completed qualifying live attempts. Denominator: every initiated qualifying live attempt, including retries and failed attempts.

### Saved-session rate

```text
primarySessionCount > 0
AND primarySessionsWithSavedOpportunity * 100 >= primarySessionCount * 30
```

Numerator: primary sessions with at least one qualifying `saved` opportunity. Denominator: governed primary sessions for the current revision.

### Average usefulness

```text
usefulnessRatingCount > 0
AND usefulnessRatingSum * 10 >= usefulnessRatingCount * 35
```

The sum must be between the rating count and five times the rating count. Numerator: the integer sum of qualifying usefulness ratings. Denominator: the number of submitted qualifying usefulness ratings.

### Evidence and provenance coverage

```text
displayedLiveOpportunityCount > 0
AND displayedLiveOpportunityWithEvidenceAndProvenanceCount
    == displayedLiveOpportunityCount
```

### Safety and reliability

Each count must equal zero:

```text
criticalSecretExposureCount
unauthorizedAccessIncidentCount
dataLossIncidentCount
criticalReliabilityIncidentCount
```

### Voluntary repeat use

```text
voluntaryRepeatParticipantCount >= 3
```

The count cannot exceed governed primary participants.

## 5. Cohort Decisions

### Cohort 1 G02

G02 is eligible only when the current validation revision has exactly five primary participants, exactly five primary sessions, every safety/reliability count is zero, and every approved value rule passes. Repository-only calculation does not substitute for the governed G02 review.

### Cohort 2

Cohort 2 is optional. A genuine G02 `GO` with sufficient Cohort 1 and repeat-use evidence may proceed directly to G03 when no remediation remains and other G03 prerequisites are satisfied.

If Cohort 2 executes, it must use this contract. Its completed counts are aggregated with Cohort 1 for every threshold and cannot be selectively ignored. Cohort 2 cannot begin before G02 `GO` and explicit cohort authorization.

Present Cohort 2 evidence must be in `completed` state with its matched release and frozen domain recorded before it can participate in final Phase 5 evaluation. A completed Cohort 2 must contain one through five primary participants and exactly one primary session per primary participant; a zero-activity cohort is invalid. Cohort 1 plus Cohort 2 cannot exceed ten total primary participants or sessions. Ready, in-progress, invalidated, empty, or oversized Cohort 2 evidence cannot produce Phase 5 `GO`.

## 6. Remediation And Revalidation

G02 `NO-GO` evidence is immutable. If B01 is separately authorized and published, validation returns to A01 for a new matched release/protocol readiness revision, A02 for new governed evidence, and G02 for a new decision.

`validationRevision` increases monotonically. `validationHistory` must contain one contiguous entry for every prior revision, beginning at revision 1, with no gaps or deletions. Historical revision decisions, lowercase safe evidence IDs of at most 160 characters using letters, digits, dots, and hyphens, and lowercase SHA-256 evidence digests remain in that history; a new revision cannot overwrite, omit, or reinterpret an older failure. Only a current-revision G02 `GO` makes A03 or G03 eligible. Cohort 2 is not a rescue path around a failed G02.

## 7. Privacy And Evidence Layers

### Private operator evidence - never committed

May hold the minimum participant mapping, session timestamps, protected resource identifiers, feedback/scan references, voluntary-return attestations, and strongest/weakest notes needed to substantiate aggregates. It must not hold credentials, invite values, session tokens, database URLs, provider payloads, prompts, raw causes, or unnecessary personal data.

### Repository evidence - aggregate only

May hold contract/schema versions, safe cohort ID, validation revision, matched release SHA, safe frozen-domain ID, integer counts/sums, reproducible derived metrics, safe evidence IDs, and decision state.

It must not hold names, emails, participant references or pseudonyms, hashes of personal identifiers, invite/session/scan/opportunity/feedback identifiers, participant queries, free-text responses, private notes, protected URLs, credentials, prompts, provider payloads, or raw stack traces/causes.

## 8. Machine-Readable Artifacts

- `evidence/phase-5-design-partner-pilot.json` owns Phase 5 authority/check state.
- `evidence/phase-5-cohort-evidence.json` owns aggregate cohort values and validation history. Its G01 candidate contains no real participant evidence and remains `not-started`.
- `schemas/phase-5-cohort-evidence.schema.json` closes the aggregate shape, enums, allowed fields, and non-negative integer counts.
- `scripts/verify-phase-5-design-partner-pilot.mjs` validates and evaluates the records without network, database, secrets, or dependencies.
- `scripts/verify-phase-5-design-partner-pilot.test.mjs` freezes negative and boundary behavior.

The verifier closes the Phase 5 manifest as well as the cohort evidence: only the seven canonical P0 check IDs may appear, each exactly once with its governed area, and all manifest/check/decision fields are allowlisted. Secret-like, email-like, and URL-like repository evidence is rejected without echo. JSON Schema cannot express cross-field arithmetic or revision contiguity, so those safety-critical invariants are enforced by the dependency-free verifier and its adversarial tests.

## 9. Deterministic Gate Lifecycle

`pnpm verify:phase-5-gate` fails closed and returns `NO-GO` during G01/A01/A02/G02 until evidence and governed checks support another decision. Its nonzero exit for the empty G01 record is expected.

Final Phase 5 `GO` additionally requires `currentTaskId = TASK-P5-G03` and every canonical P0 check, including `phase.exit-review`, to be `pass`; passing Cohort 1 value metrics alone can never produce the phase decision.

For G03, substantive evidence is frozen before independent whole-evidence candidate review. A closure-only state patch may record that review and the final candidate check/decision. After deterministic verification, an exact-byte closure review binds the candidate. Phase 5 `GO` becomes authoritative only after those exact bytes are published and verified unchanged. No post-closure mutation is required.

## 10. G01 Completion And Handoff

G01 remains externally required in the candidate manifest. It completes externally only after:

1. fresh independent candidate review passes;
2. exact candidate bytes pass deterministic verification;
3. separately authorized publication puts those exact reviewed bytes on `main`; and
4. published bytes are verified unchanged.

Until then:

```text
Phase 5: NO-GO
product/runtime implementation: NOT AUTHORIZED
cohort invitations: NOT AUTHORIZED
TASK-P5-A01: NOT AUTHORIZED
```
