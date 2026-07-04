# 04-014_RELEASE_CHECKLIST.md

**Document ID:** 04-014
**Version:** 3.0.0
**Status:** Approved (Implementation)
**Layer:** 3 - Implementation
**Owner:** Engineering Team

# Release Checklist

## Purpose

Phase 3 Milestone 30 Slice D defines the Private Beta release checklist.

This checklist coordinates a release decision. It does not add new product behavior, APIs, persistence features, authentication features, schedulers, workers, payments, CRM integrations, notifications, analytics platforms, or mobile apps.

## Pre-Release

- [ ] Release owner is assigned.
- [ ] Operations owner is assigned.
- [ ] Support owner is assigned.
- [ ] Database owner is assigned when persistence safety is relevant.
- [ ] Intended release commit is recorded.
- [ ] Release scope is documented.
- [ ] Non-goals are confirmed.
- [ ] Known issues are listed with severity and owner.

## Verification

- [ ] Repository verification passes.
- [ ] M30 verification passes.
- [ ] Lint passes.
- [ ] Build passes.
- [ ] Tests pass.
- [ ] Docker Compose config passes.
- [ ] Deployment verification passes.
- [ ] Smoke testing passes.
- [ ] Health verification passes.
- [ ] Log verification passes.

## Release Notes

Release notes must include:

- release commit
- release date
- operator
- summary of changes
- verification commands
- known limitations
- rollback owner
- support owner
- launch decision

Release notes must not include secrets, raw private data, raw provider payloads, raw prompts, tokens, auth headers, database URLs, stack traces, or raw causes.

## Promotion

- [ ] Release owner approves promotion.
- [ ] Deployment target is confirmed.
- [ ] Protected environment is selected.
- [ ] Last known good release is recorded.
- [ ] Rollback path is ready.
- [ ] Design partners are not invited until post-release smoke checks pass.

## Release Completion

The release is complete when deployment is promoted, post-release smoke checks pass, release notes are recorded, and the support owner confirms beta intake is ready.

