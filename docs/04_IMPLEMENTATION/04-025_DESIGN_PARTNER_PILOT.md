# 04-025_DESIGN_PARTNER_PILOT.md

**Document ID:** 04-025
**Status:** Approved Phase 5 Pilot Contract
**Scope:** Phase 5 - Design-Partner Learning Pilot

## Authority Relationship

This document owns the approved pilot hypothesis, cohort structure, session workflow, metrics, and value thresholds. `04-036_PHASE_5_DESIGN_PARTNER_PILOT_PLAN.md` owns the current Phase 5 task order, gates, and authorization boundaries. This contract is not an independent active gate and does not authorize invitations.

## Objective

Validate whether real source evidence produces opportunities that design partners understand and value. This is a learning pilot, not a claim of market demand or an unattended production launch.

## Cohort

- Begin with five design partners; expand to ten only after the first cohort has no critical reliability or safety issue.
- Use one narrow problem domain and Stack Exchange as the approved live source.
- Reddit remains disabled until written API approval and valid credentials are available.

## Session Flow

1. Explain that results are AI-assisted hypotheses requiring human review.
2. Ask the participant to enter one concrete problem query.
3. Run the scan and observe whether the participant understands progress and fallback state.
4. Ask the participant to open evidence and explain the opportunity in their own words.
5. Have the participant save or dismiss each useful result and rate usefulness, evidence quality, and ranking quality.
6. Record one sentence explaining the strongest result and one explaining the weakest result.
7. Do not record private credentials, provider payloads, prompts, or sensitive participant data.

## Metrics

Record per session: scan started/completed, source, mode, retrieved items, generated opportunities, evidence coverage, average confidence, duration, saved, dismissed, rated, and returned-for-second-session.

## Go Gates

- at least 80% of initiated scans complete;
- at least 30% of sessions produce one saved opportunity;
- average usefulness is at least 3.5 out of 5;
- every displayed opportunity has evidence and provenance;
- no critical secret exposure, unauthorized access, or data-loss incident;
- at least three participants voluntarily complete a second session.

If any safety gate fails, stop the pilot. If value metrics fail, improve source queries, evidence quality, analysis prompts, or ranking explanations before adding more connectors or product surface.

## Operator Record

For every release, record the commit SHA, safe canonical-origin identifiers, migration status, health result, fixture smoke result, live smoke result, backup timestamp, rollback target, and pilot decision. Store no secret values, participant identities, invitation values, session values, protected URLs, prompts, or provider payloads in the repository record.
