# 02-002_DOMAIN_MODEL.md


**Document ID:** 02-002
**Version:** 3.0.0
**Status:** Approved (Architecture)
**Layer:** 1 – Architecture
**Owner:** Architecture Team

# Opportunity OS Domain Model

## Purpose

This document defines the conceptual business model for Opportunity OS.

It specifies:

- business entities

- aggregates

- ownership

- relationships

- lifecycle rules

- invariants

The Domain Model is independent of:

- database implementation

- APIs

- UI

- AI providers

- infrastructure

It represents the canonical business language of the platform.

# Domain Objectives

The Domain Model is designed to:

- represent customer knowledge consistently

- isolate platform-specific data

- support deterministic business logic

- preserve evidence traceability

- enable explainable recommendations

# Bounded Contexts

Opportunity OS consists of three bounded contexts.

Data Acquisition

│

▼

Intelligence

│

▼

Application

Each context owns its own entities.

Cross-context communication occurs through immutable events.

# Aggregate Overview

The platform contains six primary aggregates.

Connector

│

▼

RawContent

│

▼

CanonicalContent

│

▼

PainPointCluster

│

▼

Opportunity

│

▼

Report

Each aggregate has exactly one Aggregate Root.

# Aggregate: Connector

## Purpose

Represents an external acquisition capability.

Connector owns:

- metadata

- configuration

- capabilities

- execution history

Connector does not own:

- Raw Content

- AI results

- business intelligence

## Lifecycle

Registered

│

Configured

│

Healthy

│

Running

│

Completed

## Invariants

A Connector:

- exposes capabilities

- is versioned

- is independently deployable

- never performs AI analysis

# Aggregate: Raw Content

## Purpose

Represents immutable information acquired from an external source.

Examples:

- Reddit post

- Xiaohongshu note

- Douyin comment

- App review

- GitHub issue

## Ownership

Owned by:

Data Acquisition Framework

Consumed by:

Normalization Service

## Lifecycle

Collected

│

Persisted

│

Published

## Invariants

Raw Content:

- is immutable

- preserves original payload

- retains provenance

- is never modified


# Aggregate: Canonical Content

## Purpose

Represents normalized, platform-independent customer information.

Canonical Content is the foundation for all business analysis.

## Ownership

Owned by:

Intelligence Platform

## Created From

Exactly one Raw Content object.

## Consumed By

- AI Analysis Platform

- Trend Engine

- Opportunity Engine

## Invariants

Canonical Content:

- is immutable

- has one originating Raw Content

- is platform-independent

- contains normalized metadata

# Aggregate: Pain Point Cluster

## Purpose

Represents a recurring customer problem.

The aggregate contains:

- cluster summary

- member Pain Points

- supporting evidence

- trend metrics

## Aggregate Root

PainPointCluster

Child entities:

- PainPoint

- EvidenceQuote

- TrendMetric

## Lifecycle

Created

│

Expanded

│

Merged

│

Archived

## Invariants

Every Pain Point:

- belongs to one cluster

Every Evidence Quote:

- references immutable Canonical Content

Trend Metrics:

- are deterministic

# Aggregate: Opportunity

## Purpose

Represents a validated business opportunity.

Opportunity owns:

- recommendation

- scores

- hypotheses

- supporting clusters

## Aggregate Root

Opportunity

Child entities:

- OpportunityCluster

- CompetitionAnalysis

## Lifecycle

Draft

│

Validated

│

Published

│

Archived

## Invariants

Every Opportunity:

- references at least one Pain Point Cluster

- contains evidence

- has deterministic scores

- records provenance

- is explainable


# Aggregate Relationships

Connector

│

▼

RawContent

│ 1:1

▼

CanonicalContent

│ 1:N

▼

PainPoint

│ N:1

▼

PainPointCluster

│ N:M

▼

Opportunity

The relationship chain is intentionally one-directional.

Business logic must never bypass intermediate aggregates.

# Domain Invariants

The following rules always hold.

## Evidence Traceability

Every Opportunity can be traced back to:

Opportunity

↓

Pain Point Cluster

↓

Pain Point

↓

Canonical Content

↓

Raw Content

## Platform Independence

Business entities never reference platform-specific schemas.

## Immutability

Raw Content

Canonical Content

Evidence Quotes

are immutable.

## Determinism

The following are deterministic:

- scoring

- ranking

- trend calculation

## AI Responsibility

AI may:

- interpret

- summarize

- classify

- hypothesize

AI may not:

- calculate deterministic scores

- mutate source evidence

- alter provenance

# Domain Events

Each aggregate publishes events.

Connector

- ConnectorRegistered

- ConnectorCompleted

Raw Content

- RawContentPersisted

Canonical Content

- CanonicalContentCreated

Pain Point Cluster

- PainPointExtracted

- ClusterUpdated

Opportunity

- OpportunityCreated

- OpportunityPublished

# Relationship to Other Documents

This document defines **what** the business entities are.

It does not define:

- database tables

- REST resources

- event payloads

- AI prompts

- UI presentation

Those are specified in lower architectural and specification documents.

# References

Depends on:

- 02-001_ARCHITECTURE.md

- 01-003_GLOSSARY.md

Referenced by:

- DATABASE_SPEC.md

- API_SPEC.md

- EVENT_MODEL_SPEC.md

- AI_WORKFLOW_SPEC.md

- SCORING_ENGINE_SPEC.md

# Revision History

| **Version** | **Date**                        | **Summary**                                                                                                                 |
|-------------|---------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| 2.0.0       | Initial Engineering Kit release | Established the canonical business aggregates, ownership boundaries, relationships, and lifecycle rules for Opportunity OS. |
