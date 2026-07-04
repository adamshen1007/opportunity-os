# 04-011_BETA_SUPPORT_GUIDE.md

**Document ID:** 04-011
**Version:** 3.0.0
**Status:** Approved (Implementation)
**Layer:** 3 - Implementation
**Owner:** Product Team

# Beta Support Guide

## Purpose

Phase 3 Milestone 30 Slice C defines support documentation for Private Beta operators and design partners.

This guide covers invite support, onboarding support, issue intake, bug triage, feature request capture, and feedback review. It does not add new APIs, dashboards, analytics platforms, notifications, CRM integrations, schedulers, workers, or backend features.

## Support Channels

The approved beta support channel is the operator-managed intake path defined for the beta session.

Support intake may capture:

- design-partner alias
- timestamp
- safe issue summary
- affected area
- safe error message
- correlation ID
- request ID
- severity
- next action

Support intake must not capture:

- passwords
- tokens
- auth headers
- cookies
- database URLs
- provider keys
- raw provider payloads
- raw prompts
- participant private data beyond approved identifiers
- screenshots containing secrets
- stack traces by default
- raw causes by default

## Invite Support

For invite issues, ask:

1. Did the user receive the expected beta invite?
2. Is the invite within its intended access window?
3. Does the protected dashboard entry point load?
4. Is the displayed error safe and actionable?
5. Is the issue limited to one design partner or all test invites?

Classify invite issues as:

- `invite-missing`
- `invite-expired`
- `invite-invalid`
- `session-unavailable`
- `dashboard-entry-blocked`
- `unknown-safe-error`

Do not request raw invite tokens, auth headers, cookies, or private credentials from the user.

## Onboarding Support

For onboarding issues, verify:

- the dashboard shell loads
- the opportunity list is visible
- opportunity details render
- ranking explanation is visible
- evidence and provenance are visible
- save, dismiss, rating, feedback, and bug-report paths are understandable

Classify onboarding issues as:

- `navigation-confusing`
- `opportunity-list-empty`
- `opportunity-detail-blocked`
- `evidence-unclear`
- `rating-confusing`
- `feedback-submit-blocked`
- `bug-report-submit-blocked`

## Bug Triage Workflow

Bug triage uses severity:

- `sev-1`: beta cannot continue safely
- `sev-2`: core evaluation workflow is blocked for one or more design partners
- `sev-3`: workaround exists, but the beta experience is degraded
- `sev-4`: documentation, copy, or minor usability issue

Triage steps:

1. Record safe identifiers and timestamps.
2. Capture safe reproduction steps.
3. Link correlation ID and request ID when available.
4. Check whether the issue affects invite, onboarding, opportunity review, feedback, bug reporting, health, or logs.
5. Decide whether rollback, no-go, or watch mode is required.
6. Create a follow-up task without adding unscoped implementation.

## Feature Request Workflow

Feature requests are captured for review, not implemented immediately.

Record:

- requested capability
- user problem
- current workaround
- affected workflow
- evidence from beta feedback
- priority suggestion

Do not commit to payments, CRM integrations, notifications, analytics platforms, mobile apps, recommendation engines, or enterprise features during this milestone.

## Feedback Review Workflow

Review feedback after each beta session:

1. Group feedback by opportunity usefulness, evidence quality, ranking quality, onboarding, support, and bugs.
2. Identify blockers and repeated confusion.
3. Preserve safe provenance for each feedback item.
4. Avoid copying raw private data into planning documents.
5. Convert validated follow-ups into scoped future tasks.

## Completion

This guide is complete when operators can support invites, onboarding, beta issues, bug triage, feature requests, and feedback review using safe information only.

