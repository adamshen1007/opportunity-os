# 00-001_DOCUMENTATION_INDEX.md


**Document ID:** 00-001
**Version:** 2.0.0
**Status:** Approved (Foundation)
**Layer:** 0 – Engineering Knowledge Base
**Owner:** Opportunity OS Architecture Team

## Opportunity OS Engineering Knowledge Base

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

├── 05_OPERATIONS/

└── adr/

.ai/

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

Read the .ai/ documentation relevant to the task before generating code.

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

before beginning development.

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
| AI Coding Guidance     | .ai/                          |

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
