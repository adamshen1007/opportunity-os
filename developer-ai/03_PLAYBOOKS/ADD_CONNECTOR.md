# developer-ai/03_PLAYBOOKS/ADD_CONNECTOR.md


Version: 3.0.0

# Purpose

This playbook describes the complete process for adding a new connector to the Data Acquisition Framework.

Examples include:

- Reddit

- Xiaohongshu

- Douyin

- GitHub

- YouTube

- CSV Import

- JSON Import

Every connector follows the same implementation lifecycle.

# Prerequisites

Before implementation:

- Read MISSION.md

- Read ARCHITECTURE_MAP.md

- Read 02-003_DATA_ACQUISITION_FRAMEWORK.md

- Read CONNECTOR_PATTERN.md

# Implementation Steps

## Step 1 — Create Connector Package

Create:

connectors/

└── \<connector-name\>/

├── connector.ts

├── client.ts

├── mapper.ts

├── config.ts

├── types.ts

├── fixtures/

└── __tests__/

## Step 2 — Implement Client

The client is responsible for:

- authentication

- request execution

- pagination

- rate-limit handling

Never perform normalization here.

## Step 3 — Implement Mapper

Translate provider payloads into Raw Content.

Preserve:

- external identifier

- timestamps

- original payload

- provenance

## Step 4 — Register Connector

Add metadata to the Connector Registry.

Declare:

- connector type

- supported capabilities

- authentication strategy

- configuration schema

## Step 5 — Contract Tests

Verify:

- Connector Contract compliance

- fixture compatibility

- idempotent behavior

- retry handling

## Step 6 — Integration Tests

Execute an end-to-end connector run.

Confirm:

- Raw Content persisted

- acquisition events published

- metrics recorded

# Completion Checklist

- Connector registered

- Contract tests pass

- Integration tests pass

- Documentation updated

- No business logic introduced
