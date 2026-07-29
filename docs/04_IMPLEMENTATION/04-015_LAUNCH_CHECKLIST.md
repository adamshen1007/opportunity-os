# 04-015_LAUNCH_CHECKLIST.md

**Document ID:** 04-015
**Version:** 3.0.0
**Status:** Approved (Implementation)
**Layer:** 3 - Implementation
**Owner:** Product Team

# Launch Checklist

## Purpose

Phase 3 Milestone 30 Slice D defines the Private Beta launch checklist for design-partner sessions.

This checklist supports beta launch operations only. It does not add new product features, backend features, AI features, payments, CRM integrations, notifications, analytics platforms, mobile apps, schedulers, or workers.

## Before Inviting Design Partners

- [ ] The Phase 4.5 pilot gate returns `GO` with no unresolved P0 checks.
- [ ] Production readiness checklist is complete.
- [ ] Release checklist is complete.
- [ ] Operator handbook is current.
- [ ] Beta user handbook is current.
- [ ] Support guide is current.
- [ ] Troubleshooting guide is current.
- [ ] Approved design-partner list is ready.
- [ ] Invite access window is defined.
- [ ] Support intake owner is available.
- [ ] Launch notes are prepared.

## Session Start

- [ ] Confirm dashboard entry point is available.
- [ ] Confirm invite-only access works for a test invite.
- [ ] Confirm the operator can observe health and safe logs.
- [ ] Confirm feedback and bug-report paths are ready.
- [ ] Confirm the design partner understands the beta purpose.
- [ ] Confirm no unapproved secrets, screenshots, or participant data are shared.

## During Launch

- [ ] Observe invite acceptance.
- [ ] Observe onboarding.
- [ ] Observe opportunity list usage.
- [ ] Observe opportunity detail usage.
- [ ] Capture usefulness, evidence quality, and ranking quality feedback.
- [ ] Capture bug reports with safe identifiers only.
- [ ] Track feature requests without committing to implementation.
- [ ] Monitor health and logs.

## After Launch

- [ ] Run feedback review workflow.
- [ ] Run bug triage workflow.
- [ ] Summarize product learning.
- [ ] Update known issues.
- [ ] Decide whether next design-partner session is `go`, `go with watch`, or `no-go`.
- [ ] Create scoped follow-up tasks.

## Launch Completion

Launch is complete when design partners can access the beta, complete onboarding, inspect ranked opportunities, submit feedback, report bugs, and leave the session with safe follow-up expectations.

Do not invite design partners while `pnpm verify:pilot-gate` reports `NO-GO`, even when deterministic tests pass.
