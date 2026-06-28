# 03-006_SCORING_ENGINE_SPEC.md


**Document ID:** 03-006
**Version:** 2.0.0
**Status:** Approved (Specification)
**Layer:** 2 – Specification
**Owner:** Intelligence Platform Team

# Scoring Engine Specification

## Purpose

This document defines the deterministic scoring engine used to evaluate and rank Opportunities.

It specifies:

- scoring architecture

- scoring dimensions

- weighting strategy

- normalization

- confidence adjustment

- explainability

- recalculation policy

The Scoring Engine transforms structured intelligence into comparable business opportunities.

# Scope

This specification governs:

- opportunity scoring

- score calculation

- ranking

- confidence adjustment

- explainability

- score versioning

It does **not** govern:

- AI interpretation

- prompt execution

- workflow orchestration

- UI presentation

# Design Principles

The Scoring Engine must be:

- deterministic

- explainable

- reproducible

- testable

- configurable

- versioned

The same inputs must always produce the same outputs.

# High-Level Architecture

Pain Point Clusters

│

▼

Trend Metrics

│

▼

Competition Analysis

│

▼

Scoring Engine

│

▼

Opportunity Score

│

▼

Ranking

The Scoring Engine consumes structured data only.

It never invokes an LLM.

# Scoring Workflow

Load Inputs

│

Normalize Metrics

│

Calculate Dimension Scores

│

Apply Weighting

│

Adjust Confidence

│

Generate Explanation

│

Persist Result

Every step is deterministic.

# Scoring Dimensions

The MVP evaluates Opportunities using six primary dimensions.

## Problem Severity

Measures the impact of the customer problem.

Examples:

- workflow blocker

- financial loss

- time consumption

- frustration level

## Frequency

Measures how often the problem appears.

Signals include:

- mention count

- unique authors

- recurring discussions

## Growth

Measures momentum.

Signals include:

- month-over-month growth

- acceleration

- trend stage

## Competition

Measures market saturation.

Signals include:

- number of competitors

- solution maturity

- differentiation potential

Lower competition generally increases opportunity potential.

## Market Potential

Measures estimated commercial attractiveness.

Signals may include:

- market size

- customer segment size

- purchasing intent

## Execution Complexity

Measures implementation difficulty.

Signals include:

- technical complexity

- regulatory barriers

- operational requirements

Higher complexity reduces the overall score.


# Weighting Strategy

Each scoring dimension has a configurable weight.

Initial MVP defaults:

| **Dimension**        | **Weight** |
|----------------------|------------|
| Problem Severity     | 30%        |
| Frequency            | 20%        |
| Growth               | 20%        |
| Competition          | 15%        |
| Market Potential     | 10%        |
| Execution Complexity | 5%         |

Weights are version-controlled.

Changing weights creates a new scoring engine version.

Historical Opportunity Scores remain reproducible.

# Normalization

Dimension scores are normalized to a common range before weighting.

Normalization ensures:

- comparability

- stability

- predictable score interpretation

Normalization methods are deterministic and documented.

# Confidence Adjustment

The Opportunity Score is distinct from AI confidence.

Confidence adjusts presentation rather than replacing the calculated score.

Confidence inputs include:

- evidence quantity

- evidence diversity

- AI extraction confidence

- cluster stability

Confidence is displayed separately from the Opportunity Score.

# Explainability

Every Opportunity Score must include a machine-readable explanation.

Example explanation structure:

- overall score

- dimension scores

- applied weights

- supporting metrics

- confidence

- scoring engine version

Users must understand why an Opportunity received its score.

# Ranking

Ranking is calculated after scoring.

Primary sort:

- Opportunity Score (descending)

Secondary sort:

- Confidence (descending)

Tertiary sort:

- Growth (descending)

Sorting rules are deterministic.

# Score Versioning

Every calculated score records:

- scoring engine version

- weight configuration version

- calculation timestamp

This guarantees historical reproducibility.


# Recalculation Policy

Scores may be recalculated when:

- new evidence is added

- trend metrics change

- competition analysis is updated

- scoring engine version changes

Recalculation never modifies historical provenance.

Each recalculation creates a new score record linked to the Opportunity.

# Extensibility

Future scoring dimensions may include:

- customer willingness to pay

- technical feasibility

- regulatory risk

- distribution difficulty

- founder–market fit

- strategic alignment

New dimensions must preserve backward compatibility through versioning.

# Testing

The Scoring Engine requires:

- unit tests for each dimension

- deterministic fixture datasets

- regression tests

- edge-case validation

- explainability verification

Every score must be reproducible from identical inputs.

# Acceptance Criteria

The Scoring Engine implementation is complete when:

- all dimensions are deterministic

- weighting is configurable

- normalization is documented

- confidence is reported separately

- explanations are generated automatically

- historical scores remain reproducible

- regression tests pass

# Relationship to Other Documents

This document defines deterministic business evaluation.

AI interpretation is defined in:

- 03-004_AI_WORKFLOW_SPEC.md

Prompt assets are defined in:

- 03-005_PROMPT_LIBRARY_SPEC.md

Opportunity persistence is defined in:

- 03-002_DATABASE_SPEC.md

# References

Depends on:

- 02-002_DOMAIN_MODEL.md

- 03-004_AI_WORKFLOW_SPEC.md

- 03-005_PROMPT_LIBRARY_SPEC.md

Referenced by:

- Frontend Specification

- Opportunity Engine implementation

- Reporting

- Analytics

# Revision History

| **Version** | **Date**                        | **Summary**                                                                                                                                                      |
|-------------|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 2.0.0       | Initial Engineering Kit release | Defined the deterministic scoring architecture, dimensions, weighting strategy, explainability, versioning, and recalculation policy for Opportunity evaluation. |
