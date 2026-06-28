# .ai/03_PLAYBOOKS/ADD_API_ENDPOINT.md


Version: 2.0.0

# Purpose

This playbook defines the standard process for adding a new REST API endpoint.

Every endpoint must conform to the API architecture, response conventions, authentication model, and testing requirements defined in the Engineering Kit.

# Prerequisites

Read:

- 03-003_API_SPEC.md

- API_PATTERN.md

- CODING_STANDARDS.md

# Implementation Steps

## Step 1 — Confirm Resource Design

Verify that the endpoint belongs to an existing resource.

Examples:

- /opportunities

- /clusters

- /connectors

Avoid introducing action-oriented endpoints unless explicitly justified.

## Step 2 — Create Endpoint Structure

Create:

api/

└── \<resource\>/

├── controller.ts

├── request.ts

├── response.ts

├── validator.ts

├── mapper.ts

└── __tests__/

## Step 3 — Implement Controller

Controller responsibilities:

- authenticate

- authorize

- validate

- invoke application service

- map response

Controllers must not implement business logic.

## Step 4 — Define DTOs

Create request and response DTOs.

DTOs should:

- hide internal implementation

- expose stable contracts

- support API versioning

## Step 5 — Update OpenAPI

Ensure:

- endpoint documented

- request schema updated

- response schema updated

- examples added

Generated OpenAPI must remain synchronized with implementation.

## Step 6 — Testing

Verify:

- authentication

- authorization

- validation

- success response

- error response

- pagination/filtering (if applicable)

# Completion Checklist

- Endpoint implemented

- DTOs complete

- OpenAPI updated

- Tests passing

- No business logic in controller
