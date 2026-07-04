# 04-009_BETA_OPERATOR_HANDBOOK.md

**Document ID:** 04-009
**Version:** 3.0.0
**Status:** Approved (Implementation)
**Layer:** 3 - Implementation
**Owner:** Engineering Team

# Beta Operator Handbook

## Purpose

Phase 3 Milestone 30 Slice C prepares operators to run the Private Beta with the first 10-20 design partners.

This handbook is operations-only. It does not add backend features, AI features, payments, CRM integrations, notifications, analytics platforms, mobile apps, schedulers, workers, new APIs, dashboard features, persistence features, or authentication features.

## Operator Responsibilities

The operator is responsible for:

- confirming release readiness before beta sessions
- verifying deployment, smoke, rollback, monitoring, health, and logs using `docs/04_IMPLEMENTATION/04-008_BETA_OPERATIONS_VERIFICATION.md`
- preparing test invites and safe beta session notes
- confirming onboarding and support paths are clear
- triaging beta issues with safe identifiers only
- protecting design-partner data and operational secrets
- escalating launch-blocking issues to the release owner

The operator does not create product features, alter production data manually, bypass invite-only access, or make unreviewed configuration changes.

## Daily Beta Operating Loop

Before design-partner usage:

1. Confirm the intended release commit.
2. Confirm the deployment verification record is current.
3. Confirm smoke testing has passed.
4. Confirm monitoring and health views are available.
5. Confirm logs are secret-safe.
6. Confirm invite links or codes are available only to approved design partners.
7. Confirm support intake is ready.

During design-partner usage:

1. Monitor health and safe error counts.
2. Watch invite, onboarding, feedback, and bug-report paths.
3. Record correlation IDs, request IDs, timestamps, and safe issue summaries.
4. Avoid collecting raw prompts, raw provider payloads, secrets, auth headers, database URLs, or participant private details in notes.

After design-partner usage:

1. Review feedback, bug reports, and support notes.
2. Classify blockers, usability issues, product questions, and documentation gaps.
3. Confirm no unsafe logs or artifacts were produced.
4. Record follow-up tasks without adding unscoped implementation.

## Launch Decision Support

The operator may recommend `go`, `go with watch`, or `no-go`.

Use `go` when:

- deployment smoke checks pass
- health checks are healthy
- logs are secret-safe
- invite and onboarding paths work
- feedback and bug reporting paths work

Use `go with watch` when:

- the product is usable
- a known non-blocking issue exists
- monitoring is sufficient
- the release owner accepts the limitation

Use `no-go` when:

- health checks are unhealthy
- invite-only access fails
- dashboard usage is blocked
- feedback or bug reporting is unusable
- logs expose unsafe data
- rollback readiness is unclear

## Safe Operating Notes

Operator notes may include:

- release commit
- deployment workflow run
- safe component names
- timestamps
- correlation IDs
- request IDs
- safe error codes
- design-partner alias or approved identifier
- outcome and next action

Operator notes must not include:

- secrets
- tokens
- auth headers
- credentials
- database URLs
- provider keys
- raw provider payloads
- raw prompts
- screenshots containing sensitive data
- stack traces by default
- raw causes by default

## Escalation

Escalate to the release owner when launch safety, rollback safety, or design-partner usability is at risk.

Escalate to the operations owner when deployment, monitoring, health, logs, or backups are unclear.

Escalate to the support owner when beta participants are blocked or issue intake is incomplete.

## Completion

This handbook is complete when operators can identify responsibilities, run the daily beta operating loop, make launch recommendations, keep notes safely, and escalate issues without adding unscoped product behavior.

