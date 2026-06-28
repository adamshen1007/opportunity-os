# 03-003_API_SPEC.md


**Document ID:** 03-003
**Version:** 2.0.0
**Status:** Approved (Specification)
**Layer:** 2 – Specification
**Owner:** Application Platform Team

# API Specification

## Purpose

This document defines the external API exposed by Opportunity OS.

It specifies:

- API architecture

- resource model

- endpoint catalog

- request and response conventions

- authentication

- versioning

- error handling

The API provides a stable contract for dashboards, SDKs, CLI tools, and future integrations.

# Scope

This specification governs:

- REST endpoints

- resource naming

- pagination

- filtering

- sorting

- authentication

- response format

It does **not** define:

- internal service communication

- event contracts

- database implementation

- UI behavior

# API Design Principles

The API follows these principles:

- Resource-oriented

- Stateless

- Versioned

- Predictable

- Idempotent where appropriate

- Backward compatible within a major version

Business logic remains inside the Intelligence Platform.

The API orchestrates requests and responses.

# API Base URL

/api/v1

Major version changes create a new base path.

Minor enhancements remain backward compatible.

# Resource Model

Primary resources:

- Connectors

- Connector Runs

- Raw Content

- Canonical Content

- Pain Points

- Problem Clusters

- Opportunities

- Trends

- Reports

- AI Runs

Resources are exposed independently of database tables.

# Authentication

Supported mechanisms:

- Bearer Token (JWT)

- API Key (future)

- OAuth (future)

Authentication is handled by the Application Platform.

Downstream services trust validated identity rather than authenticating requests directly.

# Standard Response Envelope

All successful responses use a common structure.

{

"data": {},

"meta": {

"requestId": "...",

"apiVersion": "v1"

}

}

Collections additionally include pagination metadata.

# Standard Error Envelope

Errors use a consistent format.

{

"error": {

"code": "RESOURCE_NOT_FOUND",

"message": "Opportunity not found",

"requestId": "...",

"details": {}

}

}

The API never exposes stack traces or internal implementation details.


# Endpoint Catalog

## Health

| **Method** | **Endpoint** | **Purpose**         |
|------------|--------------|---------------------|
| GET        | /health      | Platform health     |
| GET        | /version     | Version information |

## Connectors

| **Method** | **Endpoint**          | **Purpose**       |
|------------|-----------------------|-------------------|
| GET        | /connectors           | List connectors   |
| GET        | /connectors/{id}      | Connector details |
| POST       | /connectors/{id}/runs | Execute connector |
| GET        | /connector-runs       | List executions   |
| GET        | /connector-runs/{id}  | Execution details |

## Content

| **Method** | **Endpoint**            | **Purpose**            |
|------------|-------------------------|------------------------|
| GET        | /canonical-content      | List canonical content |
| GET        | /canonical-content/{id} | Content details        |

Raw Content endpoints are administrative and not exposed by default.

## Pain Points

| **Method** | **Endpoint**      | **Purpose**        |
|------------|-------------------|--------------------|
| GET        | /pain-points      | Search pain points |
| GET        | /pain-points/{id} | Pain point details |

## Problem Clusters

| **Method** | **Endpoint**            | **Purpose**         |
|------------|-------------------------|---------------------|
| GET        | /clusters               | List clusters       |
| GET        | /clusters/{id}          | Cluster details     |
| GET        | /clusters/{id}/evidence | Supporting evidence |
| GET        | /clusters/{id}/trends   | Trend history       |

## Opportunities

| **Method** | **Endpoint**                    | **Purpose**          |
|------------|---------------------------------|----------------------|
| GET        | /opportunities                  | Search opportunities |
| GET        | /opportunities/{id}             | Opportunity details  |
| GET        | /opportunities/{id}/evidence    | Supporting evidence  |
| GET        | /opportunities/{id}/competition | Competition analysis |

## Reports

| **Method** | **Endpoint**  | **Purpose**    |
|------------|---------------|----------------|
| GET        | /reports      | List reports   |
| GET        | /reports/{id} | Report details |

# Query Features

Collection endpoints support:

- pagination

- sorting

- filtering

- full-text search

Common query parameters:

- page

- pageSize

- sort

- order

- search

- category

- market

- dateFrom

- dateTo

The same parameter names are used consistently across resources.

# Idempotency

The following operations are idempotent:

- GET

- PUT

- DELETE

POST requests that trigger connector executions may optionally accept an Idempotency-Key header to prevent accidental duplicate runs.


# HTTP Status Codes

The API uses standard HTTP semantics.

Common responses:

- 200 OK

- 201 Created

- 202 Accepted

- 204 No Content

- 400 Bad Request

- 401 Unauthorized

- 403 Forbidden

- 404 Not Found

- 409 Conflict

- 422 Unprocessable Entity

- 429 Too Many Requests

- 500 Internal Server Error

# API Versioning

Versioning follows semantic principles.

Breaking changes require:

- new API version

- migration documentation

- deprecation period

Existing clients continue to function during supported versions.

# Rate Limiting

The Application Platform may apply configurable rate limits.

Typical response headers:

- X-RateLimit-Limit

- X-RateLimit-Remaining

- Retry-After

Rate limiting policies are deployment-specific and not hard-coded into business services.

# Observability

Every request generates:

- request identifier

- correlation identifier (when applicable)

- execution timing

- structured logs

Long-running operations return identifiers that can be used to query execution status.

# OpenAPI

The canonical OpenAPI specification is generated from the implementation.

This document defines the architectural contract; the generated OpenAPI document is the machine-readable representation.

# Acceptance Criteria

The API implementation is complete when:

- all documented resources are exposed

- response envelopes are consistent

- authentication is enforced

- pagination and filtering are implemented

- OpenAPI documentation is generated automatically

- integration tests validate endpoint behavior

# References

Depends on:

- 02-001_ARCHITECTURE.md

- 02-002_DOMAIN_MODEL.md

- 03-002_DATABASE_SPEC.md

Referenced by:

- Frontend Specification

- SDK generation

- CLI tools

- Integration tests

# Revision History

| **Version** | **Date**                        | **Summary**                                                                                                                     |
|-------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| 2.0.0       | Initial Engineering Kit release | Defined the external REST API architecture, resource model, endpoint catalog, versioning strategy, and operational conventions. |
