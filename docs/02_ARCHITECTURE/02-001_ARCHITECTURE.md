# 02-001_ARCHITECTURE.md


**Document ID:** 02-001
**Version:** 3.0.0
**Status:** Approved (Architecture)
**Layer:** 1 – Architecture
**Owner:** Architecture Team

# Opportunity OS Architecture

## Purpose

This document defines the logical architecture of Opportunity OS.

It specifies:

- platform boundaries

- major components

- service responsibilities

- communication patterns

- architectural constraints

It intentionally avoids implementation details such as database schemas, APIs, or framework-specific code.

# Scope

This document governs:

- system decomposition

- service ownership

- data flow

- platform interactions

- architectural dependencies

It does **not** define:

- database tables

- REST endpoints

- prompts

- scoring algorithms

- user interface implementation

These are specified in lower-level documents.

# Architectural Objectives

The architecture is designed to satisfy the following objectives:

1.  Platform independence

2.  Clear separation of responsibilities

3.  Event-driven scalability

4.  AI provider independence

5.  Explainability

6.  Extensibility

7.  Testability

8.  Deterministic business logic

# Architectural Principles

The architecture is derived directly from the Engineering Principles.

Key principles include:

- Single Responsibility

- Event-Driven Collaboration

- Canonical Domain Model

- Immutable Evidence

- Contracts Before Implementations

- Deterministic Business Logic

# High-Level Architecture

## Engineering Kit v3.0 Implementation State

The logical architecture remains organized around the Data Acquisition Framework, Intelligence Platform, and Application Platform. Engineering Kit v3.0 records that the repository has completed platform foundation work through Phase 2 Milestone 14.

Implemented package architecture:

- `packages/config` for runtime configuration
- `packages/types`, `packages/errors`, `packages/utils`, and `packages/shared` for shared foundations
- `packages/events` for event contracts
- `packages/database` for database foundation contracts and Prisma setup
- `packages/domain` for generic domain contracts
- `packages/application` for application-layer contracts
- `packages/container` for dependency injection and composition contracts
- `packages/infrastructure` for infrastructure composition contracts
- `packages/connectors` for generic Connector SDK contracts
- `packages/connector-runtime` for generic connector runtime contracts
- `packages/connector-host` for connector host contracts
- `packages/connectors-reddit` for Reddit connector contracts and deterministic non-network Reddit runtime

Not yet implemented:

- live Reddit provider transport
- Raw Content persistence workflows
- normalization pipeline
- AI analysis pipeline
- opportunity engine
- REST API
- dashboard/frontend
- scheduler or worker process
- product business logic

Phase 2 Milestone 15 is the next transition point. It may add Reddit provider transport architecture only; it must not add Raw Content persistence, AI workflows, opportunity generation, APIs, frontend, schedulers, workers, or business logic.

Opportunity OS is composed of three logical platforms.

Opportunity OS

┌──────────────────────────────────────────────┐

│ Application Platform │

│----------------------------------------------│

│ Dashboard │

│ REST API │

│ Reporting │

│ Authentication │

└──────────────────────────────────────────────┘

▲

│

Domain Events / Queries

│

┌──────────────────────────────────────────────┐

│ Intelligence Platform │

│----------------------------------------------│

│ Normalization Service │

│ AI Analysis Platform │

│ Trend Engine │

│ Opportunity Engine │

│ Scoring Engine │

└──────────────────────────────────────────────┘

▲

│

Raw Content Events

│

┌──────────────────────────────────────────────┐

│ Data Acquisition Framework │

│----------------------------------------------│

│ Connector Registry │

│ Connector Runner │

│ Pull Connectors │

│ Push Connectors │

│ Import Connectors │

└──────────────────────────────────────────────┘

The architecture is intentionally layered.

Higher layers depend only on lower-layer contracts, never on internal implementations.

# Platform Responsibilities

## Data Acquisition Framework

Purpose:

Acquire information from external sources.

Responsibilities:

- connector registration

- connector execution

- scheduling

- authentication

- retries

- raw content persistence

- event publication

The framework never performs:

- AI analysis

- normalization

- scoring

- clustering

- recommendation generation

## Intelligence Platform

Purpose:

Transform acquired information into structured intelligence.

Responsibilities:

- normalization

- canonical content generation

- pain point extraction

- semantic clustering

- trend analysis

- opportunity generation

- deterministic scoring

The Intelligence Platform owns the core business logic of Opportunity OS.

## Application Platform

Purpose:

Expose platform capabilities to users and external systems.

Responsibilities:

- REST API

- dashboard

- reporting

- authentication

- authorization

- administration

The Application Platform does not implement business logic.

It orchestrates user interactions with the Intelligence Platform.

# Primary Data Flow

The primary processing pipeline follows a one-way flow.

External Sources

│

▼

Data Acquisition Framework

│

▼

Raw Content

│

▼

Normalization Service

│

▼

Canonical Content

│

▼

AI Analysis Platform

│

▼

Pain Points

│

▼

Problem Clusters

│

▼

Trend Engine

│

▼

Opportunity Engine

│

▼

Application Platform

│

▼

Users

Each stage consumes well-defined inputs and produces explicit outputs.

No stage bypasses another.


# Communication Model

## Internal Communication

Internal platform components communicate using immutable domain events whenever asynchronous processing is appropriate.

Examples:

- RawContentPersisted

- CanonicalContentCreated

- PainPointExtracted

- OpportunityCreated

This minimizes coupling between services and allows workflows to be replayed.

## External Communication

External consumers interact only through the Application Platform.

Supported interfaces include:

- REST API

- Dashboard

- Future SDKs

External systems never access internal services directly.

# Canonical Data Flow

Platform-specific data enters the system only once.

Platform Payload

│

▼

Raw Content

│

▼

Canonical Content

│

▼

Domain Objects

Business logic always consumes Canonical Content.

Platform-specific payloads remain isolated inside the Data Acquisition Framework.

# Core Architectural Components

## Connector Registry

Discovers and registers available connectors.

## Connector Runner

Executes connectors and manages retries.

## Raw Content Store

Stores immutable connector payloads.

## Normalization Service

Transforms Raw Content into Canonical Content.

Normalization is deterministic.

## AI Analysis Platform

Responsible for semantic interpretation.

Examples:

- Pain Point extraction

- summarization

- classification

- hypothesis generation

## Trend Engine

Calculates measurable changes in customer problems over time.

## Opportunity Engine

Transforms validated problem clusters into Opportunity objects.

## Scoring Engine

Calculates deterministic scores used for ranking and prioritization.

## Dashboard

Provides user-facing exploration and decision support.

# Dependency Rules

Dependencies must follow this direction only:

Application Platform

│

▼

Intelligence Platform

│

▼

Data Acquisition Framework

Reverse dependencies are prohibited.

The Data Acquisition Framework must never depend on Intelligence or Application components.

# Architectural Constraints

The following constraints are mandatory:

- Raw Content is immutable.

- Canonical Content is immutable.

- Business logic consumes only Canonical Content.

- AI-generated interpretations never modify source evidence.

- Opportunity Scores are deterministic.

- Connectors never execute AI logic.

- Services communicate through documented contracts.

- Platform boundaries must remain explicit.

Violation of these constraints requires a new Architecture Decision Record (ADR).

# References

Depends on:

- 01-001_VISION.md

- 01-002_ENGINEERING_PRINCIPLES.md

- 01-003_GLOSSARY.md

Referenced by:

- 02-002_DOMAIN_MODEL.md

- 02-003_DATA_ACQUISITION_FRAMEWORK.md

- 02-004_EVENT_MODEL_SPEC.md

- All specification documents

# Revision History

| **Version** | **Date**                        | **Summary**                                                                                                            |
|-------------|---------------------------------|------------------------------------------------------------------------------------------------------------------------|
| 2.0.0       | Initial Engineering Kit release | Defined the three-platform architecture, service responsibilities, communication model, and architectural constraints. |
