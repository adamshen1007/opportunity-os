# developer-ai/02_PATTERNS/SERVICE_PATTERN.md


Version: 3.0.0

# Purpose

This document defines the standard implementation pattern for application and domain services.

Every new service in Opportunity OS should follow this structure unless an approved Architecture Decision Record (ADR) explicitly states otherwise.

# Responsibilities

A service owns **one business capability**.

Examples:

- ScoringService

- TrendService

- OpportunityService

- NormalizationService

A service must not own unrelated responsibilities.

# Standard Structure

service/

├── service.ts

├── types.ts

├── errors.ts

├── mapper.ts

├── validator.ts

├── index.ts

└── __tests__/

Keep service-specific logic together.

# Constructor Dependencies

Inject dependencies through constructors.

Typical dependencies:

- Repository

- EventPublisher

- Logger

- Metrics

- Clock

- Configuration

Never instantiate infrastructure dependencies inside business services.

# Execution Flow

Every service follows the same flow:

1.  Validate input

2.  Load required data

3.  Execute business logic

4.  Persist changes

5.  Publish domain events

6.  Return result

Do not reorder these steps without a documented reason.

# Business Logic

Business logic should be:

- deterministic

- side-effect aware

- isolated

- independently testable

Never mix HTTP, SQL, or provider-specific code into business services.

# Error Handling

Handle only expected business errors.

Unexpected infrastructure errors should propagate to the application layer after being logged with the correlation ID.

# Testing

Every service requires:

- unit tests

- mocked dependencies

- edge-case coverage

- regression tests for fixed defects

# Checklist

Before merging a service:

- One responsibility

- Constructor injection

- No infrastructure coupling

- Domain events published

- Tests pass

- Documentation updated
