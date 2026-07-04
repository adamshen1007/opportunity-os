# 04-012_BETA_OPERATIONAL_WORKFLOWS.md

**Document ID:** 04-012
**Version:** 3.0.0
**Status:** Approved (Implementation)
**Layer:** 3 - Implementation
**Owner:** Product Team

# Beta Operational Workflows

## Purpose

Phase 3 Milestone 30 Slice D defines the beta operational workflows for bug triage, feature requests, and feedback review.

This document is operations-only. It does not add backend features, AI features, APIs, dashboard features, persistence features, authentication features, payments, CRM integrations, notifications, analytics platforms, mobile apps, schedulers, or workers.

## Bug Triage Workflow

Bug triage starts when a design partner, operator, or support owner reports broken behavior.

Capture:

- safe issue title
- affected area
- design-partner alias or approved identifier
- timestamp
- correlation ID when available
- request ID when available
- safe error code or safe error message
- reproduction steps
- expected result
- actual result
- severity
- owner
- next action

Do not capture:

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

Severity:

- `sev-1`: beta cannot continue safely
- `sev-2`: a core beta workflow is blocked
- `sev-3`: workaround exists, but evaluation quality is reduced
- `sev-4`: documentation, copy, or minor usability issue

Triage steps:

1. Confirm whether the issue is reproducible.
2. Confirm whether the issue affects invite, onboarding, opportunity review, feedback, bug reporting, deployment, monitoring, health, or logs.
3. Assign severity.
4. Decide whether rollback, no-go, or watch mode is required.
5. Link safe diagnostics only.
6. Create a scoped follow-up task.
7. Close the issue only after the operator verifies the resolution or documents the accepted limitation.

## Feature Request Workflow

Feature requests are captured for product learning and future planning. They are not implemented during Slice D.

Capture:

- requested capability
- underlying user problem
- current workaround
- affected beta workflow
- supporting feedback
- frequency or repeated demand if known
- operator notes
- priority suggestion

Classify requests as:

- `workflow-friction`
- `evidence-clarity`
- `ranking-clarity`
- `search-filtering`
- `export-sharing`
- `account-access`
- `unsupported-integration`
- `out-of-scope`

Requests involving payments, CRM, notifications, analytics platforms, mobile apps, schedulers, workers, enterprise features, or recommendation engines must be marked `out-of-scope` for Milestone 30.

## Feedback Review Workflow

Feedback review happens after each design-partner session and before the next launch decision.

Review steps:

1. Group feedback by usefulness, evidence quality, ranking quality, onboarding, support, bugs, and feature requests.
2. Identify repeated confusion or repeated praise.
3. Separate product learning from implementation work.
4. Preserve provenance using safe session identifiers only.
5. Confirm no raw private data, provider payloads, prompts, secrets, or unsafe screenshots are copied into planning notes.
6. Convert validated follow-ups into scoped future tasks.
7. Update the beta session summary.

Review outputs:

- blocker list
- usability issue list
- product learning summary
- feature request summary
- safe follow-up tasks
- launch recommendation update

## Workflow Completion

Slice D operational workflows are complete when operators can triage bugs, capture feature requests, and review feedback with safe data, clear severity, documented ownership, and no unscoped implementation.

