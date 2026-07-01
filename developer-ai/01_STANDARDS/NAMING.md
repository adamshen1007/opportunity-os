# developer-ai/01_STANDARDS/NAMING.md


Version: 3.0.0

# Purpose

This document defines naming conventions for Opportunity OS.

Consistency is more important than personal preference.

# General Rules

Names should be:

- descriptive

- unambiguous

- domain-oriented

- consistent

Avoid abbreviations unless universally understood.

# Domain Objects

Use business terminology.

Correct:

- Opportunity

- PainPoint

- CanonicalContent

- ConnectorRun

Avoid:

- DataItem

- Object

- Entity1

# Services

Pattern:

\<BusinessCapability\>Service

Examples:

- ScoringService

- TrendService

- ConnectorRunnerService

# Repositories

Pattern:

\<Entity\>Repository

Examples:

- OpportunityRepository

- ConnectorRepository

# Events

Past tense.

Examples:

- OpportunityCreated

- PainPointExtracted

- ConnectorCompleted

Never use commands as event names.

# API

Resources are plural nouns.

Examples:

/opportunities

/connectors

/clusters

Actions appear only where appropriate.

# Database

Tables:

snake_case plural

Examples:

opportunities

pain_points

connector_runs

Columns:

snake_case

Primary keys:

id

Foreign keys:

entity_id

# Constants

UPPER_SNAKE_CASE

# Variables

camelCase

# Classes

PascalCase

# Files

kebab-case unless language conventions require otherwise.

Consistency within a language ecosystem takes precedence.
