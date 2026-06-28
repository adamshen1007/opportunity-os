# 03-004_AI_WORKFLOW_SPEC.md


**Document ID:** 03-004
**Version:** 2.0.0
**Status:** Approved (Specification)
**Layer:** 2 – Specification
**Owner:** Intelligence Platform Team

# AI Workflow Specification

## Purpose

This document defines the AI workflows used throughout Opportunity OS.

It specifies:

- workflow architecture

- execution lifecycle

- workflow contracts

- prompt management

- structured outputs

- validation

- provenance

- orchestration

AI workflows transform Canonical Content into business intelligence.

# Scope

This specification governs:

- LLM orchestration

- prompt execution

- structured output

- validation

- retries

- provenance

- workflow versioning

It does **not** define:

- prompt content

- scoring algorithms

- database schema

- REST APIs

# Design Principles

Every AI workflow must be:

- deterministic where possible

- reproducible

- observable

- provider-independent

- versioned

- testable

- explainable

Business decisions remain outside AI workflows.

# AI Platform Architecture

Canonical Content

│

▼

Workflow Orchestrator

│

▼

Prompt Resolver

│

▼

LLM Provider Adapter

│

▼

Output Validator

│

▼

Post Processor

│

▼

Event Publisher

Each stage owns one responsibility.

# Workflow Lifecycle

Every workflow follows the same lifecycle.

Queued

│

Running

│

LLM Response

│

Validated

│

Post Processed

│

Persisted

│

Event Published

Failure paths:

Validation Failed

│

Retry

│

Failed

Every execution records provenance.


# Standard Workflow Contract

Every AI workflow defines:

### Input

- workflow identifier

- workflow version

- Canonical Content reference(s)

- execution context

- configuration

### Prompt

Resolved through the Prompt Library.

Prompt selection is based on:

- workflow type

- version

- language

- provider capabilities

Prompt text is never hard-coded in business services.

### Model

Resolved dynamically through the provider abstraction.

Supported providers include:

- OpenAI

- Anthropic

- Google

- DeepSeek

- Local models

No workflow depends on a specific provider.

### Output

Every workflow produces structured JSON.

Free-form responses are prohibited.

Output schemas are versioned and validated before persistence.

### Validation

Validation includes:

- schema validation

- required fields

- enum validation

- confidence thresholds

- business rule validation

Invalid outputs never enter downstream processing.

### Provenance

Every execution records:

- provider

- model

- model version

- prompt version

- workflow version

- execution timestamp

- latency

- token usage

- estimated cost

This enables reproducibility and auditing.

# Core AI Workflows

The MVP includes the following workflows.

## WF-001 — Pain Point Extraction

Input:

Canonical Content

Output:

One or more structured Pain Points.

Publishes:

PainPointExtracted

## WF-002 — Cluster Naming

Input:

Pain Point Cluster

Output:

Human-readable cluster title and summary.

Publishes:

ClusterUpdated

## WF-003 — Opportunity Hypothesis

Input:

Validated Problem Cluster

Output:

Opportunity hypothesis.

Publishes:

OpportunityCreated

## WF-004 — Competition Analysis

Input:

Opportunity

Output:

Structured competitive landscape.

Publishes:

CompetitionAnalysisCompleted

## WF-005 — Report Summary

Input:

Opportunity Set

Output:

Executive summary.

Publishes:

ReportGenerated


# Retry Strategy

Retries are allowed only for transient failures.

Examples:

- provider timeout

- rate limiting

- temporary service unavailable

Retries are **not** performed for:

- invalid schema

- malformed prompt configuration

- deterministic validation failures

Retry limits are configurable per workflow.

# Post Processing

AI outputs may undergo deterministic post-processing.

Examples:

- confidence normalization

- duplicate removal

- field enrichment

- reference resolution

- metadata attachment

Business scoring is not performed during post-processing.

# Workflow Versioning

Every workflow has an independent semantic version.

Version changes may result from:

- prompt updates

- schema updates

- validation rule changes

- orchestration changes

Historical executions retain the workflow version used at execution time.

# Acceptance Criteria

An AI workflow is considered complete when:

- inputs are explicitly defined

- prompt resolution is externalized

- outputs conform to a versioned schema

- validation is automated

- provenance is recorded

- events are published

- integration tests pass using mock providers

- provider changes require no business logic changes

# Relationship to Other Documents

This document defines the orchestration of AI processing.

Prompt content is defined in:

- 03-005_PROMPT_LIBRARY_SPEC.md

Business scoring is defined in:

- 03-006_SCORING_ENGINE_SPEC.md

# References

Depends on:

- 02-001_ARCHITECTURE.md

- 02-002_DOMAIN_MODEL.md

- 02-004_EVENT_MODEL_SPEC.md

- 03-003_API_SPEC.md

Referenced by:

- Prompt Library

- Scoring Engine

- Frontend Specification

- AI implementation

# Revision History

| **Version** | **Date**                        | **Summary**                                                                                                                             |
|-------------|---------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| 2.0.0       | Initial Engineering Kit release | Defined the architecture, lifecycle, contracts, validation, provenance, and orchestration model for all AI workflows in Opportunity OS. |
