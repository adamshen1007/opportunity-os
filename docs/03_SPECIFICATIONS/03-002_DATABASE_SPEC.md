# 03-002_DATABASE_SPEC.md


**Document ID:** 03-002
**Version:** 3.0.0
**Status:** Approved (Specification)
**Layer:** 2 – Specification
**Owner:** Backend Architecture Team

# Database Specification

## Purpose

This document defines the canonical persistence model for Opportunity OS.

It specifies:

- relational schema

- entity ownership

- persistence rules

- indexing strategy

- migration principles

- data integrity constraints

The database implementation derives directly from the Domain Model.

# Scope

This specification governs:

- PostgreSQL schema

- table ownership

- relationships

- constraints

- indexes

- migration ordering

It does **not** define:

- business rules

- API contracts

- UI models

- event payloads

# Design Principles

The persistence layer follows these principles:

### Immutable Evidence

Raw Content

Canonical Content

Evidence Quotes

must never be modified after creation.

### Domain First

Tables exist because domain aggregates exist.

The database reflects the Domain Model.

The Domain Model does not reflect the database.

### Explainability

Every Opportunity must be traceable back to Raw Content.

### Deterministic Queries

Queries should avoid hidden business logic.

Business calculations belong in services.

# Database Technology

Primary database:

PostgreSQL

Optional extension:

pgvector

The platform must operate correctly without pgvector enabled.

# Logical Data Flow

Connector

│

▼

Raw Content

│

▼

Canonical Content

│

▼

Pain Points

│

▼

Clusters

│

▼

Trend Metrics

│

▼

Opportunities

Each stage produces immutable records consumed by downstream services.

# Aggregate Mapping

| **Aggregate**      | **Primary Table**  |
|--------------------|--------------------|
| Connector          | connectors         |
| Connector Run      | connector_runs     |
| Raw Content        | raw_contents       |
| Canonical Content  | canonical_contents |
| Pain Point         | pain_points        |
| Pain Point Cluster | problem_clusters   |
| Trend              | trend_metrics      |
| Opportunity        | opportunities      |

Each aggregate has a single primary table.

Supporting tables exist only where necessary for relationships or metadata.

# Connector Tables

## connectors

Stores connector metadata.

Fields include:

- id

- name

- display_name

- connector_type

- version

- platform

- status

- configuration

- capabilities

- created_at

- updated_at

## connector_runs

Stores execution history.

Fields include:

- connector_id

- run_id

- status

- trigger_type

- records_processed

- retries

- duration_ms

- started_at

- completed_at

- correlation_id

Connector Runs are immutable after completion.


# Content Tables

## raw_contents

Purpose:

Persist immutable connector payloads.

Required fields:

- id

- connector_id

- connector_run_id

- platform

- external_id

- source_type

- payload

- checksum

- collected_at

Rules:

- immutable

- unique per platform/external_id

- original payload preserved

## canonical_contents

Purpose:

Store normalized platform-independent content.

Required fields:

- id

- raw_content_id

- title

- content

- language

- country

- engagement_metrics

- metadata

- normalized_at

Rules:

- immutable

- exactly one originating Raw Content

# Intelligence Tables

## pain_points

Represents AI-extracted customer problems.

Each Pain Point references one Canonical Content record.

Stores:

- description

- severity

- urgency

- confidence

- provenance

## evidence_quotes

Stores verbatim supporting evidence.

Every quote references immutable Canonical Content.

## problem_clusters

Represents recurring customer problems.

Stores:

- summary

- category

- confidence

- aggregate metrics

## pain_point_cluster_memberships

Many-to-many relationship between Pain Points and Clusters.

Stores:

- similarity_score

- assignment_method

# Trend Tables

## trend_metrics

Stores time-series metrics.

Examples:

- mention count

- engagement

- growth rate

- velocity

- trend stage

Trend metrics are deterministic.

They may be recalculated without modifying historical evidence.


# Opportunity Tables

## opportunities

Represents validated business opportunities.

Stores:

- title

- summary

- problem description

- recommended ICP

- MVP hypothesis

- pricing hypothesis

- deterministic scores

- confidence

- provenance

## opportunity_clusters

Maps Opportunities to supporting Pain Point Clusters.

## competition_analyses

Stores structured competitive analysis.

Includes:

- competition score

- whitespace score

- identified competitors

- analysis summary

# AI Metadata

## ai_runs

Tracks AI workflow execution.

Stores:

- workflow type

- model provider

- model name

- prompt version

- execution cost

- duration

- status

## prompt_versions

Stores version metadata for prompts.

Prompt content remains in the Prompt Library.

# Persistence Rules

The following records are immutable:

- Raw Content

- Canonical Content

- Evidence Quotes

The following records may evolve:

- Problem Clusters

- Trend Metrics

- Opportunities

- Competition Analyses

Historical changes should be recorded through timestamps and version metadata rather than destructive updates.

# Indexing Strategy

Minimum indexes:

- primary keys

- foreign keys

- platform/external_id

- correlation_id

- created_at

- opportunity_score

- trend stage

- category

Additional indexes may be added based on production query patterns.

# Migration Strategy

Migration order:

1.  extensions

2.  connector tables

3.  content tables

4.  intelligence tables

5.  trend tables

6.  opportunity tables

7.  AI metadata

8.  views

9.  seed data

Every migration must be reversible where practical.

# Acceptance Criteria

The database implementation is complete when:

- all tables are created successfully

- referential integrity is enforced

- immutable entities cannot be modified through application services

- seed data supports end-to-end local development

- the schema operates without pgvector

- optional pgvector support can be enabled without redesign

# References

Depends on:

- 02-001_ARCHITECTURE.md

- 02-002_DOMAIN_MODEL.md

- 02-004_EVENT_MODEL_SPEC.md

Referenced by:

- 03-003_API_SPEC.md

- 03-004_AI_WORKFLOW_SPEC.md

- Backend implementation

- Database migrations

# Revision History

| **Version** | **Date**                        | **Summary**                                                                                                                                       |
|-------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| 2.0.0       | Initial Engineering Kit release | Defined the canonical persistence model, aggregate mapping, table responsibilities, migration strategy, and persistence rules for Opportunity OS. |
