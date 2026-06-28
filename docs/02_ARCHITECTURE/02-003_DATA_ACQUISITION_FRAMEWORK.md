# 02-003_DATA_ACQUISITION_FRAMEWORK.md


**Document ID:** 02-003
**Version:** 2.0.0
**Status:** Approved (Architecture)
**Layer:** 1 – Architecture
**Owner:** Architecture Team

# Data Acquisition Framework

## Purpose

The Data Acquisition Framework (DAF) is the standardized platform responsible for acquiring information from external sources and delivering immutable Raw Content into Opportunity OS.

The framework is domain-independent.

It does not understand:

- Pain Points

- Opportunities

- Trends

- Scores

- AI workflows

Its responsibility ends after Raw Content has been successfully persisted and acquisition events have been published.

# Scope

The framework governs:

- connector discovery

- connector execution

- authentication

- scheduling

- retries

- rate limiting

- raw content persistence

- event publication

- execution observability

It does **not** perform:

- normalization

- semantic analysis

- embeddings

- clustering

- opportunity generation

- deterministic scoring

# Design Goals

The framework is designed to be:

- reusable

- extensible

- provider-independent

- observable

- idempotent

- fault-tolerant

The same framework should support future products beyond Opportunity OS.

# High-Level Architecture

Connector Registry

│

▼

Connector Runner

│

┌────────────────────┼────────────────────┐

▼ ▼ ▼

Pull Connector Push Connector Import Connector

│ │ │

└────────────────────┼────────────────────┘

▼

Raw Content Store

▼

Event Publisher

▼

Intelligence Platform

The framework owns acquisition only.

The Intelligence Platform owns interpretation.

# Framework Components

## Connector Registry

Responsibilities:

- register connectors

- validate metadata

- expose capabilities

- resolve implementations

The Registry never executes connectors.

## Connector Runner

Responsibilities:

- instantiate connectors

- authenticate

- execute acquisition

- persist Raw Content

- publish events

- collect metrics

- retry failures

The Runner never performs AI analysis or normalization.

## Authentication Manager

Responsible for:

- credential retrieval

- token refresh

- secret management

- authentication strategy selection

Authentication is independent of connector implementations.

## Scheduler

Supports:

- manual execution

- scheduled polling

- queue-based execution

- future streaming triggers

Scheduling policies are external to connectors.

## Event Publisher

Publishes acquisition events after successful persistence.

Events are immutable and versioned.

# Connector Categories

The framework supports three connector categories.

## Pull Connector

Actively retrieves information.

Examples:

- Reddit search

- Xiaohongshu search

- Douyin search

- GitHub search

Trigger sources:

- scheduler

- manual execution

- API request

## Push Connector

Receives externally generated events.

Examples:

- webhooks

- Slack events

- GitHub webhooks

- RSS notifications

Trigger source:

- external systems

## Import Connector

Processes user-provided datasets.

Examples:

- CSV

- JSON

- database export

- interview transcripts

- support ticket exports

Trigger source:

- user upload

- administrative import

All connector categories produce the same Raw Content contract.


# Connector Lifecycle

Every connector follows the same lifecycle.

Registered

│

Configured

│

Authenticated

│

Running

│

Persisted

│

Events Published

│

Completed

Failure transitions:

Running

│

Failed

│

Retry Scheduled

│

Running

Permanent failures terminate the execution and record diagnostic information.

# Connector Contract

Every connector implements a common interface.

Required capabilities include:

- metadata

- capability declaration

- health check

- acquisition entry point

Connector-specific behavior remains encapsulated behind the contract.

The framework never depends on connector implementation details.

# Raw Content Contract

Every connector produces immutable Raw Content.

Required fields include:

- connector identifier

- connector run identifier

- external identifier

- acquisition timestamp

- source platform

- source type

- original payload

- checksum

- provenance metadata

The framework stores Raw Content exactly as received.

# Event Publication

Successful executions publish acquisition events.

Examples:

- ConnectorStarted

- ConnectorCompleted

- RawContentPersisted

- BatchImported

- WebhookReceived

Events are immutable.

Events are append-only.

Every event includes:

- version

- timestamp

- correlation identifier

- producer

- payload

# Scheduling

Supported execution modes:

- manual

- scheduled

- queue-triggered

- webhook-triggered

Scheduling decisions remain external to connector implementations.

# Retry Strategy

Retry applies only to transient failures.

Examples:

Retry:

- temporary network failure

- rate limit

- transient service unavailable

Do not retry:

- invalid configuration

- authentication failure

- malformed request

Retry policies are configurable per connector.


# Observability

Every connector execution records:

- connector identifier

- connector version

- execution duration

- retry count

- records processed

- success count

- failure count

- authentication strategy

- correlation identifier

Every execution produces:

- structured logs

- metrics

- traces

- execution status

Observability is mandatory for all connector implementations.

# Framework Invariants

The following rules always apply.

## Separation of Responsibility

Connectors acquire data.

Only the Intelligence Platform performs semantic interpretation.

## Immutability

Raw Content is immutable after persistence.

Original payloads are preserved for traceability.

## Platform Independence

Business logic never consumes connector-specific payloads.

Only Canonical Content enters the Intelligence Platform.

## Idempotency

Repeated connector execution must not create duplicate business objects.

Deduplication occurs before downstream processing.

## Extensibility

New connectors are added by implementing the connector contract and registering with the Connector Registry.

Existing platform components should not require modification.

# Testing Requirements

Every connector must provide:

- unit tests

- contract tests

- integration tests

- fixture data

- health check validation

Every connector implementation must pass the common connector contract test suite before release.

# MVP Scope

The MVP includes:

- Connector Registry

- Connector Runner

- Authentication Manager

- Scheduler

- Event Publisher

- Mock Connector

- Reddit Connector (demo implementation)

- CSV Import Connector

- JSON Import Connector

Push connector infrastructure is defined but production implementations are deferred.

# Relationship to Other Documents

This document defines the architecture of the Data Acquisition Framework.

It does not define:

- connector-specific implementation details

- database schema

- event payload structure

- AI workflows

Those responsibilities belong to lower-level specifications.

# References

Depends on:

- 02-001_ARCHITECTURE.md

- 02-002_DOMAIN_MODEL.md

- 01-002_ENGINEERING_PRINCIPLES.md

Referenced by:

- 02-004_EVENT_MODEL_SPEC.md

- 03-002_DATABASE_SPEC.md

- 03-003_API_SPEC.md

- 03-004_AI_WORKFLOW_SPEC.md

# Revision History

| **Version** | **Date**                        | **Summary**                                                                                                                          |
|-------------|---------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| 2.0.0       | Initial Engineering Kit release | Defined the reusable Data Acquisition Framework, connector architecture, execution lifecycle, contracts, and operational invariants. |
