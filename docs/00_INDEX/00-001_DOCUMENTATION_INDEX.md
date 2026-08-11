# 00-001_DOCUMENTATION_INDEX.md


**Document ID:** 00-001
**Version:** 3.0.0
**Status:** Approved (Foundation)
**Layer:** 0 – Engineering Knowledge Base
**Owner:** Opportunity OS Architecture Team

## Opportunity OS Engineering Knowledge Base

## Engineering Kit v3.0 Status

Engineering Kit v3.0 remains the canonical foundation for stable architecture, terminology, and engineering guidance. Current implementation-phase authority is defined by the active implementation plan, gate document, and evidence manifest identified below.

The historical milestone catalog below preserves Engineering Kit context through Phase 4 Milestone 33. It does not determine the current implementation phase or pilot readiness:

- Phase 0 Repository Foundation
- Phase 1 M1 Runtime Configuration
- Phase 1 M2 Shared Foundation
- Phase 1 M3 Logging Foundation
- Phase 1 M4 Event Foundation
- Phase 1 M5 Database Foundation
- Phase 1 M6 Domain Foundation
- Phase 1 M7 Application Foundation
- Phase 1 M8 Dependency Injection & Composition
- Phase 1 M9 Infrastructure Composition
- Phase 2 M10 Connector SDK Foundation
- Phase 2 M11 Connector Runtime Foundation
- Phase 2 M12 Connector Host Foundation
- Phase 2 M13 Reddit Connector Foundation
- Phase 2 M14 Reddit Runtime
- Phase 2 M15 Reddit Provider Transport
- Phase 2 M16 Raw Content Pipeline
- Phase 2 M17 Normalization Pipeline
- Phase 2 M18 Embedding Foundation
- Phase 2 M19 LLM Analysis Foundation
- Phase 2 M20 Structured Analysis Foundation
- Phase 2 M21 Opportunity Engine Foundation
- Phase 2 M22 Opportunity Pipeline Foundation
- Phase 2 M23 Candidate Opportunity Engine
- Phase 2 M24 Opportunity Generation Workflow
- Phase 3 M25 Opportunity Ranking Engine
- Phase 3 M26 REST API
- Phase 3 M27 Dashboard MVP
- Phase 3 M28 Product Validation Loop
- Phase 3 M29 Private Beta
- Phase 3 M30 Beta Operations
- Phase 4 M31 Local Product Runtime
- Phase 4 M32 Product Data Schema
- Phase 4 M33 Reddit Live Provider Transport

## Current Active Phase

The active implementation phase is **Phase 4.5 — Design-Partner Readiness**.

Current execution and readiness authority:

- `docs/04_IMPLEMENTATION/04-028_PHASE_4_5_EXECUTION_PLAN.md` — approved Phase 4.5 execution plan.
- `docs/04_IMPLEMENTATION/04-034_PHASE_4_5_PILOT_GATE.md` — `TASK-P45-G01` fail-closed design-partner pilot gate.
- `docs/04_IMPLEMENTATION/evidence/phase-4-5-pilot-gate.json` — machine-readable current P0 readiness state consumed by `pnpm verify:pilot-gate`.

Do not infer the current pilot decision from historical milestone descriptions in this index. For current readiness, use the gate document and evidence manifest. Do not duplicate volatile pass counts or blocker lists here.

From Milestone 15 onward the project transitions from platform foundation to real provider and product capability, but each capability must still follow the staged implementation order in `docs/05_BOOTSTRAP/05-005_IMPLEMENTATION_ORDER.md`.

## Purpose

This document is the authoritative entry point into the Opportunity OS Engineering Kit.

It defines:

- the documentation hierarchy

- the ownership of architectural concepts

- document dependencies

- the order in which documents should be read

- documentation governance rules

- the review and approval process

Every engineer, AI coding agent, and reviewer must begin here before modifying the repository.

## Engineering Kit Philosophy

The Engineering Kit is the single source of truth for the Opportunity OS platform.

It is designed to serve two audiences:

1.  Human engineers

2.  AI coding agents (for example, Codex)

The documentation is organized so that higher-level documents define intent, while lower-level documents define implementation.

A lower-level document must never redefine or contradict a higher-level document.

If a conflict exists, the higher-level document always prevails.

## Documentation Layers

The Engineering Kit is organized into five layers.

## Layer 0 — Foundation

Purpose:

Define why the platform exists and establish the engineering philosophy.

Documents:

- 00-001_DOCUMENTATION_INDEX.md

- 01-001_VISION.md

- 01-002_ENGINEERING_PRINCIPLES.md

- 01-003_GLOSSARY.md

These documents are expected to change rarely.

## Layer 1 — Architecture

Purpose:

Describe the stable structure of the platform.

Documents:

- 02-001_ARCHITECTURE.md

- 02-002_DOMAIN_MODEL.md

- 02-003_DATA_ACQUISITION_FRAMEWORK.md

- 02-004_EVENT_MODEL_SPEC.md

- ADR-001 through ADR-00N

Architecture documents define system boundaries, responsibilities, and long-term design decisions.

## Layer 2 — Specifications

Purpose:

Provide implementation contracts.

Documents:

- 03-001_PRD.md

- 03-002_DATABASE_SPEC.md

- 03-003_API_SPEC.md

- 03-004_AI_WORKFLOW_SPEC.md

- 03-005_PROMPT_LIBRARY_SPEC.md

- 03-006_SCORING_ENGINE_SPEC.md

- 03-007_FRONTEND_SPEC.md

Specifications define exactly what software must implement.

## Layer 3 — Implementation

Purpose:

Guide software development.

Documents:

- 04-001_ROADMAP.md

- 04-002_CODEX_TASKS.md

- 04-003_DESIGN_PARTNER_WALKTHROUGH.md

- 04-004_PRIVATE_BETA_DEPLOYMENT.md

- 04-005_PRIVATE_BETA_OPERATIONS.md

- 04-006_PRIVATE_BETA_RUNBOOK.md

- 04-007_PRIVATE_BETA_CHECKLIST.md

- 04-008_BETA_OPERATIONS_VERIFICATION.md

- 04-009_BETA_OPERATOR_HANDBOOK.md

- 04-010_BETA_USER_HANDBOOK.md

- 04-011_BETA_SUPPORT_GUIDE.md

- 04-012_BETA_OPERATIONAL_WORKFLOWS.md

- 04-013_PRODUCTION_READINESS_CHECKLIST.md

- 04-014_RELEASE_CHECKLIST.md

- 04-015_LAUNCH_CHECKLIST.md

- 04-016_BETA_TROUBLESHOOTING_GUIDE.md
- 04-017_LOCAL_PRODUCT_RUNTIME.md
- 04-018_REDDIT_LIVE_PROVIDER_TRANSPORT.md
- 04-019_MVP_USER_TEST_READINESS.md
- 04-020_MVP_TRIAL_WALKTHROUGH.md
- 04-021_EXTERNAL_MVP_RUNTIME.md
- 04-022_EXTERNAL_MVP_READINESS_GATE.md
- 04-023_MULTI_SOURCE_PRODUCT_VALIDATION.md
- 04-024_PRODUCTION_RUNTIME_AND_DEPLOYMENT.md
- 04-025_DESIGN_PARTNER_PILOT.md
- 04-026_EXTERNAL_USER_LAUNCH.md
- 04-027_EXTERNAL_USER_SCALE_READINESS.md
- 04-028_PHASE_4_5_EXECUTION_PLAN.md
- 04-029_PHASE_4_5_HOSTED_RELEASE_AND_MIGRATION_RUNBOOK.md
- 04-030_OPPORTUNITY_QUALITY_VALIDATION.md
- 04-031_PHASE_4_5_LIVE_DATASOURCE_VERIFICATION.md
- 04-032_PHASE_4_5_TRANSACTIONAL_DELETION.md
- 04-033_PHASE_4_5_MONITORING_AND_RECOVERY.md
- 04-034_PHASE_4_5_PILOT_GATE.md
- 04-035_PHASE_4_5_STANDALONE_TEST_WORKFLOW_CLOSURE.md

- Development playbooks

- Coding standards

- AI Engineering OS

## Layer 4 — Operations

Purpose:

Operate the production platform.

Documents:

- Deployment guides

- Monitoring guides

- Incident response

- Security runbooks

- Backup and recovery

These documents are outside the scope of the MVP but are part of the long-term Engineering Kit.

## Repository Documentation Structure

docs/

│

├── 00_INDEX/

├── 01_FOUNDATION/

├── 02_ARCHITECTURE/

├── 03_SPECIFICATIONS/

├── 04_IMPLEMENTATION/

└── 05_BOOTSTRAP/

developer-ai/

schemas/

templates/

examples/

## Canonical Reading Order

Every new engineer or AI coding agent should read documents in the following order.

## Phase 1 — Foundation

1.  DOCUMENTATION_INDEX.md

2.  VISION.md

3.  ENGINEERING_PRINCIPLES.md

4.  GLOSSARY.md

Purpose:

Understand why the platform exists.

## Phase 2 — Architecture

5.  ARCHITECTURE.md

6.  DOMAIN_MODEL.md

7.  DATA_ACQUISITION_FRAMEWORK.md

8.  EVENT_MODEL_SPEC.md

9.  ADRs

Purpose:

Understand how the platform is organized.

## Phase 3 — Product Specifications

10. PRD.md

11. DATABASE_SPEC.md

12. API_SPEC.md

13. AI_WORKFLOW_SPEC.md

14. PROMPT_LIBRARY_SPEC.md

15. SCORING_ENGINE_SPEC.md

16. FRONTEND_SPEC.md

Purpose:

Understand implementation requirements.

## Phase 4 — AI Engineering OS

Read the developer-ai/ documentation relevant to the task before generating code.

Examples:

- Add Connector

- Add API Endpoint

- Add AI Workflow

- Add Database Migration

- Review Pull Request

## Phase 5 — Implementation

Read:

- ROADMAP.md

- CODEX_TASKS.md

- DESIGN_PARTNER_WALKTHROUGH.md

before beginning development.

For v3.0 and later Codex work, also read:

- `docs/05_BOOTSTRAP/05-002_REPOSITORY_STRUCTURE.md`
- `docs/05_BOOTSTRAP/05-005_IMPLEMENTATION_ORDER.md`
- `developer-ai/00_CONTEXT/REPOSITORY_OVERVIEW.md`
- `developer-ai/00_CONTEXT/ARCHITECTURE_MAP.md`

For the current Phase 4.5 implementation and readiness decision, follow the authority chain in **Current Active Phase** above before using historical implementation records.

## Source of Truth Matrix

Each engineering topic has exactly one authoritative owner.

| **Topic**              | **Authoritative Document**    |
|------------------------|-------------------------------|
| Product Vision         | VISION.md                     |
| Engineering Philosophy | ENGINEERING_PRINCIPLES.md     |
| Terminology            | GLOSSARY.md                   |
| System Architecture    | ARCHITECTURE.md               |
| Domain Model           | DOMAIN_MODEL.md               |
| Data Acquisition       | DATA_ACQUISITION_FRAMEWORK.md |
| Event Contracts        | EVENT_MODEL_SPEC.md           |
| Product Requirements   | PRD.md                        |
| Database Schema        | DATABASE_SPEC.md              |
| API Contracts          | API_SPEC.md                   |
| AI Processing          | AI_WORKFLOW_SPEC.md           |
| Prompt Definitions     | PROMPT_LIBRARY_SPEC.md        |
| Opportunity Scoring    | SCORING_ENGINE_SPEC.md        |
| User Interface         | FRONTEND_SPEC.md              |
| Development Process    | ROADMAP.md                    |
| AI Coding Guidance     | developer-ai/                          |

No concept may have multiple authoritative documents.

## Documentation Governance

Documentation is versioned independently of source code.

Each document includes:

- Document ID

- Version

- Status

- Owner

- Dependencies

- Revision History

Major architectural changes require:

1.  Updating the relevant architecture document.

2.  Recording a new ADR.

3.  Updating dependent specifications.

4.  Incrementing the document version.

## Review Process

Every document must pass four review stages.

## Review 1 — Concept Review

Verify consistency with:

- Vision

- Engineering Principles

## Review 2 — Architecture Review

Verify consistency with:

- Architecture

- Domain Model

- ADRs

## Review 3 — Implementation Review

Verify that:

- interfaces are complete

- requirements are testable

- no ambiguity remains

- Codex can implement directly from the specification

## Review 4 — Consistency Review

Verify:

- terminology

- cross references

- document dependencies

- version numbers

- revision history

Only after all four reviews is a document considered Approved.

## AI Coding Agent Rules

Every AI coding session should follow this sequence.

1.  Read this document.

2.  Read all prerequisite documents for the requested task.

3.  Identify the governing specification.

4.  Generate code only within the defined architectural boundaries.

5.  Never introduce undocumented architecture.

6.  If documentation conflicts, stop implementation and resolve the documentation first.

## Engineering Principles for the Engineering Kit

The Engineering Kit itself follows these principles:

- Single source of truth.

- Layered architecture.

- Stable terminology.

- Explicit ownership.

- Deterministic implementation guidance.

- Human-readable.

- AI-friendly.

- Version controlled.

- Reviewable.

- Maintainable.

The documentation is treated as a production asset and evolves under the same engineering discipline as the source code.

## Revision History

| **Version** | **Date**                        | **Summary**                                                                                   |
|-------------|---------------------------------|-----------------------------------------------------------------------------------------------|
| 2.0.0       | Initial Engineering Kit release | Established documentation hierarchy, governance, review process, and canonical reading order. |
