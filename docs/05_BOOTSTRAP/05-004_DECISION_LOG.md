# 05-004_DECISION_LOG.md


**Document ID:** 05-004
**Version:** 3.0.0
**Status:** Approved (Repository Bootstrap)
**Layer:** 4 – Repository Bootstrap
**Owner:** Architecture Team

# Architecture Decision Log

## Purpose

This document records all significant architectural decisions that affect Opportunity OS.

It provides a chronological and operational view of decisions, independent of detailed Architecture Decision Records (ADRs).

Its objectives are to:

- provide a single place to review current architectural decisions

- prevent previously rejected approaches from being reintroduced

- help engineers and AI coding agents understand why the system is built the way it is

- maintain architectural consistency as the platform evolves

This document is authoritative unless superseded by an approved ADR.

# Relationship to ADRs

ADRs capture the detailed reasoning for an individual decision.

This Decision Log summarizes:

- current status

- implementation impact

- effective version

- supersession history

When a new ADR is approved:

1.  Update the ADR.

2.  Update this Decision Log.

3.  Update affected specifications if required.

# Decision Status

Every decision must have one status:

| **Status** | **Meaning**                      |
|------------|----------------------------------|
| Active     | Current architecture             |
| Planned    | Approved but not yet implemented |
| Deprecated | Being phased out                 |
| Superseded | Replaced by another decision     |
| Rejected   | Explicitly prohibited            |

Only **Active** and **Planned** decisions should influence new implementation.

# Decision Identifier

Every decision receives an immutable identifier.

Format:

DEC-001

DEC-002

DEC-003

Identifiers are never reused.


# Active Decisions

## DEC-001

### Title

Three-Platform Architecture

### Status

Active

### Effective Version

2.0.0

### Summary

Opportunity OS is permanently divided into:

- Data Acquisition Framework

- Intelligence Platform

- Application Platform

Business logic must not cross platform boundaries.

## DEC-002

### Title

Canonical Content as the Single Source of Truth

### Status

Active

### Effective Version

2.0.0

### Summary

All downstream intelligence must originate from Canonical Content.

AI workflows, clustering, trends, scoring, and reporting must never operate directly on Raw Content.

## DEC-003

### Title

Deterministic Scoring

### Status

Active

### Effective Version

2.0.0

### Summary

Large language models assist with interpretation only.

Opportunity Scores are calculated exclusively by the deterministic Scoring Engine.

## DEC-004

### Title

Prompt Externalization

### Status

Active

### Effective Version

2.0.0

### Summary

Prompts are version-controlled engineering assets.

Prompt text must never be embedded directly in application code.

## DEC-005

### Title

Provider Abstraction

### Status

Active

### Effective Version

2.0.0

### Summary

All AI providers are accessed through a provider abstraction layer.

Business services must never depend directly on provider SDKs.


# Additional Active Decisions

## DEC-006

### Title

Event-Driven Platform Communication

### Status

Active

### Summary

Cross-platform communication uses versioned events where asynchronous processing is appropriate.

Direct coupling between platforms should be minimized.

## DEC-007

### Title

Immutable Evidence

### Status

Active

### Summary

Raw Content, Canonical Content, Evidence Quotes, and published Events are immutable.

Corrections create new records rather than modifying historical evidence.

## DEC-008

### Title

Documentation-Driven Development

### Status

Active

### Summary

Architecture and specifications are approved before implementation.

Implementation should conform to documentation rather than redefining architecture.

## DEC-009

### Title

Repository Pattern

### Status

Active

### Summary

Business services interact with repositories.

Repositories encapsulate persistence details and return domain objects.

## DEC-010

### Title

Single Responsibility Services

### Status

Active

### Summary

Each service owns one business capability.

Large multi-purpose services are not permitted.

# Change Process

A new architectural decision requires:

1.  Identify the architectural concern.

2.  Draft or update an ADR.

3.  Review the impact on existing specifications.

4.  Update this Decision Log.

5.  Update implementation guidance if necessary.

6.  Record the effective version.

No implementation should rely on undocumented architectural decisions.

# Guidance for Codex

Before implementing a feature:

1.  Read this Decision Log.

2.  Read the relevant ADRs.

3.  Read the applicable Engineering Kit specifications.

4.  Verify the implementation does not conflict with any **Active** decision.

If a requested implementation conflicts with an Active decision:

- Stop implementation.

- Explain the conflict.

- Recommend updating the architecture before changing the code.

# References

Depends on:

- Architecture Decision Records (ADRs)

- 02-001_ARCHITECTURE.md

- 01-002_ENGINEERING_PRINCIPLES.md

Referenced by:

- Codex implementation prompts

- Code review

- Architecture review

- Release planning

# Revision History

| **Version** | **Date**                             | **Summary**                                                                                                                                  |
|-------------|--------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| 2.0.0       | Initial Repository Bootstrap release | Established the authoritative architectural decision log, decision lifecycle, status model, and current active decisions for Opportunity OS. |
