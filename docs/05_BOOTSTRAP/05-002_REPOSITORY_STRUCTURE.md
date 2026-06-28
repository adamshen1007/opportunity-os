# 05-002_REPOSITORY_STRUCTURE.md


**Document ID:** 05-002
**Version:** 2.0.0

# Repository Structure

opportunity-os/

developer-ai/

docs/

examples/

prompts/

schemas/

apps/

web/

api/

packages/

domain/

events/

ai/

acquisition/

intelligence/

application/

shared/

config/

database/

ui/

infrastructure/

docker/

.github/

scripts/

package.json

pnpm-workspace.yaml

turbo.json

docker-compose.yml

README.md

# Package Responsibilities

## domain

Business entities

No infrastructure.

## acquisition

Connector Framework

## intelligence

AI Workflows

Trend Engine

Opportunity Engine

## application

REST API

Authentication

Dashboard Services

## ai

Provider adapters

Prompt resolver

Workflow runner

## database

Prisma

Repositories

Migrations

## shared

Utilities

Errors

Logging

Types

Validation

# Dependency Rules

Allowed:

apps

↓

application

↓

intelligence

↓

acquisition

↓

domain

↓

shared

Reverse dependencies prohibited.
