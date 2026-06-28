# 05-005_IMPLEMENTATION_ORDER.md


**Document ID:** 05-005
**Version:** 2.0.0
**Status:** Approved (Repository Bootstrap)
**Layer:** 4 – Repository Bootstrap
**Owner:** Architecture Team

# Implementation Order

## Purpose

This document defines the authoritative implementation sequence for Opportunity OS.

It specifies:

- implementation phases

- dependency ordering

- milestone boundaries

- acceptance gates

- handoff criteria

Unlike the Development Roadmap, this document describes the **exact engineering build order**.

Every implementation task must follow this sequence unless an approved Architecture Decision Record (ADR) explicitly authorizes a deviation.

# Guiding Principles

The implementation sequence is designed to:

- minimize rework

- maximize incremental validation

- preserve architectural boundaries

- produce deployable software at every major milestone

- keep Codex implementation sessions small and deterministic

Every phase must leave the repository in a runnable state.

# High-Level Build Sequence

Repository Foundation

│

▼

Shared Infrastructure

│

▼

Persistence Layer

│

▼

Event System

│

▼

Connector Framework

│

▼

Connector Implementations

│

▼

Normalization Engine

│

▼

AI Workflow Platform

│

▼

Business Intelligence Engine

│

▼

REST API

│

▼

Frontend

│

▼

Production Hardening

Each stage depends only on completed lower layers.


# Phase 0 — Repository Foundation

## Goal

Establish the engineering environment.

### Deliverables

- Monorepo

- Package manager

- TypeScript configuration

- Linting

- Formatting

- Testing framework

- Docker Compose

- CI pipeline

- Environment validation

- Logging foundation

### Exit Criteria

- Repository builds successfully.

- CI passes.

- Local development environment is reproducible.

# Phase 1 — Shared Infrastructure

## Goal

Implement reusable platform capabilities.

### Deliverables

- Shared configuration

- Error framework

- Validation library

- Logging package

- Metrics package

- Event abstractions

- Common utilities

### Exit Criteria

- Shared packages compile independently.

- No business logic exists yet.

# Phase 2 — Persistence Layer

## Goal

Implement durable storage.

### Deliverables

- Prisma schema

- Initial migrations

- Repository interfaces

- Repository implementations

- Seed framework

### Exit Criteria

- Database initializes from an empty state.

- Repository tests pass.

# Phase 3 — Event System

## Goal

Enable event-driven communication.

### Deliverables

- Event envelope

- Publisher

- Consumer framework

- Event schemas

- Event testing utilities

### Exit Criteria

- Events can be published and consumed reliably.

- Replay tests pass.


# Phase 4 — Data Acquisition Framework

## Goal

Acquire customer conversations.

### Build Order

1.  Connector Registry

2.  Connector Contract

3.  Connector Runner

4.  Scheduler

5.  Authentication Manager

6.  Raw Content Repository

7.  Reddit Connector

8.  CSV Import Connector

9.  JSON Import Connector

### Exit Criteria

- Connector execution succeeds.

- Raw Content persists.

- Acquisition events are published.

# Phase 5 — Intelligence Platform

## Goal

Transform Raw Content into Opportunities.

### Build Order

1.  Normalization Engine

2.  Canonical Content Repository

3.  Prompt Resolver

4.  AI Provider Abstraction

5.  AI Workflow Orchestrator

6.  Pain Point Extraction Workflow

7.  Problem Clustering

8.  Trend Engine

9.  Opportunity Generator

10. Competition Analysis

11. Deterministic Scoring Engine

### Exit Criteria

- Opportunities are generated from collected data.

- Every Opportunity includes evidence, provenance, and deterministic scoring.

# Phase 6 — Application Platform

## Goal

Expose system capabilities to users.

### Build Order

1.  Authentication

2.  REST API

3.  Dashboard

4.  Opportunity Explorer

5.  Cluster Explorer

6.  Trend Explorer

7.  Connector Management

8.  Reports

9.  Search

10. Export

### Exit Criteria

- Users can complete the full product workflow from ingestion to report export.

# Phase 7 — Production Readiness

## Goal

Prepare for deployment.

### Deliverables

- Performance optimization

- Accessibility verification

- Security review

- Monitoring

- Alerting

- Backup procedures

- Disaster recovery validation

- Deployment automation

- Documentation review

### Exit Criteria

- Release checklist passes.

- Production deployment succeeds.

- Monitoring and rollback procedures are validated.

# Codex Execution Rules

Every implementation session should:

1.  Work on **one task only**.

2.  Read all referenced specifications before coding.

3.  Avoid architectural changes.

4.  Write tests with the implementation.

5.  Update documentation only if implementation changes architecture.

6.  Stop after completing the assigned task.

Do not begin the next task until the current task has passed review.

# Milestone Gates

| **Milestone** | **Required Outcome**              |
|---------------|-----------------------------------|
| M0            | Repository bootstrapped           |
| M1            | Shared infrastructure operational |
| M2            | Database operational              |
| M3            | Event system operational          |
| M4            | Data acquisition operational      |
| M5            | Intelligence platform operational |
| M6            | Application platform operational  |
| M7            | Production-ready release          |

Each milestone must be independently demonstrable before the next phase begins.

# Definition of Implementation Complete

Opportunity OS Version 1.0 is considered implementation-complete when:

- All Engineering Kit specifications are implemented.

- All acceptance criteria are satisfied.

- All automated tests pass.

- CI/CD pipelines are green.

- Documentation matches implementation.

- The end-to-end workflow—from data acquisition to opportunity discovery and report generation—is fully functional.

# References

Depends on:

- 04-001_ROADMAP.md

- 04-002_CODEX_TASKS.md

- All Architecture documents

- All Specification documents

Referenced by:

- Codex implementation sessions

- Sprint planning

- Release planning

- Repository bootstrap

# Revision History

| **Version** | **Date**                             | **Summary**                                                                                                                              |
|-------------|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| 2.0.0       | Initial Repository Bootstrap release | Defined the authoritative engineering build order, implementation phases, milestone gates, and Codex execution rules for Opportunity OS. |
