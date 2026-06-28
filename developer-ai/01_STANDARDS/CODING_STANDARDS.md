# developer-ai/01_STANDARDS/CODING_STANDARDS.md


Version: 2.0.0

# Purpose

This document defines the engineering standards for all source code in Opportunity OS.

These standards apply to:

- Human engineers

- Codex

- AI coding agents

- Generated code

Violation of these standards is considered a defect.

# Primary Principles

Every implementation should be:

- Correct

- Readable

- Testable

- Observable

- Maintainable

- Deterministic

Performance optimizations are secondary.

# Service Design

Every service owns exactly one business capability.

Bad

OpportunityService

\- scoring

\- authentication

\- report generation

Good

ScoringService

AuthenticationService

ReportService

# Function Design

Functions should:

- perform one logical operation

- have descriptive names

- minimize side effects

- avoid hidden state

Prefer:

calculateOpportunityScore()

Avoid:

processData()

# Dependency Rules

Dependencies must always point toward lower architectural layers.

Application

↓

Intelligence

↓

Acquisition

Never create reverse dependencies.

# Immutability

Treat the following as immutable:

- Raw Content

- Canonical Content

- Event Payloads

- Evidence Quotes

Mutations require creation of new domain objects rather than modification of existing evidence.

# AI Integration

Never:

- call an LLM directly from business services

- embed prompts in source code

- couple workflows to providers

Always use the AI Workflow Orchestrator.

# Documentation

Public modules must include:

- purpose

- responsibilities

- dependencies

Complex algorithms require inline rationale, not just implementation comments.

# Definition of Complete

Code is complete only when:

- implemented

- tested

- documented

- observable

- reviewed

- aligned with architecture
