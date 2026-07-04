# 04-016_BETA_TROUBLESHOOTING_GUIDE.md

**Document ID:** 04-016
**Version:** 3.0.0
**Status:** Approved (Implementation)
**Layer:** 3 - Implementation
**Owner:** Engineering Team

# Beta Troubleshooting Guide

## Purpose

Phase 3 Milestone 30 Slice D defines troubleshooting guidance for Private Beta operations.

This guide helps operators diagnose beta issues safely. It does not add new runtime diagnostics, backend features, AI features, APIs, dashboard features, payments, CRM integrations, notifications, analytics platforms, mobile apps, schedulers, or workers.

## Troubleshooting Rules

Always collect safe diagnostics first:

- timestamp
- safe component name
- safe error code
- correlation ID
- request ID
- release commit
- browser and device type when relevant
- reproduction steps

Never collect or paste:

- passwords
- tokens
- auth headers
- cookies
- credentials
- database URLs
- provider keys
- raw provider payloads
- raw prompts
- participant private data beyond approved identifiers
- stack traces by default
- raw causes by default

## Invite Problems

Symptoms:

- invite link or code is missing
- invite appears expired
- protected dashboard does not load
- session cannot be found

Checks:

1. Confirm the invite is assigned to the correct design-partner alias.
2. Confirm the invite is inside its access window.
3. Confirm the protected dashboard entry point loads.
4. Confirm the safe error message does not expose internals.
5. Check whether all test invites fail or only one invite fails.

Escalate when all test invites fail or the issue blocks a scheduled beta session.

## Onboarding Problems

Symptoms:

- dashboard shell loads but user cannot proceed
- opportunity list is unclear
- opportunity detail is confusing
- feedback controls are hard to find

Checks:

1. Confirm dashboard shell, opportunity list, and opportunity detail pages render.
2. Confirm ranking explanation, confidence, evidence, and provenance are visible.
3. Confirm save, dismiss, rating, feedback, and bug-report controls are reachable.
4. Capture safe usability notes.

Route usability issues through the feedback review workflow unless the user is blocked.

## Feedback Or Bug-Report Problems

Symptoms:

- feedback submit fails
- bug report submit fails
- rating state is unclear
- saved or dismissed state appears inconsistent

Checks:

1. Confirm the user is in a valid beta session.
2. Confirm the feedback or bug-report path returns a safe result.
3. Record safe error code, correlation ID, and request ID.
4. Retry with deterministic beta fixture data when possible.

Escalate when feedback and bug reporting are unavailable for all design partners.

## Dashboard Problems

Symptoms:

- page does not load
- list is empty unexpectedly
- detail page fails
- ranking or evidence views do not render

Checks:

1. Confirm deployment smoke testing status.
2. Confirm API health status.
3. Confirm dashboard load errors use safe messages.
4. Confirm browser/device information.
5. Check whether rollback triggers apply.

## Operations Problems

Symptoms:

- monitoring is unavailable
- health status is unhealthy
- logs are missing correlation IDs
- logs expose unsafe values
- rollback path is unclear

Checks:

1. Stop expanding beta access.
2. Notify the release owner.
3. Run the relevant verification procedure from `docs/04_IMPLEMENTATION/04-008_BETA_OPERATIONS_VERIFICATION.md`.
4. If logs expose unsafe values, restrict access and rotate secrets when relevant.
5. Decide `go`, `go with watch`, `no-go`, or rollback.

## Troubleshooting Completion

Troubleshooting is complete when the operator has safe diagnostics, severity, owner, next action, and launch decision impact without collecting secrets or adding unscoped implementation.

