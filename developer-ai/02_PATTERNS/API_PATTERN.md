# developer-ai/02_PATTERNS/API_PATTERN.md


Version: 3.0.0

# Purpose

This document defines the standard implementation pattern for REST API endpoints.

Controllers orchestrate requests.

Business logic remains inside domain services.

# Standard Structure

api/

└── opportunities/

├── controller.ts

├── request.ts

├── response.ts

├── mapper.ts

├── validator.ts

└── __tests__/

Each resource follows the same structure.

# Request Lifecycle

1.  Authenticate request

2.  Authorize action

3.  Validate request

4.  Invoke application service

5.  Map domain result to API response

6.  Return standard response envelope

Controllers must not contain business rules.

# Validation

Validate:

- path parameters

- query parameters

- request body

- authentication context

Reject invalid requests before invoking domain services.

# Response Mapping

Never expose database models.

Responses should be mapped from domain objects to API DTOs.

All responses use the standard response envelope.

# Error Handling

Convert domain exceptions into standardized API errors.

Do not expose:

- stack traces

- SQL messages

- provider errors

Include requestId and correlationId where available.

# Versioning

Expose new API versions through versioned routes.

Controllers should remain backward compatible within a major version.

# Testing

Each endpoint requires:

- request validation tests

- authorization tests

- happy-path tests

- error-path tests

- contract tests

- integration tests
