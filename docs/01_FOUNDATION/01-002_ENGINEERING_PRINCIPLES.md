# 01-002_ENGINEERING_PRINCIPLES.md


**Document ID:** 01-002
**Version:** 2.0.0
**Status:** Approved (Foundation)
**Layer:** 0 – Foundation
**Owner:** Architecture Team

# Engineering Principles

## Purpose

This document defines the engineering principles that govern the design, implementation, and evolution of Opportunity OS.

These principles apply to:

- Human engineers

- AI coding agents

- Architecture decisions

- Code reviews

- Future platform evolution

If implementation convenience conflicts with these principles, these principles take precedence.

# Scope

These principles govern:

- software architecture

- service boundaries

- domain modeling

- data management

- AI integration

- implementation quality

They do **not** define:

- product requirements

- APIs

- database schema

- UI behavior

Those are covered by lower-level specifications.

# Principle 1 — Single Responsibility

Every module owns one business capability.

Examples:

Connector Runner

- execute acquisition

- retry

- publish events

Not:

- normalize data

- call LLMs

- calculate scores

Opportunity Engine

- deterministic scoring

- ranking

- recommendation assembly

Not:

- connector execution

- prompt execution

- UI rendering

Responsibilities must remain explicit and isolated.

# Principle 2 — Separation of Platforms

Opportunity OS consists of three logical platforms.

Acquisition Platform

Responsible for acquiring raw information.

Intelligence Platform

Responsible for transforming information into intelligence.

Application Platform

Responsible for exposing capabilities to users.

A platform must not directly implement another platform's responsibilities.

# Principle 3 — Canonical Domain Model

Every downstream service consumes Canonical Content.

Platform-specific payloads remain isolated inside the Data Acquisition Framework.

Business logic must never depend on Reddit, Xiaohongshu, Douyin, or any other platform schema.

The domain model is platform-independent.

# Principle 4 — Event-Driven Collaboration

Internal services communicate using immutable events.

Services should avoid direct synchronous dependencies whenever practical.

Events describe facts that have occurred.

Events never represent commands.

Every long-running workflow must be resumable through event replay.

# Principle 5 — Deterministic Business Logic

Artificial intelligence performs interpretation.

Business logic performs calculation.

Examples:

AI

- pain point extraction

- summarization

- cluster naming

Business Logic

- scoring

- ranking

- prioritization

- recommendation assembly

Business outcomes must remain reproducible.

# Principle 6 — AI Provider Independence

Language models are replaceable infrastructure.

Business logic must never depend on a specific AI provider.

Every AI interaction passes through the AI Analysis Platform.

Changing providers must not require changes to domain logic.

# Principle 7 — Explainability

Every recommendation must be explainable.

Users must be able to inspect:

- supporting evidence

- contributing clusters

- scoring breakdown

- confidence

- provenance

Opaque recommendations are unacceptable.

# Principle 8 — Immutable Evidence

Raw customer evidence is immutable.

Canonical Content is immutable.

AI interpretations may evolve.

Original evidence never changes.

Every higher-level object must remain traceable to immutable source material.


## Principle 9 — Version Everything

The following artifacts are versioned:

- prompts

- schemas

- APIs

- scoring formulas

- events

- migrations

- AI workflows

Every AI-generated artifact records:

- model

- provider

- prompt version

- timestamp

Versioning enables reproducibility.

## Principle 10 — Contracts Before Implementations

Services communicate through explicit contracts.

Examples:

- Event contracts

- API contracts

- Canonical models

- Shared interfaces

No service may depend on another service's internal implementation.

## Principle 11 — Idempotent Processing

Long-running workflows must be safe to execute multiple times.

Examples:

Connector execution

Normalization

Pain point extraction

Opportunity generation

Repeated execution must not corrupt state or create duplicate business objects.

## Principle 12 — Observability by Default

Every service exposes:

- health

- metrics

- logs

- tracing

Every workflow records:

- correlation ID

- execution time

- retry count

- status

- failures

The platform should be diagnosable without reproducing production issues.

## Principle 13 — Security by Design

Secrets are external.

Credentials never exist in source code.

Every connector uses a dedicated authentication strategy.

Sensitive information is excluded from logs and events.

Least privilege is the default.

## Principle 14 — Testability

Business logic must be independently testable.

Preferred testing pyramid:

Unit Tests

↓

Contract Tests

↓

Integration Tests

↓

End-to-End Tests

Every connector and every event contract must include automated contract tests.

## Principle 15 — Extensibility

New functionality should be added by extension rather than modification.

Examples:

Adding a connector

Implement SDK

↓

Register

↓

Configure

↓

Deploy

No downstream services require modification.

This principle applies equally to AI providers, scoring algorithms, and presentation layers.

## Principle 16 — Cost Awareness

Use deterministic software whenever semantic reasoning is unnecessary.

Do not invoke language models for:

- sorting

- aggregation

- arithmetic

- filtering

- validation

- persistence

Use AI only where semantic interpretation creates measurable value.

## Principle 17 — Human Oversight

Opportunity OS assists decision making.

It does not replace it.

Users must always retain the ability to:

- inspect

- override

- review

- validate

AI outputs remain recommendations.

Human judgment remains authoritative.


# Engineering Quality Standards

Every implementation should satisfy the following characteristics.

## Correct

Implements documented requirements.

## Explainable

Produces understandable outputs.

## Observable

Can be monitored in production.

## Testable

Can be validated automatically.

## Replaceable

Individual components may evolve independently.

## Maintainable

Future engineers should understand the implementation without reverse engineering hidden assumptions.

## Scalable

Architecture supports incremental growth without redesign.

# Decision Framework

When multiple implementation approaches exist, prioritize them in this order:

1.  Correctness

2.  Simplicity

3.  Maintainability

4.  Extensibility

5.  Performance

6.  Developer convenience

Performance optimizations must never compromise architectural correctness.

# Definition of Engineering Success

Opportunity OS is considered well-engineered when:

- every architectural decision is traceable to documented principles;

- every service owns a single business capability;

- every recommendation is explainable;

- every workflow is reproducible;

- every component can evolve independently;

- every implementation can be regenerated from the Engineering Kit.

The documentation—not tribal knowledge—should define how the platform is built.

# References

Depends on:

- 00-001_DOCUMENTATION_INDEX.md

- 01-001_VISION.md

Referenced by:

- All Architecture documents

- All Specification documents

- AI Engineering OS

# Revision History

| **Version** | **Date**                        | **Summary**                                                                            |
|-------------|---------------------------------|----------------------------------------------------------------------------------------|
| 2.0.0       | Initial Engineering Kit release | Established the architectural laws and engineering standards governing Opportunity OS. |
