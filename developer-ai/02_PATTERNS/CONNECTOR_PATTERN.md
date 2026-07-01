# developer-ai/02_PATTERNS/CONNECTOR_PATTERN.md


Version: 3.0.0

# Purpose

This document defines the implementation pattern for all connectors.

Every connector must implement the common Connector Contract defined in the Data Acquisition Framework.

# Responsibilities

A connector is responsible only for:

- authentication

- requesting data

- translating provider responses into Raw Content

- publishing acquisition results

A connector is **not** responsible for:

- normalization

- AI analysis

- clustering

- scoring

- persistence decisions beyond Raw Content

# Standard Structure

connectors/

└── reddit/

├── connector.ts

├── client.ts

├── mapper.ts

├── config.ts

├── types.ts

├── fixtures/

└── __tests__/

Use the same structure for every provider.

# Execution Pipeline

1.  Validate configuration

2.  Authenticate

3.  Fetch data

4.  Map to Raw Content

5.  Return batch to Connector Runner

The Connector Runner handles persistence and event publication.

# Provider Isolation

All provider-specific code stays inside the connector package.

No other service should import provider SDKs directly.

# Idempotency

Connectors should expose stable external identifiers.

The framework uses these identifiers for deduplication.

# Observability

Record:

- execution duration

- records fetched

- rate-limit information

- retry count

Never log credentials or raw authentication tokens.

# Testing

Each connector must include:

- fixture responses

- contract tests

- integration tests

- error-path tests

Every connector should pass the shared Connector Contract test suite.
