# 03-005_PROMPT_LIBRARY_SPEC.md


**Document ID:** 03-005
**Version:** 3.0.0
**Status:** Approved (Specification)
**Layer:** 2 – Specification
**Owner:** Intelligence Platform Team

# Prompt Library Specification

## Purpose

This document defines the Prompt Library architecture used by Opportunity OS.

It specifies:

- prompt organization

- prompt lifecycle

- versioning

- template structure

- variable substitution

- output schema linkage

- governance

Prompts are treated as first-class engineering artifacts.

# Scope

This specification governs:

- prompt storage

- prompt metadata

- template syntax

- prompt execution contracts

- prompt testing

- prompt versioning

It does **not** define:

- workflow orchestration

- AI provider implementation

- business scoring

- database schema

# Design Principles

Every prompt must be:

- versioned

- reusable

- provider-independent

- deterministic where possible

- testable

- documented

- reviewable

Prompt text must never be embedded directly in application services.

# Prompt Architecture

AI Workflow

│

▼

Prompt Resolver

│

▼

Prompt Library

│

▼

Prompt Template

│

▼

Variable Resolution

│

▼

LLM Provider

The Prompt Library is the single source of truth for all prompt content.

# Prompt Categories

The MVP defines five prompt categories.

## Extraction

Purpose:

Extract structured information from Canonical Content.

Examples:

- Pain Point Extraction

- Feature Request Extraction

- Complaint Extraction

## Classification

Purpose:

Assign categories or labels.

Examples:

- Market Classification

- Industry Classification

- User Segment Classification

## Summarization

Purpose:

Produce concise summaries.

Examples:

- Cluster Summary

- Opportunity Summary

- Executive Report Summary

## Generation

Purpose:

Generate structured business hypotheses.

Examples:

- Opportunity Hypothesis

- MVP Recommendation

- Pricing Hypothesis

- Go-to-Market Suggestion

## Analysis

Purpose:

Evaluate or compare information.

Examples:

- Competition Analysis

- Trend Analysis

- Market Attractiveness Assessment


# Prompt Structure

Every prompt consists of four logical sections.

### System Instructions

Defines the role, constraints, and expected behavior of the model.

### Context

Provides domain-specific information.

Examples:

- Canonical Content

- Cluster summaries

- Evidence

- Historical metrics

### Task Instructions

Defines the work to perform.

The task must be explicit and deterministic.

### Output Contract

Specifies the required JSON schema.

Natural-language responses are not accepted unless explicitly required.

# Prompt Metadata

Each prompt records:

- prompt identifier

- prompt name

- category

- semantic version

- owner

- status

- supported providers

- supported models

- linked workflow

- linked output schema

- creation date

- last modified date

# Variable Resolution

Prompts use named variables.

Example variables:

- {{canonical_content}}

- {{cluster_summary}}

- {{evidence_quotes}}

- {{market_name}}

- {{language}}

Variables are resolved by the Prompt Resolver before provider invocation.

Prompt templates never query databases directly.

# Output Schema

Every prompt references a versioned output schema.

Schemas define:

- required fields

- optional fields

- enumerations

- validation rules

Schema validation occurs before downstream processing.

# Provider Compatibility

The Prompt Library remains provider-independent.

Provider-specific formatting is handled by adapters.

Prompt authors should avoid provider-specific syntax whenever possible.

# Prompt Versioning

Prompts follow semantic versioning.

Major version:

Breaking behavioral change.

Minor version:

Improved instructions without changing output schema.

Patch version:

Editorial improvements that do not affect behavior.

Historical executions retain the prompt version used at execution time.


# Prompt Testing

Every prompt requires automated tests.

Test categories:

- schema validation

- deterministic fixtures

- edge cases

- multilingual inputs

- malformed inputs

Prompt updates should be evaluated against regression datasets before release.

# Prompt Governance

Every prompt change requires:

1.  version increment

2.  review

3.  regression testing

4.  documentation update

Prompt modifications should be traceable through version history.

# Prompt Repository Structure

Recommended repository layout:

prompts/

│

├── extraction/

├── classification/

├── summarization/

├── generation/

├── analysis/

│

└── schemas/

Each prompt is stored independently from application code.

# Acceptance Criteria

The Prompt Library implementation is complete when:

- prompts are externalized from application code

- every prompt has metadata

- every prompt has semantic versioning

- every prompt references an output schema

- variable substitution is deterministic

- regression tests exist for all production prompts

- prompt provenance is recorded during execution

# Relationship to Other Documents

This document defines prompt assets.

Prompt execution is defined in:

- 03-004_AI_WORKFLOW_SPEC.md

Business scoring is defined in:

- 03-006_SCORING_ENGINE_SPEC.md

# References

Depends on:

- 03-004_AI_WORKFLOW_SPEC.md

- 02-001_ARCHITECTURE.md

- 01-002_ENGINEERING_PRINCIPLES.md

Referenced by:

- AI implementation

- Prompt repository

- Workflow orchestrator

- Provider adapters

# Revision History

| **Version** | **Date**                        | **Summary**                                                                                                                  |
|-------------|---------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| 2.0.0       | Initial Engineering Kit release | Defined the Prompt Library architecture, lifecycle, template structure, metadata, versioning, testing, and governance model. |
