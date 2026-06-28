# developer-ai/03_PLAYBOOKS/ADD_DATABASE_TABLE.md


Version: 2.0.0

# Purpose

This playbook defines the process for introducing new persistent entities.

All schema changes must preserve compatibility with the Domain Model.

# Prerequisites

Read:

- 02-002_DOMAIN_MODEL.md

- 03-002_DATABASE_SPEC.md

- REPOSITORY_PATTERN.md

# Implementation Steps

## Step 1 — Confirm Domain Ownership

Verify the entity belongs to an existing aggregate.

If not, create or update an Architecture Decision Record before proceeding.

## Step 2 — Create Migration

Add:

- table

- constraints

- indexes

- foreign keys

Do not modify immutable evidence tables.

## Step 3 — Update Repository

Create or extend the appropriate repository.

Repositories expose domain objects rather than persistence models.

## Step 4 — Add Domain Mapping

Implement mapping between persistence models and domain entities.

Keep mapping logic outside business services.

## Step 5 — Testing

Verify:

- migration succeeds

- rollback (where supported)

- referential integrity

- CRUD operations

- repository behavior

## Step 6 — Documentation

Update:

- DATABASE_SPEC.md (if schema changes)

- ER diagrams (if maintained)

- migration history

# Completion Checklist

- Migration created

- Repository updated

- Tests passing

- Documentation updated

- Domain invariants preserved
