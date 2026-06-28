# 02-004_EVENT_MODEL_SPEC.md


**Document ID:** 02-004
**Version:** 2.0.0
**Status:** Approved (Architecture)
**Layer:** 1 – Architecture
**Owner:** Architecture Team

# Event Model Specification

## Purpose

This document defines the canonical event architecture used throughout Opportunity OS.

It specifies:

- event taxonomy

- event envelope

- event lifecycle

- versioning strategy

- delivery guarantees

- correlation model

The event model is transport-independent.

Whether events are delivered using PostgreSQL, Kafka, NATS, or another system does not change the event contracts defined here.

# Scope

This specification governs:

- internal platform events

- event publication

- event consumption

- event versioning

- replay behavior

It does **not** define:

- REST APIs

- database schemas

- connector implementations

- AI prompts

# Event Philosophy

Events represent facts.

They describe something that has already happened.

Examples:

- RawContentPersisted

- CanonicalContentCreated

- PainPointExtracted

Events are:

- immutable

- append-only

- versioned

- replayable

Services react to events.

Events never instruct other services what to do.

# Event Taxonomy

The platform defines three categories of events.

## Operational Events

Describe platform behavior.

Examples:

- ConnectorStarted

- ConnectorCompleted

- HealthCheckFailed

- RetryScheduled

Operational events support monitoring and diagnostics.

## Domain Events

Describe business state changes.

Examples:

- RawContentPersisted

- CanonicalContentCreated

- PainPointExtracted

- OpportunityCreated

Domain events drive business workflows.

## Intelligence Events

Describe AI-generated outputs.

Examples:

- SummaryGenerated

- ClassificationCompleted

- ClusterNamed

- RecommendationGenerated

These events communicate semantic interpretation.

# High-Level Event Flow

ConnectorStarted

│

▼

RawContentPersisted

│

▼

CanonicalContentCreated

│

▼

PainPointExtracted

│

▼

ClusterUpdated

│

▼

TrendCalculated

│

▼

OpportunityCreated

│

▼

DashboardUpdated

Each event becomes an immutable part of the processing history.


# Standard Event Envelope

Every event shares a common structure.

Required fields include:

- event identifier

- event type

- event version

- event category

- producer

- occurred timestamp

- correlation identifier

- causation identifier

- payload

- metadata

The envelope remains stable across all event types.

Only the payload changes.

# Event Versioning

Every event includes a version.

Breaking changes require a new event version.

Older consumers must continue functioning until migration is complete.

Existing published events are never modified.

# Correlation Model

Every workflow receives a Correlation ID.

Example:

Connector Run

│

▼

Normalization

│

▼

Pain Point Extraction

│

▼

Cluster Update

│

▼

Opportunity Generation

Every event emitted during this workflow shares the same Correlation ID.

This enables complete end-to-end tracing.

# Event Ordering

Ordering is guaranteed only within a single workflow.

Consumers must not assume global ordering.

Services must tolerate:

- delayed delivery

- duplicate delivery

- replay

# Delivery Guarantees

Minimum guarantee:

At-least-once delivery.

Consumers are therefore required to be idempotent.

Duplicate event processing must not corrupt state.

# Replay

Events are replayable.

Replay is used for:

- recovery

- rebuilding projections

- testing

- auditing

Replay never modifies historical events.

New state is derived from historical facts.

# Event Ownership

Each bounded context owns its own events.

Data Acquisition Framework

- ConnectorStarted

- ConnectorCompleted

- RawContentPersisted

Intelligence Platform

- CanonicalContentCreated

- PainPointExtracted

- TrendCalculated

- OpportunityCreated

Application Platform

- DashboardUpdated

- ReportGenerated

- NotificationSent

No platform publishes events on behalf of another platform.


# Event Catalog

## Data Acquisition

- ConnectorRegistered

- ConnectorStarted

- ConnectorCompleted

- ConnectorFailed

- ConnectorRetryScheduled

- RawContentPersisted

- BatchImported

- WebhookReceived

## Intelligence

- CanonicalContentCreated

- CanonicalContentUpdated

- PainPointExtracted

- PainPointMerged

- ClusterCreated

- ClusterUpdated

- TrendCalculated

- OpportunityCreated

- OpportunityPublished

- CompetitionAnalysisCompleted

## Application

- DashboardUpdated

- ReportGenerated

- AlertTriggered

- UserPreferenceChanged

# Event Invariants

Every event:

- is immutable

- has a unique identifier

- belongs to one category

- has one producer

- includes one correlation identifier

- records its version

- contains sufficient context for downstream processing

Events must never contain secrets or credentials.

# Event Storage

The MVP stores events in PostgreSQL.

Future transports may include:

- Kafka

- NATS JetStream

- Redpanda

- EventStoreDB

Changing transport technology must not change the event contracts.

# Relationship to Other Documents

This document defines how services communicate.

It does not define:

- service internals

- database implementation

- API resources

- AI prompts

Those concerns belong to lower-level specifications.

# References

Depends on:

- 02-001_ARCHITECTURE.md

- 02-002_DOMAIN_MODEL.md

- 02-003_DATA_ACQUISITION_FRAMEWORK.md

- 01-002_ENGINEERING_PRINCIPLES.md

Referenced by:

- 03-002_DATABASE_SPEC.md

- 03-003_API_SPEC.md

- 03-004_AI_WORKFLOW_SPEC.md

- 03-006_SCORING_ENGINE_SPEC.md

# Revision History

| **Version** | **Date**                        | **Summary**                                                                                                                   |
|-------------|---------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| 2.0.0       | Initial Engineering Kit release | Established the canonical event model, taxonomy, event envelope, delivery guarantees, and replay strategy for Opportunity OS. |
