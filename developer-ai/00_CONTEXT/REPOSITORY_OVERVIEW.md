# developer-ai/00_CONTEXT/REPOSITORY_OVERVIEW.md


# Repository Overview

Version: 2.0.0

## Repository Structure

backend/

frontend/

packages/

docs/

developer-ai/

schemas/

prompts/

examples/

infrastructure/

## Backend

Contains:

- Data Acquisition Framework

- Intelligence Platform

- Application Platform

Business logic lives here.

## Frontend

Contains:

- Dashboard

- Opportunity Explorer

- Reports

- Connector Management

Never implement business rules here.

## Packages

Contains shared libraries.

Examples:

- domain

- events

- contracts

- utilities

## Schemas

Contains machine-readable contracts.

Examples:

- OpenAPI

- JSON Schema

- Event Schemas

## Prompts

Contains only version-controlled prompts.

Never place prompts inside application code.

## Documentation

Always treat:

docs/

as the source of truth.

Never infer architecture from code.

If documentation and implementation disagree,

documentation wins.

## Before Starting Any Task

1.  Read MISSION.md

2.  Read ARCHITECTURE_MAP.md

3.  Read the relevant specification

4.  Identify affected services

5.  Implement only documented behavior

6.  Write tests

7.  Verify architecture has not changed

Only then should a Pull Request be considered complete.
